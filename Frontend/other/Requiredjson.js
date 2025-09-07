//Dummy Data for the Hub cards ---------------------------------------------------------------------------------------

const hubData = {
  income: { monthly: [11111111, 10], yearly: [22222222, 15] },
  expense: { monthly: [3333333, -5], yearly: [44444444, 2] },
  monthlyRemaining: 100000000,
  investments: { monthly: [55555555, 20], yearly: [66666666, 25] },
  target: { remaining: [3000, 30], achieved: [7000, 70] },
  debt: { remaining: [11010101, -10], payed: [10110011, 25] },
  goal: { achieved: [77777777, 10], Remaining: [88888888, 20] },
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};

// Dummy data for financial overview Chart -------------------------------------------------------------------------------------
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
      labels: [2024, 2025, 2026],
      data: {
        income: [578964, 1457893, 1000000],
        expense: [350000, 950000,2000],
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
//   Dummy Data for transactions.---------------------------------------------------------------
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


//   Income Category data......................................

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



//   Expense Category data......................................

const expenseData = {
  data: [
    {
      category: "Rent",
      value: 15000,
    },
    {
      category: "Groceries",
      value: 6500,
    },
    {
      category: "Utilities",
      value: 2800,
    },
    {
      category: "Transportation",
      value: 4200,
    },
    {
      category: "Entertainment",
      value: 3500,
    },
    {
      category: "Health & Wellness",
      value: 1800,
    },
  ],
  metadata: {
    lastUpdated: "2025-06-15",
    currency: "INR",
    currencyCode: "₹",
    source: "internal",
  },
};


//  Budget Card data---------------------------------------------------------
const chartData = {
  Invest: 8,
  Expense: 65,
  Learning: 5,
  Happiness: 5,
  "No Touch": 10,
  Emergency: 7,
};


















