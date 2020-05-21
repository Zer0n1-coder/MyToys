#include <vector>
#include "Money.h"

//test
int main()
{
	Money<RMB> mine(138);		//balance:138
	//Money<double> tmp;	failed!;
	//Money<RMB> his(mine); failed!;
	Money<RMB> her(std::move(mine));	//her.balance:138 ,mine.balance:0
	her++;	//balance:139
	++her;	//balance:140
	auto hasMoney = bool(mine);		//false;
	auto dollar = convert<RMB, Dollar>(std::move(her)); //her.balance : 0  dollar: 20
	auto newMoney = new Money<RMB>(20);
	delete newMoney;
	newMoney = nullptr;

	std::vector<Money<RMB>> purse;
	purse.emplace_back(100);
	purse.emplace_back(50);
	purse.emplace_back(10);
	purse.emplace_back(1);

	return 0;
}
