import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

// Consolidated data for both income and expenses in a single object
const financialData = {
  periods: {
    Monthly: {
      labels: [
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
      ],
      data: {
        income: [
          30605, 15000, 20000, 16000, 22000, 25000, 18000, 21000, 13000, 19000,
          17000, 14000,
        ],
        expense: [
          12000, 10000, 15000, 11000, 16000, 18000, 15000, 17000, 10000, 14000,
          13000, 11000,
        ],
      },
    },
    Yearly: {
      labels: [2024, 2025],
      data: {
        income: [578964, 1457893],
        expense: [350000, 950000],
      },
    },
    Weekly: {
      labels: [
        "W11",
        "W12",
        "W13",
        "W14",
        "W15",
        "W16",
        "W17",
        "W18",
        "W19",
        "W20",
        "W21",
        "W22",
        "W23",
        "W24",
        "W25",
      ],
      data: {
        income: [
          651632, 2405, 2465, 6141, 6549, 52719, 571, 679719, 66164, 657894,
          12615, 52156, 45612, 16546, 65461,
        ],
        expense: [
          25000, 1500, 2000, 5000, 4000, 30000, 500, 450000, 40000, 500000,
          10000, 35000, 30000, 12000, 40000,
        ],
      },
    },
  },
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

// Map data-type to data periods
const DATA_TYPE_MAP = {
  yearlyData: "Yearly",
  monthlyData: "Monthly",
  weeklyData: "Weekly",
};

// Chart configuration
const CHART_CONFIG = {
  chart: {
    type: "area",
    height: "100%",
    width: "100%",
    toolbar: { show: false },
  },
  colors: ["#4ade80", "#ef4444"], // Green for income, red for expenses
  dataLabels: { enabled: false },
  grid: {
    show: false,
    padding: { top: 0, right: 8, bottom: 0, left: 10 },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0,
      opacityTo: 0.7,
      stops: [0, 80, 100],
    },
  },
  xaxis: {
    crosshairs: {
      show: true,
      stroke: { color: "#e0e0e0", width: 1, dashArray: 3 },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  tooltip: {
    enabled: true,
    x: { show: true },
    y: {
      formatter: (val) => `${val} ${financialData.metadata.currencyCode}`,
    },
  },
};

const FinancialOverviewCard = () => {
  const [activePeriod, setActivePeriod] = useState("monthlyData");
  const [chartOptions, setChartOptions] = useState(null);
  const [chartSeries, setChartSeries] = useState([]);

  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Create chart options and series for both income and expenses
  const createChartOptions = (period) => {
    const {
      labels: xAxis,
      data: { income: incomeValues, expense: expenseValues },
    } = financialData.periods[period];

    if (
      !xAxis ||
      !incomeValues ||
      !expenseValues ||
      xAxis.length !== incomeValues.length ||
      xAxis.length !== expenseValues.length
    ) {
      throw new Error(
        "Invalid chart data: xAxis and yAxis must be arrays of equal length"
      );
    }

    if (incomeValues.length < 2) {
      console.warn("Limited data points may affect chart visualization");
    }

    return {
      options: {
        ...CHART_CONFIG,
        xaxis: { ...CHART_CONFIG.xaxis, categories: xAxis },
      },
      series: [
        { name: "Income", data: incomeValues },
        { name: "Expense", data: expenseValues },
      ],
    };
  };

  // Update chart with new data
  const updateGraph = debounce((type) => {
    try {
      const period = DATA_TYPE_MAP[type];
      if (!period || !financialData.periods[period]) {
        throw new Error(`Invalid data type: ${type}`);
      }
      console.log(`Updating chart with type: ${type} (period: ${period})`);
      const { options, series } = createChartOptions(period);
      setChartOptions(options);
      setChartSeries(series);
    } catch (error) {
      console.error("Failed to update chart:", error);
    }
  }, 50);

  // Handle period button click
  const handlePeriodChange = (type) => {
    setActivePeriod(type);
    updateGraph(type);
  };

  // Initialize chart
  useEffect(() => {
    const { options, series } = createChartOptions(DATA_TYPE_MAP.monthlyData);
    setChartOptions(options);
    setChartSeries(series);
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow pt-3 pb-3 hover:shadow-xl">
        <div className="w-full h-full">
          <div className="flex flex-col items-center justify-between">
            <div className="flex w-full pl-4 pr-4 justify-between">
              <div>
                <h5 className="italic items-center font-semibold text-xl">
                  Financial Overview
                </h5>
              </div>
              <div
                className="flex flex-row items-center justify-between"
                id="controls"
              >
                {Object.keys(DATA_TYPE_MAP).map((type) => (
                  <div
                    key={type}
                    className={`pr-2 pl-2 cursor-pointer select-none  text-sm font-semibold ${
                      activePeriod === type
                        ? "text-blue-800"
                        : "hover:text-blue-400"
                    }`}
                    onClick={() => handlePeriodChange(type)}
                  >
                    {type.replace("Data", "")}
                  </div>
                ))}
              </div>
              <div className="hidden">
                <div className="rounded-md h-8 w-9 bg-gray-200 flex flex-row items-center justify-around p-2">
                  <span className="block h-1 w-1 bg-gray-400 rounded-full"></span>
                  <span className="block h-1 w-1 bg-gray-400 rounded-full"></span>
                  <span className="block h-1 w-1 bg-gray-400 rounded-full"></span>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full h-72 bg-white" id="IncomeGraph">
                {chartOptions && chartSeries.length > 0 && (
                  <Chart
                    type="area"
                    height="100%"
                    width="100%"
                    options={chartOptions}
                    series={chartSeries}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialOverviewCard;
