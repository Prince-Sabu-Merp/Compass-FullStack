-- Create user-defined types (assumed to be ENUMs; adjust as needed)
CREATE TYPE status AS ENUM ('new', 'read', 'archived');
CREATE TYPE role AS ENUM ('user', 'admin', 'guest');

-- Currency table (created first due to foreign key dependencies)
CREATE TABLE public.currency (
  currency_code text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  currency_name text NOT NULL,
  updated_at timestamp with time zone,
  country_name text,
  currency_symbol text NOT NULL,
  currency_icon text,
  CONSTRAINT currency_pkey PRIMARY KEY (currency_code)
);

-- Users table (created early due to foreign key dependencies)
CREATE TABLE public.users (
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  username character varying NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  password_hashed text NOT NULL,
  role role NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  profile_pic text,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

-- Income Categories table
CREATE TABLE public.income_categories (
  income_category_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  category_name text NOT NULL,
  updated_at timestamp with time zone,
  CONSTRAINT income_categories_pkey PRIMARY KEY (income_category_id),
  CONSTRAINT income_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Expense Categories table
CREATE TABLE public.expense_categories (
  expense_category_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  category_name text NOT NULL,
  updated_at timestamp with time zone,
  CONSTRAINT expense_categories_pkey PRIMARY KEY (expense_category_id),
  CONSTRAINT expense_categories_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Accounts table
CREATE TABLE public.accounts (
  account_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  account_name text NOT NULL,
  account_type text NOT NULL,
  balance double precision NOT NULL DEFAULT 0,
  currency_code text NOT NULL,
  updated_at timestamp with time zone,
  account_icon text,
  CONSTRAINT accounts_pkey PRIMARY KEY (account_id),
  CONSTRAINT accounts_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT balance_non_negative CHECK (balance >= 0)
);

-- Budgets table
CREATE TABLE public.budgets (
  budget_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  expense_category_id uuid,
  income_category_id uuid,
  percentage double precision DEFAULT 0,
  calculated_amount double precision DEFAULT 0,
  currency_code text NOT NULL,
  period_start_date date,
  period_end_date date,
  CONSTRAINT budgets_pkey PRIMARY KEY (budget_id),
  CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT budgets_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT budgets_income_category_id_fkey FOREIGN KEY (income_category_id) REFERENCES public.income_categories(income_category_id),
  CONSTRAINT budgets_expense_category_id_fkey FOREIGN KEY (expense_category_id) REFERENCES public.expense_categories(expense_category_id),
  CONSTRAINT percentage_valid CHECK (percentage >= 0 AND percentage <= 100),
  CONSTRAINT calculated_amount_non_negative CHECK (calculated_amount >= 0)
);

-- Budget Tracker table (renamed to budget_tracker)
CREATE TABLE public.budget_tracker (
  budget_tracker_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  currency_code text NOT NULL,
  total_received double precision NOT NULL DEFAULT 0,
  total_spend double precision NOT NULL DEFAULT 0,
  user_id uuid NOT NULL,
  budget_id uuid NOT NULL,
  CONSTRAINT budget_tracker_pkey PRIMARY KEY (budget_tracker_id),
  CONSTRAINT budget_tracker_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(budget_id),
  CONSTRAINT budget_tracker_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT budget_tracker_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT total_received_non_negative CHECK (total_received >= 0),
  CONSTRAINT total_spend_non_negative CHECK (total_spend >= 0)
);

-- Currency Conversions table
CREATE TABLE public.currency_conversions (
  currency_conversion_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  from_currency_code text NOT NULL,
  to_currency_code text NOT NULL,
  rate double precision NOT NULL,
  effective_date date,
  updated_at timestamp with time zone,
  CONSTRAINT currency_conversions_pkey PRIMARY KEY (currency_conversion_id),
  CONSTRAINT currency_conversions_to_currency_code_fkey FOREIGN KEY (to_currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT currency_conversions_from_currency_code_fkey FOREIGN KEY (from_currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT rate_positive CHECK (rate > 0)
);

-- Debts table
CREATE TABLE public.debts (
  debt_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  creditor_name text NOT NULL,
  amount_owed double precision NOT NULL,
  currency_code text NOT NULL,
  interest_rate double precision DEFAULT 0,
  due_date date,
  description text,
  updated_at timestamp with time zone,
  remaining_amount double precision NOT NULL DEFAULT 0,
  CONSTRAINT debts_pkey PRIMARY KEY (debt_id),
  CONSTRAINT debts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id),
  CONSTRAINT debts_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT debts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT amount_owed_positive CHECK (amount_owed > 0),
  CONSTRAINT remaining_amount_non_negative CHECK (remaining_amount >= 0)
);

-- Debt Tracker table
CREATE TABLE public.debt_tracker (
  debt_tracker_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  debt_id uuid NOT NULL,
  payment_amount text NOT NULL, -- Kept as text; migrate to double precision if needed
  currency_code text NOT NULL,
  payment_date date,
  remaining_balance double precision NOT NULL DEFAULT 0,
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  CONSTRAINT debt_tracker_pkey PRIMARY KEY (debt_tracker_id),
  CONSTRAINT debt_tracker_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT debt_tracker_debt_id_fkey FOREIGN KEY (debt_id) REFERENCES public.debts(debt_id),
  CONSTRAINT debt_tracker_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT remaining_balance_non_negative CHECK (remaining_balance >= 0)
);

-- Error Logs table (renamed to error_logs)
CREATE TABLE public.error_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  error_message text NOT NULL,
  stack_trace text,
  user_id uuid,
  context jsonb,
  CONSTRAINT error_logs_pkey PRIMARY KEY (id),
  CONSTRAINT error_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Expense Record table
CREATE TABLE public.expense_record (
  expense_record_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  expense_category_id uuid NOT NULL,
  amount double precision NOT NULL,
  currency_code text NOT NULL,
  transaction_date date,
  description text,
  CONSTRAINT expense_record_pkey PRIMARY KEY (expense_record_id),
  CONSTRAINT expense_record_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id),
  CONSTRAINT expense_record_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT expense_record_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT expense_record_expense_category_id_fkey FOREIGN KEY (expense_category_id) REFERENCES public.expense_categories(expense_category_id),
  CONSTRAINT amount_positive CHECK (amount > 0)
);

-- Goals table
CREATE TABLE public.goals (
  goal_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  goal_name text NOT NULL DEFAULT '',
  target_amount double precision NOT NULL DEFAULT 0,
  achieved_amount double precision NOT NULL DEFAULT 0,
  remaining_amount double precision NOT NULL DEFAULT 0,
  currency text NOT NULL,
  target_date date,
  description text,
  updated_at timestamp with time zone,
  goal_image text,
  CONSTRAINT goals_pkey PRIMARY KEY (goal_id),
  CONSTRAINT goals_currency_fkey FOREIGN KEY (currency) REFERENCES public.currency(currency_code),
  CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT target_amount_positive CHECK (target_amount > 0),
  CONSTRAINT remaining_amount_non_negative CHECK (remaining_amount >= 0),
  CONSTRAINT achieved_amount_non_negative CHECK (achieved_amount >= 0)
);

-- Goal Tracker table
CREATE TABLE public.goal_tracker (
  goal_tracker_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  contribution_amount double precision NOT NULL DEFAULT 0,
  currency_code text NOT NULL,
  contribution_date date,
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  goal_id uuid NOT NULL,
  CONSTRAINT goal_tracker_pkey PRIMARY KEY (goal_tracker_id),
  CONSTRAINT goal_tracker_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(goal_id),
  CONSTRAINT goal_tracker_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT goal_tracker_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT contribution_amount_non_negative CHECK (contribution_amount >= 0)
);

-- Income Record table
CREATE TABLE public.income_record (
  income_record_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  account_id uuid NOT NULL,
  income_category_id uuid NOT NULL,
  amount double precision NOT NULL,
  currency_code text NOT NULL,
  transaction_date date,
  description text,
  CONSTRAINT income_record_pkey PRIMARY KEY (income_record_id),
  CONSTRAINT income_record_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT income_record_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(account_id),
  CONSTRAINT income_record_income_category_id_fkey FOREIGN KEY (income_category_id) REFERENCES public.income_categories(income_category_id),
  CONSTRAINT income_record_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT amount_positive CHECK (amount > 0)
);

-- Investment Accounts table
CREATE TABLE public.investment_accounts (
  investment_account_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  currency_code text NOT NULL,
  user_id uuid NOT NULL,
  updated_at timestamp with time zone,
  investment_type text NOT NULL,
  unit_price double precision NOT NULL DEFAULT 0,
  investment_start_date date,
  account_name text NOT NULL,
  invested_amount double precision NOT NULL DEFAULT 0,
  last_invested_date date,
  invested_units double precision NOT NULL DEFAULT 0,
  CONSTRAINT investment_accounts_pkey PRIMARY KEY (investment_account_id),
  CONSTRAINT investment_accounts_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT investment_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT unit_price_non_negative CHECK (unit_price >= 0),
  CONSTRAINT invested_amount_non_negative CHECK (invested_amount >= 0),
  CONSTRAINT invested_units_non_negative CHECK (invested_units >= 0)
);

-- Investments Tracker table
CREATE TABLE public.investments_tracker (
  investment_track_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  investment_account_id uuid NOT NULL,
  currency_code text NOT NULL,
  invested_date date,
  updated_at timestamp with time zone,
  purchased_unit double precision NOT NULL DEFAULT 0,
  CONSTRAINT investments_tracker_pkey PRIMARY KEY (investment_track_id),
  CONSTRAINT investments_tracker_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code),
  CONSTRAINT investments_tracker_investment_account_id_fkey FOREIGN KEY (investment_account_id) REFERENCES public.investment_accounts(investment_account_id),
  CONSTRAINT purchased_unit_non_negative CHECK (purchased_unit >= 0)
);

-- Notification table
CREATE TABLE public.notification (
  notification_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  message text NOT NULL,
  type text NOT NULL,
  updated_at timestamp with time zone,
  user_id uuid NOT NULL,
  status status NOT NULL DEFAULT 'new',
  CONSTRAINT notification_pkey PRIMARY KEY (notification_id),
  CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);

-- Reports table
CREATE TABLE public.reports (
  reports_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  report_type text NOT NULL,
  currency_code text NOT NULL,
  data jsonb,
  generated_at timestamp with time zone,
  CONSTRAINT reports_pkey PRIMARY KEY (reports_id),
  CONSTRAINT reports_currency_code_fkey FOREIGN KEY (currency_code) REFERENCES public.currency(currency_code)
);

-- Setup table
CREATE TABLE public.setup (
  setup_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  default_currency_code text NOT NULL,
  language text,
  theme text,
  budget_period double precision,
  ui_settings jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  CONSTRAINT setup_pkey PRIMARY KEY (setup_id),
  CONSTRAINT setup_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT setup_default_currency_code_fkey FOREIGN KEY (default_currency_code) REFERENCES public.currency(currency_code)
);