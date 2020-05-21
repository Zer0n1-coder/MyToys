#pragma once
#include<type_traits>

//money����,rateΪ�һ�һ���м���ҵĻ��ʣ��˴�����RMBΪ�м����
struct Dollar
{
	static constexpr float rate = 7.0;
};

struct RMB
{
	static constexpr float rate = 1.0;
};

//����SFINAE�ò�����rate��class�������ʼ����ע������ʹ��concept�ģ����ǵ�ǰ��������֧��
template<class T,class = void>
class Money final
{
	Money(){}
	~Money(){}
};

template<class T>
class Money<T,std::void_t<decltype(T::rate)>> final		//final��ֹ���̳�
{
public:
	Money() = default;			//ʹ��Ĭ�ϵ�
	~Money() = default;

	explicit Money(const double balance)noexcept : _balance{ balance } {}		//�����쳣
	Money(const Money& money) = delete;		//ɾ���������캯��
	Money(Money&& money) noexcept { _balance = money._balance;  money._balance = 0.0; }		//�ƶ����캯��

public:
	Money& operator=(const Money& money) = delete;		//ɾ��������ֵ�����
	Money& operator=(Money&& money){ _balance = money._balance; money._balance = 0.0; }		//�ƶ���ֵ�����

	Money& operator++() { _balance += 1.0; return *this; }				//ѡ����д����Ե�++������������أ�����������
	Money operator++(int) { double tmp = _balance; _balance += 1.0;  return Money(tmp); }

	operator bool() { if (_balance <= 0.000001) return false; return true; }		//����ת�������

public: //����new delete�����
	static void* operator new(rsize_t){ void* ptr = malloc(sizeof(Money)); return ptr; }  
	static void operator delete(void* ptr) { free(ptr); }

public://���ʽӿ�
	void setBalance(const double balance) { _balance = balance; }

	double getBalance() { return _balance; }
	double getBalance()const { return _balance; }

private:
	double	_balance{0.0};	//��ʼ���б�
};


//����ת��
template<class T1,class T2>
auto convert(Money<T1>&& money)->Money<T2>
{
	double tmp = money.getBalance();
	money.setBalance(0.0);

	return Money<T2>(tmp * T1::rate / T2::rate);
}

//ת��
template<class T>
T transferAccounts(T&& money)
{
	return T(std::forward<T>(money));		//����ת��
	//return T(money);
}