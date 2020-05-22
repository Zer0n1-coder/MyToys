#pragma once

template<class T>
class MySmartPtr final
{
protected:
	struct SmartPtrStorage
	{
		T*				ptr{nullptr};
		unsigned long		count{1};
	};

public:
	MySmartPtr(){}

	explicit MySmartPtr(T* ptr)
	{
		if (ptr)
		{
			_storge = new SmartPtrStorage();
			_storge->ptr = ptr;
		}
	}

	MySmartPtr(const MySmartPtr& ptr)
	{
		_storge = ptr._storge;
		_MT_INCR(_storge->count);
	}

	~MySmartPtr()
	{
		if (_storge)
		{
			if (_MT_DECR(_storge->count) == 0)
			{
				delete _storge->ptr;
				delete _storge;
			}
		}
	}

public:
	MySmartPtr& operator=(const MySmartPtr& ptr)
	{
		if (this == &ptr)
			return *this;

		if (this->_storge)
		{
			if (_MT_DECR(_storge->count) == 0)
			{
				delete _storge->ptr;
				delete _storge;
				_storge = nullptr;
			}
		}
		_storge = ptr._storge;
		_MT_INCR(_storge->count);

		return *this;
	}

	operator bool()
	{
		if (_storge && _storge->ptr)
			return true;
		else
			return false;
	}
public:
	T* get()
	{
		if (_storge)
		{
			return _storge->ptr;
		}
		else
			return nullptr;
	}

private:
	SmartPtrStorage* _storge{nullptr};
};

template<class T,class...Types>
MySmartPtr<T> make_ptr(Types&&... args)
{
	return MySmartPtr<T>(new T(std::forward<Types>(args)...));
}