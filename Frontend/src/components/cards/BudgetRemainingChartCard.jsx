import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// BudgetRemainingChartCard component to display a radial bar chart for budget tracking.
function BudgetRemainingChartCard() {
  // Sample data for different budget categories.
  const budgetData = {
    data: [
      { name: "Invest", used: 800, total: 6854 },
      { name: "Expense", used: 1500, total: 135478 },
      { name: "Learning", used: 654, total: 1200 },
      { name: "Happiness", used: 500, total: 1200 },
      { name: "No Touch", used: 10000, total: 10000 },
      { name: "Emergency", used: 9000, total: 16000 },
    ],
    metadata: {
      lastUpdated: "2025-08-01",
      currency: "INR",
      currencyCode: "₹",
      source: "internal",
    },
  };

  // The series now calculates the percentage of the budget that has been used.
  const seriesData = budgetData.data.map(
    (budget) => (budget.used / budget.total) * 100
  );
  const labelsData = budgetData.data.map((budget) => budget.name);

  // Simplified calculation for hollow.size for a consistent graph appearance.
  const hollowSize = "25%";

  // Initialize the chart state with the calculated series and the chart options.
  const [chartState] = useState({
    series: seriesData,
    options: {
      chart: {
        height: "100%",
        type: "radialBar",
        fontFamily: "Inter, sans-serif",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: hollowSize,
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              label: "Usage",
              // Formatter now calculates the overall usage percentage.
              formatter: function (w) {
                const totalUsed = budgetData.data.reduce(
                  (sum, budget) => sum + budget.used,
                  0
                );
                const totalBudget = budgetData.data.reduce(
                  (sum, budget) => sum + budget.total,
                  0
                );
                const overallPercentage = (
                  (totalUsed / totalBudget) *
                  100
                ).toFixed(1);
                return `${overallPercentage}%`;
              },
            },
          },
        },
      },
      colors: ["#00E396", "#0090FF", "#FEB019", "#FF4560"],
      labels: labelsData,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        custom: function ({ series, seriesIndex, w }) {
          const budget = budgetData.data[seriesIndex];
          const usedAmount = budget.used;
          const remainingAmount = budget.total - budget.used;
          // The tooltip now shows the usage percentage.
          const percentUsed = series[seriesIndex].toFixed(1);
          const budgetName = w.globals.labels[seriesIndex];
          const currencyCode = budgetData.metadata.currencyCode;

          return `
            <div class="rounded-lg bg-white p-4 shadow-lg text-gray-800 border border-gray-200">
              <h4 class="font-bold text-lg mb-2">${budgetName}</h4>
              <p><strong>Total:</strong> ${currencyCode}${budget.total}</p>
              <p><strong>Used:</strong> ${currencyCode}${usedAmount}</p>
              <p><strong>Remaining:</strong> ${currencyCode}${remainingAmount}</p>
              <p><strong>Percent Used:</strong> ${percentUsed}%</p>
            </div>
          `;
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow p-3 hover:shadow-xl  flex flex-col items-center">
      <h5 className="italic font-semibold text-xl mb-4 w-full">
        Monthly Budget Utilization
      </h5>
      <div className="flex-grow w-full min-h-80 flex justify-center items-center">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="radialBar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}

// The main App component to render the BudgetRemainingChartCard.
export default function App() {
  return (
    <>
      <BudgetRemainingChartCard />
    </>
  );
}
