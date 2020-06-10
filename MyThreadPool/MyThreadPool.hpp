#pragma once
#include <future>
#include <queue>
#include "3rd/jthread.hpp"

class ThreadPool final
{
public:
	explicit ThreadPool(size_t);
	~ThreadPool();

	template<class F,class...ArgTypes>
	auto enqueue(F&& f, ArgTypes&&... args)->std::shared_future<typename std::invoke_result_t<F, ArgTypes...>>;

private:
	std::vector<std::jthread>			workers;

	std::mutex							queue_mutex;
	std::queue<std::function<void()>>	tasks;
	
	std::condition_variable condition;
	std::atomic<bool>		stop{false};
};

inline ThreadPool::ThreadPool(size_t threads)
{
	workers.resize(threads);
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
->std::shared_future<typename std::invoke_result_t<F, ArgTypes...>>
{
	using return_type = typename std::invoke_result_t<F, ArgTypes...>;

	auto task = std::make_shared<std::packaged_task<return_type()>>(
		std::bind(std::forward<F>(f), std::forward<ArgTypes>(args)...)
		);

	std::shared_future<return_type> ret = task->get_future();
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
	stop.store(true);
	condition.notify_all();

	while (!this->tasks.empty()){}
}
