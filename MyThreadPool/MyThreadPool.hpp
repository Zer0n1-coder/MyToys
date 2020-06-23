#pragma once
#include <future>
#include <queue>
#include "3rd/jthread.hpp"

class ThreadPool final //禁止继承（无关痛痒）			
{
public:
	explicit ThreadPool(size_t);	//显式构造（无关痛痒）
	~ThreadPool();

	template<class F,class...ArgTypes>
	auto enqueue(F&& f, ArgTypes&&... args)->std::shared_future<typename std::invoke_result_t<F, ArgTypes...>>;

private:
	std::vector<std::jthread>		workers;	//使用C++20新增线程库，当前未有，所以使用别人的准标准库

	std::mutex				queue_mutex;	
	std::queue<std::function<void()>>	tasks;
	
	std::condition_variable 	condition;
	std::atomic<bool>		stop{false};		//原子操作，虽然是C++11的，但原作者未用，它用一个互斥量管理了两个共享变量？
};

inline ThreadPool::ThreadPool(size_t threads)
{
	workers.resize(threads);		//提前申请足额内存空间，避免发生空间再分配（也算是无关痛痒）
	for (size_t i = 0; i < threads; ++i)
		workers[i] = std::jthread(
			[this]
			{
				for (;;)
				{
					std::function<void()> task;

					{
						std::unique_lock<std::mutex> lock(this->queue_mutex);
						this->condition.wait(lock,
							[this] { return this->stop || !this->tasks.empty(); });

						if (this->stop && this->tasks.empty())
							return;

						task = std::move(this->tasks.front());
						this->tasks.pop();
					}

					task();
				}
			}
		);
}

template<class F, class...ArgTypes>
auto ThreadPool::enqueue(F&& f, ArgTypes&&... args)
->std::shared_future<typename std::invoke_result_t<F, ArgTypes...>> //最关键的地方，原库编译不过就是因为原库使用的std::result_of在C++17删除了
{
	using return_type = typename std::invoke_result_t<F, ArgTypes...>;

	auto task = std::make_shared<std::packaged_task<return_type()>>(
		std::bind(std::forward<F>(f), std::forward<ArgTypes>(args)...)
		);

	std::shared_future<return_type> ret = task->get_future();//原库是std::future，我改成了std::shared_future，README的说明里有代码说明
	{
		std::unique_lock<std::mutex> lock(queue_mutex);

		if (stop)
			throw std::runtime_error("enqueue on stopped ThreadPool");

		tasks.emplace([task]() { (*task)(); });
	}
	condition.notify_one();
	return ret;
}

inline ThreadPool::~ThreadPool()
{
	stop.store(true);		//原库用了锁，用了原子操作后不需要上锁
	condition.notify_all();

	while (!this->tasks.empty()){}	//这是我瞎折腾的时候，遇到的一个可能不算常见的问题，在README的说明里有代码说明其原因
}
