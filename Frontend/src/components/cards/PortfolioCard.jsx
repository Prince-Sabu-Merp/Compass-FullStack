import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

function StockPortfolio() {
  const chartData = {
    "Tech Stocks": 40,
    "Real Estate": 25,
    "Emerging Markets": 15,
    Bonds: 10,
    Commodities: 10,
  };

  const [chartState] = useState({
    series: Object.values(chartData),
    options: {
      chart: {
        type: "pie", // Changed from "donut" to "pie"
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
          // Removed the donut-specific options
        },
      },
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
        Stock Portfolio
      </h5>
      <div className="flex-grow w-full flex justify-center items-center">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="pie" // Changed from "donut" to "pie"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default StockPortfolio;
