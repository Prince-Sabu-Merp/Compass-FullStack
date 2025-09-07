import React from "react";
import ReactApexChart from "react-apexcharts";

const expenseData = {
  data: [
    {
      category: "Others",
      value: 15000,
    },
    {
      category: "Groceries",
      value: 6500,
    },
    {
      category: "Vehicle maintenance",
      value: 2800,
    },
    {
      category: "Petrol",
      value: 4200,
    },
    {
      category: "Entertainment",
      value: 3500,
    },
    {
      category: "Mobile Recharge",
      value: 1800,
    },
    {
      category: "Gym",
      value: 1200,
    },
  ],
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

// Define a colors array to match the distributed style
const colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#546E7A",
];

function ExpenseCategoryCard() {
  // Convert categories to a format suitable for multi-line labels in the vertical chart
  const categories = expenseData.data.map((item) => item.category.split(" "));
  const seriesData = expenseData.data.map((item) => item.value);
  const currencyCode = expenseData.metadata.currencyCode;

  const [state, setState] = React.useState({
    series: [
      {
        name: "Expenses",
        data: seriesData,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: colors,
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
        categories: categories,
        labels: {
          style: {
            colors: colors,
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "0px",
          },
        },
        tooltip: {
          enabled: true,
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
    <div className="bg-white rounded-xl shadow hover:shadow-xl p-3">
      <h5 className="italic items-center font-semibold text-xl">
        Monthly Expenses by Category
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

export default ExpenseCategoryCard;
