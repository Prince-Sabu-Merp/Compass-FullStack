import React from "react";
import ValueCard from "../cards/ValueCard";
import FinancialOverviewCard from "../cards/FinancialOverviewCard";
import TransactionGridCard from "../cards/TransactionRecordsCard";
import BudgetChartCard from "../cards/BudgetChartCard";
import IncomeCategoryCard from "../cards/incomeCategoryCard";
import ExpenseCategoryCard from "../cards/ExpenseCategorycard";
import GoalChart from "../cards/GoalChartCard";
import BudgetRemainingChartCard from "../cards/BudgetRemainingChartCard";
import IncomeAndExpenseChartCard from "../cards/IncomeAndExpenseChartCard";
import PortfolioCard from "../cards/PortfolioCard";
import MutualFunds from "../cards/MutualFunds";

const hubData = {
  income: { monthly: [11111111, 10], yearly: [22222222, 15] },
  expense: { monthly: [33333333, -5], yearly: [44444444, 2] },
  monthlyRemaining: 100000000,
  investments: { monthly: [55555555, 20], yearly: [66666666, 25] },
  target: { remaining: [3000, 30], achieved: [7000, 70] },
  debt: { remaining: [10000000, -10], payed: [20000000, 25] },
  goal: { achieved: [77777777, 10], Remaining: [88888888, 20] },
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

function hub(props) {
  return (
    <>
      <div className=" border-blue-300  w-full">
        {/* <!-- cards --> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {/* income Card */}
          <ValueCard
            bgClass="bg-gradient-to-l from-blue-300 to-blue-500"
            cardId="income"
            titleClass="income-title"
            valueClass="income-value"
            percentId="incomePercent"
            currencyCode={hubData.metadata.currencyCode}
            title1="Total Earned This Month"
            title2="Total Earned This Year"
            value1={hubData.income.monthly[0]}
            value2={hubData.income.yearly[0]}
            percentValue1={hubData.income.monthly[1]}
            percentValue2={hubData.income.yearly[1]}
            showToggle={true}
          />

          {/* Expense Card */}
          <ValueCard
            bgClass="bg-gradient-to-tr from-gray-800 to-gray-950"
            cardId="expense"
            titleClass="expense-title"
            valueClass="expense-value"
            percentId="expensePercent"
            currencyCode={hubData.metadata.currencyCode}
            title1="Total Spent This Month"
            title2="Total Spent This Year"
            value1={hubData.expense.monthly[0]}
            value2={hubData.expense.yearly[0]}
            percentValue1={hubData.expense.monthly[1]}
            percentValue2={hubData.expense.yearly[1]}
            showToggle={true}
          />

          {/* Remaining card */}
          <ValueCard
            bgClass="bg-gradient-to-t from-blue-400 to-blue-600"
            cardId="spendingRemaining"
            titleClass="spending-remaining-title"
            valueClass="spending-remaining-value"
            percentId=""
            currencyCode={hubData.metadata.currencyCode}
            title1="Available to Use This Month"
            title2=""
            value1={hubData.monthlyRemaining}
            value2=""
            percentValue1=""
            percentValue2=""
          />
          {/* Investments */}
          <ValueCard
            bgClass="bg-gradient-to-tr from-gray-800 to-gray-950"
            cardId="investments"
            titleClass="investment-title"
            valueClass="investment-value"
            percentId="investmentPercent"
            currencyCode={hubData.metadata.currencyCode}
            title1="Invested This Month"
            title2="Invested This Year"
            value1={hubData.investments.monthly[0]}
            value2={hubData.investments.yearly[0]}
            percentValue1={hubData.investments.monthly[1]}
            percentValue2={hubData.investments.yearly[1]}
            showToggle={true}
          />

          {/* Debt */}

          <ValueCard
            bgClass="bg-gradient-to-bl from-blue-400 to-blue-500"
            cardId="investments"
            titleClass="investment-title"
            valueClass="investment-value"
            percentId="investmentPercent"
            currencyCode={hubData.metadata.currencyCode}
            title1="Remaining Payable"
            title2="Cleared Amount"
            value1={hubData.debt.payed[0]}
            value2={hubData.debt.remaining[0]}
            percentValue1={hubData.debt.payed[1]}
            percentValue2={hubData.debt.remaining[1]}
            showToggle={true}
          />

          {/* Goal */}

          <ValueCard
            bgClass="bg-gradient-to-tl from-gray-800 to-gray-950"
            cardId="goal"
            titleClass="goal-title"
            valueClass="goal-value"
            percentId="goalPercent"
            currencyCode={hubData.metadata.currencyCode}
            title1="Remaining to Goal"
            title2="Gaol Achieved So Far"
            value1={hubData.goal.Remaining[0]}
            value2={hubData.goal.achieved[0]}
            percentValue1={hubData.goal.Remaining[1]}
            percentValue2={hubData.goal.achieved[1]}
            showToggle={true}
          />
        </div>

        {/* <!-- pi harts --> */}
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
          <BudgetChartCard />
          <BudgetRemainingChartCard />
          <IncomeAndExpenseChartCard />
          <GoalChart />
        </div>

        {/* <!-- Overall Graph  --> */}
        <div className="p-4">
          <FinancialOverviewCard />
        </div>

        {/* <!-- Other graph --> */}
        <div className="gap-4 p-4 grid lg:grid-cols-2">
          <IncomeCategoryCard />
          <ExpenseCategoryCard />
        </div>

        {/* <!-- Table --> */}
        <div className="p-4">
          <TransactionGridCard />
        </div>

        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
          <PortfolioCard />
          <MutualFunds />
          
        </div>

        {/* <!-- large graph --> */}
        <div className="p-4">
          <div className="bg-white rounded-xl h-85 shadow p-3 hover:shadow-xl">
            <div className="h-full w-full overflow-hidden">
              <div className="w-full bg-white" id="TotalInceomGraph"></div>
            </div>
          </div>
        </div>

        {/* <!-- Footer --> */}
        <div className="p-4"></div>
      </div>
    </>
  );
}

export default hub;
