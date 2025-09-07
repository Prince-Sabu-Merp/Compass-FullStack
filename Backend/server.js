import express from "express";
import "dotenv/config";
import Tokens from "csrf";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// ENV values
const loginPage = process.env.COMPASS_LOGIN_PAGE;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
const app = express();
const port = process.env.PORT || 3000;

// Allowlisted origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://princesabu27.github.io",
  "https://959f-14-96-14-58.ngrok-free.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());
app.use(express.json());

const tokens = new Tokens();

// --- CSRF Middleware ---
const csrfProtection = (req, res, next) => {
  let secret = req.cookies["csrf-secret"];
  if (!secret) {
    secret = tokens.secretSync();
    res.cookie("csrf-secret", secret, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
  }
  const token = tokens.create(secret);
  req.csrfToken = () => token;
  next();
};

// --- Get CSRF token ---
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// --- Login Endpoint ---
app.post("/login", async (req, res) => {
  const secret = req.cookies["csrf-secret"];
  const token = req.headers["x-csrf-token"];
  const { username, password } = req.body;

  if (!secret || !token || !tokens.verify(secret, token)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  res.json({ redirectUrl: "http://localhost:5173/" }); // 🔁 replace with your frontend route
});

// --- Hub Data (Protected) ---
app.get("/hub-data", async (req, res) => {
 

  res.json({ message: "Hub data fetched", hubData });
});

// --- Home Redirect ---
app.get("/", (req, res) => {
  res.redirect(loginPage);
});

// --- User List (optional) ---
app.get("/user", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  } else {
    res.status(200).json(data);
  }
});

// --- Error Logger ---
async function errorLogEntry(code, message, description, hint) {
  await supabase.from("error_log").insert([
    {
      error_code: code,
      error_type: message,
      error_description: description,
      error_hint: hint,
    },
  ]);
}

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

// Dummy data.................
const hubData = {
  income: {
    yearly: [99999999, 11.1], // (11111111 / 99999999) ≈ 11.1%
    monthly: [11111111, -88.9], // Approx drop from yearly
  },
  expense: {
    yearly: [88888888, -4.5], // Small drop
    monthly: [22222222, 25], // Rise from yearly to monthly
  },
  monthlyRemaining: 33333333,
  investments: {
    yearly: [77777777, 74.9], // Gain from monthly to yearly
    monthly: [44444444, -42.9], // Drop from yearly
  },
  debt: {
    payed: [10101010, 50.25], // Paid amount dropped
    remaining: [10000000, 49.74], // Debt almost doubled
  },
  target: {
    achieved: [66666666, 54.54], // Small increase
    remaining: [555555555, 45.45], // Large drop (target achieved more)
  },
};
