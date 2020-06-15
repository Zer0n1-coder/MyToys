#pragma once
#include <mutex>

template<class T>
class LockingProxy
{
public:
	LockingProxy(T* ptr, std::mutex& mutex)noexcept :_ptr(ptr),_ptrMutex(&mutex) { _ptrMutex->lock(); }
	constexpr explicit LockingProxy(std::nullptr_t)noexcept {}
	~LockingProxy() { if(_ptrMutex) _ptrMutex->unlock(); }

	T* operator->()const noexcept { return _ptr; }
	T& operator*()const noexcept { return *_ptr; }

	LockingProxy& operator=(const LockingProxy&) = delete;
private:
	std::mutex*		_ptrMutex{nullptr};
	T*			_ptr{ nullptr };
};

template<class T>
class MySmartPtr final
{
protected:
	struct SmartPtrStorage
	{
		constexpr SmartPtrStorage() noexcept = default;
		~SmartPtrStorage()noexcept { if (ptr) { delete ptr; ptr = nullptr; } }
		
		std::mutex		ptr_mutex;
		T*			ptr{nullptr};
		unsigned long		count{1};
	};

public:
	constexpr MySmartPtr() noexcept{}
	constexpr MySmartPtr(nullptr_t) noexcept {}

	MySmartPtr(const MySmartPtr& ptr) noexcept
	{
		_storge = ptr._storge;
		_MT_INCR(_storge->count);
	}

	~MySmartPtr() noexcept
	{
		if (_storge)
		{
			if (_MT_DECR(_storge->count) == 0)
				delete _storge;
		}
	}

public:
	MySmartPtr& operator=(const MySmartPtr& ptr) noexcept
	{
		if (this == &ptr)
			return *this;

		if (_storge)
		{
			if (_MT_DECR(_storge->count) == 0)
			{
				delete _storge;
				_storge = nullptr;
			}
		}
		_storge = ptr._storge;
		_MT_INCR(_storge->count);

		return *this;
	}

	LockingProxy<T> operator->()const noexcept { return _storge? LockingProxy<T>(_storge->ptr,_storge->ptr_mutex):  LockingProxy<T>(nullptr); }
	LockingProxy<T> operator*()const noexcept { return _storge ? LockingProxy<T>(_storge->ptr, _storge->ptr_mutex) :  LockingProxy<T>(nullptr); }

	operator bool()
	{
		if (_storge && _storge->ptr)
			return true;
		else
			return false;
	}
public:
	long count()const noexcept{ return _storge ? static_cast<long>(_storge->count):0; }

	T* get() const noexcept { _storge? _storge->ptr : nullptr; }

public:
	template<class...Types>
	static MySmartPtr make_ptr(Types&&... args)
	{
		return MySmartPtr(new T(std::forward<Types>(args)...));
	}

private:
	explicit MySmartPtr(T* ptr)
	{
		_storge = new SmartPtrStorage();
		_storge->ptr = ptr;
	}

	static void* operator new(size_t) = delete;
	static void operator delete(void*) = delete;

private:
	//template<class Type, class...Types>
	//friend MySmartPtr<Type> make_ptr(Types&&... args);

	SmartPtrStorage* _storge{nullptr};
};

//template<class Type,class...Types>
//MySmartPtr<Type> make_ptr(Types&&... args)
//{
//	return MySmartPtr<Type>(new Type(std::forward<Types>(args)...));
//}
