import React, { useState } from "react";
import "./ApexGridDemo.css";

// Placeholder for ApexGrid component
const ApexGrid = ({ columnDefs, rowData, sortState, onSort }) => {
  return (
    <div className="apex-grid-placeholder">
      <div className="grid-header bg-gray-200">
        {columnDefs.map((col) => (
          <div
            key={col.field}
            className="header-cell cursor-pointer"
            onClick={() => onSort(col.field)}
          >
            {col.headerName}
            {/* Display sort icon */}
            {sortState.column === col.field && (
              <span className="ml-2">
                {sortState.direction === "asc" ? "▲" : "▼"}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="overflow-y-scroll max-h-120">
        {rowData.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {columnDefs.map((col) => (
              <div
                key={col.field}
                className={`body-cell type-${row.type.toLowerCase()}`}
              >
                {col.valueFormatter
                  ? col.valueFormatter({ value: row[col.field], data: row })
                  : row[col.field]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component to showcase the ApexGrid setup
const ApexGridDemo = () => {
  const data = {
    transactions: [
      {
        date: "2023-07-25",
        category: "Groceries",
        amount: 55.75,
        type: "Expense",
      },
      {
        date: "2023-07-24",
        category: "Salary",
        amount: 2500.0,
        type: "Income",
      },
      { date: "2023-07-23", category: "Rent", amount: 1200.0, type: "Expense" },
      {
        date: "2023-07-22",
        category: "Investment",
        amount: 500.0,
        type: "Transfer",
      },
      { date: "2023-07-21", category: "Coffee", amount: 4.5, type: "Expense" },
      {
        date: "2023-07-20",
        category: "Freelance",
        amount: 750.0,
        type: "Income",
      },
      { date: "2023-07-19", category: "Gym", amount: 50.0, type: "Expense" },
      { date: "2023-07-18", category: "Books", amount: 25.5, type: "Expense" },
      { date: "2023-07-17", category: "Bonus", amount: 100.0, type: "Income" },
      {
        date: "2023-07-16",
        category: "Utilities",
        amount: 150.0,
        type: "Expense",
      },
      {
        date: "2023-07-15",
        category: "Transfer to Savings",
        amount: 200.0,
        type: "Transfer",
      },
      {
        date: "2023-07-14",
        category: "Dining Out",
        amount: 38.9,
        type: "Expense",
      },
      {
        date: "2023-07-13",
        category: "Cashback",
        amount: 15.0,
        type: "Income",
      },
      {
        date: "2023-07-12",
        category: "Mobile Recharge",
        amount: 20.0,
        type: "Expense",
      },
      {
        date: "2023-07-11",
        category: "Internet Bill",
        amount: 45.0,
        type: "Expense",
      },
      {
        date: "2023-07-10",
        category: "Stocks",
        amount: 300.0,
        type: "Transfer",
      },
      {
        date: "2023-07-09",
        category: "Groceries",
        amount: 62.4,
        type: "Expense",
      },
      {
        date: "2023-07-08",
        category: "Interest",
        amount: 8.75,
        type: "Income",
      },
      { date: "2023-07-07", category: "Taxi", amount: 12.0, type: "Expense" },
      { date: "2023-07-06", category: "Petrol", amount: 70.0, type: "Expense" },
      {
        date: "2023-07-05",
        category: "Streaming Subscription",
        amount: 12.99,
        type: "Expense",
      },
      { date: "2023-07-04", category: "Gift", amount: 60.0, type: "Expense" },
      {
        date: "2023-07-03",
        category: "Consulting",
        amount: 1200.0,
        type: "Income",
      },
      {
        date: "2023-07-02",
        category: "Car Maintenance",
        amount: 250.0,
        type: "Expense",
      },
      {
        date: "2023-07-01",
        category: "Credit Card Payment",
        amount: 500.0,
        type: "Transfer",
      },
      {
        date: "2023-06-30",
        category: "Groceries",
        amount: 48.25,
        type: "Expense",
      },
      {
        date: "2023-06-29",
        category: "Dividend",
        amount: 35.0,
        type: "Income",
      },
      {
        date: "2023-06-28",
        category: "Electricity Bill",
        amount: 80.0,
        type: "Expense",
      },
      { date: "2023-06-27", category: "Lunch", amount: 10.75, type: "Expense" },
      {
        date: "2023-06-26",
        category: "Tuition Fee",
        amount: 900.0,
        type: "Expense",
      },
      {
        date: "2023-06-25",
        category: "Part-Time Work",
        amount: 300.0,
        type: "Income",
      },
      {
        date: "2023-06-24",
        category: "Transfer to Wallet",
        amount: 100.0,
        type: "Transfer",
      },
      {
        date: "2023-06-23",
        category: "Water Bill",
        amount: 30.0,
        type: "Expense",
      },
      { date: "2023-06-22", category: "Snacks", amount: 6.5, type: "Expense" },
      {
        date: "2023-06-21",
        category: "Tutoring Income",
        amount: 200.0,
        type: "Income",
      },
      {
        date: "2023-06-20",
        category: "Insurance Premium",
        amount: 350.0,
        type: "Expense",
      },
      { date: "2023-06-19", category: "Parking", amount: 5.0, type: "Expense" },
      {
        date: "2023-06-18",
        category: "Interest Income",
        amount: 18.25,
        type: "Income",
      },
      {
        date: "2023-06-17",
        category: "Laundry",
        amount: 15.0,
        type: "Expense",
      },
      {
        date: "2023-06-16",
        category: "Mutual Fund",
        amount: 400.0,
        type: "Transfer",
      },
    ],
    metadata: {
      lastUpdated: "2025-06-15",
      currency: "INR",
      currencyCode: "₹",
      source: "internal",
    },
  };

  const columnDefs = [
    {
      field: "date",
      headerName: "Date",
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      field: "category",
      headerName: "Category",
    },
    {
      field: "amount",
      headerName: "Amount",
      valueFormatter: (params) => {
        if (params.value === undefined || params.value === null) return "N/A";
        const numericValue = parseFloat(params.value);
        return !isNaN(numericValue)
          ? `${data.metadata.currencyCode}${numericValue.toFixed(2)}`
          : "N/A";
      },
    },
    {
      field: "type",
      headerName: "Type",
    },
  ];

  // 1. Initialize state for sorting
  const [sortState, setSortState] = useState({
    column: "date", // Default sort column
    direction: "desc", // Default sort direction
  });

  // 2. Create a handler function for sorting
  const handleSort = (columnField) => {
    setSortState((prevState) => {
      let newDirection = "asc";
      // If the same column is clicked, toggle the direction
      if (prevState.column === columnField) {
        newDirection = prevState.direction === "asc" ? "desc" : "asc";
      }
      return { column: columnField, direction: newDirection };
    });
  };

  // 3. Apply the sorting logic to the data
  // We use a memoized value to avoid re-sorting on every render
  const sortedData = React.useMemo(() => {
    // Create a copy of the transactions array to avoid mutating the original data
    const dataToSort = [...data.transactions];
    const { column, direction } = sortState;

    return dataToSort.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      // Handle different data types for sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Assume numeric or date values can be compared directly
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
    });
  }, [data.transactions, sortState]);

  return (
    <div className="bg-white rounded-xl h-auto shadow hover:shadow-xl overflow-y-auto">
      <ApexGrid
        columnDefs={columnDefs}
        rowData={sortedData} // Pass the sorted data to the grid
        sortState={sortState}
        onSort={handleSort}
      />
    </div>
  );
};

export default ApexGridDemo;
