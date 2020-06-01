#pragma once
#include<type_traits>

//money量纲,rate为兑换一种中间货币的汇率，此处假设RMB为中间货币
struct Dollar
{
	static constexpr float rate = 7.0;
};

struct RMB
{
	static constexpr float rate = 1.0;
};

//利用SFINAE让不含有rate的class不允许初始化，注：本想使用concept的，但是当前编译器不支持
template<class T,class = void>
class Money final
{
	constexpr Money(){}
	~Money() = delete;
};

template<class T>
class Money<T,std::void_t<decltype(T::rate)>> final		//final禁止被继承
{
public:
	Money() = default;			//使用默认的
	~Money() = default;

	explicit Money(const double balance)noexcept : _balance{ balance } {}		//不抛异常
	Money(const Money& money) = delete;		//删除拷贝构造函数
	Money(Money&& money) noexcept { _balance = money._balance;  money._balance = 0.0; }		//移动构造函数

public:
	Money& operator=(const Money& money) = delete;		//删除拷贝赋值运算符
	Money& operator=(Money&& money){ _balance = money._balance; money._balance = 0.0; }		//移动赋值运算符

	Money& operator++() { _balance += 1.0; return *this; }				//选择具有代表性的++运算符进行重载，其他的类似
	Money operator++(int) { double tmp = _balance; _balance += 1.0;  return Money(tmp); }

	operator bool() { if (_balance <= 0.000001) return false; return true; }		//类型转换运算符

public: //重载new delete运算符
	static void* operator new(rsize_t){ void* ptr = malloc(sizeof(Money)); return ptr; }  
	static void operator delete(void* ptr) { free(ptr); }

public://访问接口
	void setBalance(const double balance) { _balance = balance; }

	double getBalance() { return _balance; }
	double getBalance()const { return _balance; }

private:
	double	_balance{0.0};	//初始化列表
};


//货币转换
template<class T1,class T2>
auto convert(Money<T1>&& money)->Money<T2>
{
	double tmp = money.getBalance();
	money.setBalance(0.0);

	return Money<T2>(tmp * T1::rate / T2::rate);
}

//转账
template<class T>
T transferAccounts(T&& money)
{
	return T(std::forward<T>(money));		//完美转发
	//return T(money);
}
