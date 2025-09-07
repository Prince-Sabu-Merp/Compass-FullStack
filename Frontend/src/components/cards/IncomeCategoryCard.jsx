import React from "react";
import ReactApexChart from "react-apexcharts";

const incomeData = {
  data: [
    {
      category: "Full Time Job",
      value: 52000,
    },
    {
      category: "Youtube",
      value: 3650,
    },
    {
      category: "Business",
      value: 268745,
    },
    {
      category: "Trading",
      value: 24523,
    },
    {
      category: "Investments Return",
      value: 2451,
    },
  ],
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

function IncomeCategoryCard() {
  const categories = incomeData.data.map((item) => item.category);
  const seriesData = incomeData.data.map((item) => item.value);
  const currencyCode = incomeData.metadata.currencyCode; // Get currency code from metadata

  const [state, setState] = React.useState({
    series: [
      {
        name: "Income",
        data: seriesData,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: "0px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      tooltip: {
        y: {
          // Use the currencyCode variable here
          formatter: function (val) {
            return currencyCode + val;
          },
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl p-3">
      <h5 className="italic items-center font-semibold text-xl">
        Monthly Income by Category
      </h5>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default IncomeCategoryCard;
