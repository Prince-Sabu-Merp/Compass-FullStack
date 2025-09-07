import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// Data for the current month's income and expense
const thisMonthIncomeAndExpense = {
  data: { income: "52000", expense: "25000" },
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

function IncomeExpenseComparisonCard() {
  // Take the values directly from the new data object and convert them to numbers
  const totalIncome = parseInt(thisMonthIncomeAndExpense.data.income);
  const totalExpenses = parseInt(thisMonthIncomeAndExpense.data.expense);
  const currencyCode = thisMonthIncomeAndExpense.metadata.currencyCode;

  const [chartState] = useState({
    series: [
      {
        name: "Amount",
        data: [totalIncome, totalExpenses],
      },
    ],
    options: {
      chart: {
        height: "100%",
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#00E396", "#FF4560"], // Green for Income, Red for Expense
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: ["Income", "Expense"],
        labels: {
          style: {
            colors: ["#00E396", "#FF4560"],
            fontSize: "12px",
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (val) {
            return currencyCode + val;
          },
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return currencyCode + val;
          },
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow p-3 hover:shadow-xl flex flex-col items-center">
      <h5 className="italic font-semibold text-xl mb-4 w-full">
        Monthly Income vs. Expense
      </h5>
      <div className="flex-grow w-full min-h-80 flex justify-center items-center">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}

// The main App component to render the new chart.
export default function App() {
  return (
    <>
      <IncomeExpenseComparisonCard />
    </>
  );
}
