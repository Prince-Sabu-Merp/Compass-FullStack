import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

function BudgetChartCard() {
  const chartData = {
    Invest: 8,
    Expense: 65,
    Learning: 5,
    Happiness: 5,
    "No Touch": 10,
    Emergency: 7,
  };

  const [chartState] = useState({
    series: Object.values(chartData),
    options: {
      chart: {
        type: "donut",
        // The chart will now fill its parent container.
        height: "100%",
        width: "100%",
      },
      labels: Object.keys(chartData),
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
              height: "100%",
            },
          },
        },
      ],
      dataLabels: {
        enabled: true,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: false,
                label: "Total",
                formatter: function (w) {
                  const total = w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0
                  );
                  return total + "%";
                },
              },
            },
          },
        },
      },
      // You can also add some padding options to fine-tune the spacing if needed,
      // but the main issue is the parent container's height.
      grid: {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow min-h-100 h-auto p-3 hover:shadow-xl overflow-hidden flex flex-col items-center">
      <h5 className="italic font-semibold text-xl mb-4 w-full">
        Budget Planning Overview
      </h5>
      {/* This is the key change. `flex-grow` allows this div to take up all remaining vertical space. */}
      <div className="flex-grow w-full flex justify-center items-center">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="donut"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default BudgetChartCard;
