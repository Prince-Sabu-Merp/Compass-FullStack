import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// GoalTrackerChart component to display a radial bar chart for goal tracking.
function GoalTrackerChart() {
  // Sample data for different goals.
  const goalsData = {
    data: [
      { name: "G-Waggon", achieved: 12000, target: 200000 },
      { name: "Kia Seltos", achieved: 9000, target: 300000 },
    ],
    metadata: {
      lastUpdated: "2025-06-15",
      currency: "INR",
      currencyCode: "₹",
      source: "internal",
    },
  };

  const seriesData = goalsData.data.map(
    (goal) => (goal.achieved / goal.target) * 100
  );
  const labelsData = goalsData.data.map((goal) => goal.name);

  // --- Dynamic calculation for hollow.size based on the number of goals ---
  const numberOfGoals = goalsData.data.length;
  let hollowSize = "20%"; // Default size

  if (numberOfGoals === 1) {
    hollowSize = "40%"; // Larger hollow for a single goal
  } else if (numberOfGoals === 2) {
    hollowSize = "42%"; // Medium hollow for two goals
  } else {
    hollowSize = "45%"; // Smaller hollow for three or more goals
  }
  // --- End of dynamic calculation ---

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
            size: hollowSize, // Use the dynamically calculated size here
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
              label: "Total Progress",
              formatter: function (w) {
                const totalProgress = (
                  w.globals.series.reduce((a, b) => a + b, 0) /
                  w.globals.series.length
                ).toFixed(1);
                return `${totalProgress}%`;
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
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const goal = goalsData.data[seriesIndex];
          const achievedAmount = goal.achieved;
          const remainingAmount = goal.target - goal.achieved;
          const percentAchieved = series[seriesIndex].toFixed(1);
          const goalName = w.globals.labels[seriesIndex];
          const currencyCode = goalsData.metadata.currencyCode;

          return `
            <div class="rounded-lg bg-white p-4 shadow-lg text-gray-800 border border-gray-200">
              <h4 class="font-bold text-lg mb-2">${goalName}</h4>
              <p><strong>Achieved:</strong> ${currencyCode}${achievedAmount}</p>
              <p><strong>Remaining:</strong> ${currencyCode}${remainingAmount}</p>
              <p><strong>Progress:</strong> ${percentAchieved}%</p>
            </div>
          `;
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow p-3 hover:shadow-xl  flex flex-col items-center">
      <h5 className="italic font-semibold text-xl mb-4 w-full">
        Goal Insights
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

// The main App component to render the GoalTrackerChart.
export default function App() {
  return (
    <>
      <GoalTrackerChart />
    </>
  );
}
