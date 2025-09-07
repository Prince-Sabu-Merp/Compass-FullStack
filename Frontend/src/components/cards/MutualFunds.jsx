import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

function MutualFunds() {
  const chartData = {
    "Equity Funds": 50,
    "Debt Funds": 30,
    "Hybrid Funds": 15,
    "Index Funds": 5,
  };

  const [chartState] = useState({
    series: Object.values(chartData),
    options: {
      chart: {
        type: "pie",
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
        pie: {},
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
      <h5 className="italic font-semibold text-xl mb-4 w-full">Mutual Funds</h5>
      <div className="flex-grow w-full flex justify-center items-center">
        <ReactApexChart
          options={chartState.options}
          series={chartState.series}
          type="pie"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default MutualFunds;
