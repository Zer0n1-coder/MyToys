#pragma once

template<class T>
class MySmartPtr final
{
protected:
	struct SmartPtrStorage
	{
		constexpr SmartPtrStorage() noexcept = default;
		~SmartPtrStorage()noexcept { if (ptr) { delete ptr; ptr = nullptr; } }
		T*				ptr{nullptr};
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

	MySmartPtr* operator->()const noexcept { return get(); }
	MySmartPtr& operator*()const noexcept { return *get(); }

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
private:
	explicit MySmartPtr(T* ptr)
	{
		_storge = new SmartPtrStorage();
		_storge->ptr = ptr;
	}

	static void* operator new(size_t) = delete;
	static void operator delete(void*) = delete;

private:
	template<class Type, class...Types>
	friend MySmartPtr<Type> make_ptr(Types&&... args);

	SmartPtrStorage* _storge{nullptr};
};

template<class Type,class...Types>
MySmartPtr<Type> make_ptr(Types&&... args)
{
	return MySmartPtr<Type>(new Type(std::forward<Types>(args)...));
}