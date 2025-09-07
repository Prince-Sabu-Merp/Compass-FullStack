-- Enable the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to get the latest exchange rate
CREATE OR REPLACE FUNCTION get_latest_exchange_rate(from_currency VARCHAR(3), to_currency VARCHAR(3))
RETURNS DECIMAL(10, 6) AS $$
BEGIN
    RETURN (
        SELECT rate
        FROM currency_conversions
        WHERE from_currency_code = from_currency
        AND to_currency_code = to_currency
        ORDER BY effective_date DESC
        LIMIT 1
    );
END;
$$ language plpgsql;

-- Function to calculate total income in user's default currency
CREATE OR REPLACE FUNCTION calculate_total_income(user_uuid UUID, start_date DATE, end_date DATE)
RETURNS DECIMAL(15, 2) AS $$
DECLARE
    base_currency VARCHAR(3);
BEGIN
    -- Get user's default currency from Setup
    SELECT default_currency_code INTO base_currency
    FROM setup
    WHERE user_id = user_uuid
    LIMIT 1;
    
    IF base_currency IS NULL THEN
        base_currency = 'USD'; -- Fallback currency
    END IF;
    
    RETURN (
        SELECT COALESCE(SUM(
            ir.amount * COALESCE(get_latest_exchange_rate(ir.currency_code, base_currency), 1.0)
        ), 0.00)
        FROM income_records ir
        WHERE ir.user_id = user_uuid
        AND ir.transaction_date BETWEEN start_date AND end_date
    );
END;
$$ language plpgsql;

-- Function to update calculated_amount in budgets table
CREATE OR REPLACE FUNCTION update_budget_calculated_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.calculated_amount = NEW.percentage * calculate_total_income(
        NEW.user_id,
        NEW.period_start_date,
        NEW.period_end_date
    ) / 100.00;
    RETURN NEW;
END;
$$ language plpgsql;

-- Function to validate transaction currency matches account currency
CREATE OR REPLACE FUNCTION validate_transaction_currency()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.currency_code != (
        SELECT currency_code
        FROM accounts
        WHERE account_id = NEW.account_id
    ) THEN
        RAISE EXCEPTION 'Transaction currency (%) does not match account currency', NEW.currency_code;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

-- Function to handle transfer between accounts with different currencies
CREATE OR REPLACE FUNCTION handle_transfer_currency()
RETURNS TRIGGER AS $$
DECLARE
    from_currency VARCHAR(3);
    to_currency VARCHAR(3);
    converted_amount DECIMAL(15, 2);
BEGIN
    SELECT currency_code INTO from_currency
    FROM accounts WHERE account_id = NEW.from_account_id;
    
    SELECT currency_code INTO to_currency
    FROM accounts WHERE account_id = NEW.to_account_id;
    
    IF from_currency != to_currency THEN
        converted_amount = NEW.amount * COALESCE(get_latest_exchange_rate(from_currency, to_currency), 1.0);
        -- Update balances
        UPDATE accounts
        SET balance = balance - NEW.amount
        WHERE account_id = NEW.from_account_id;
        
        UPDATE accounts
        SET balance = balance + converted_amount
        WHERE account_id = NEW.to_account_id;
    ELSE
        -- Same currency, no conversion needed
        UPDATE accounts
        SET balance = balance - NEW.amount
        WHERE account_id = NEW.from_account_id;
        
        UPDATE accounts
        SET balance = balance + NEW.amount
        WHERE account_id = NEW.to_account_id;
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

-- Function to generate notifications (e.g., budget overspending)
CREATE OR REPLACE FUNCTION generate_budget_notification()
RETURNS TRIGGER AS $$
DECLARE
    budget_currency VARCHAR(3);
    budget_amount DECIMAL(15, 2);
    user_uuid UUID;
BEGIN
    -- Get budget details
    SELECT b.currency_code, b.calculated_amount, b.user_id
    INTO budget_currency, budget_amount, user_uuid
    FROM budgets b
    WHERE b.budget_id = (
        SELECT budget_id FROM budget_tracker
        WHERE budget_tracker_id = NEW.budget_tracker_id
    );
    
    -- Check for overspending
    IF NEW.total_spent > budget_amount THEN
        INSERT INTO notifications (user_id, message, type, status)
        VALUES (
            user_uuid,
            'Budget overspent for period ' || (SELECT period_start_date FROM budgets WHERE budget_id = NEW.budget_id)::TEXT,
            'budget_alert',
            'unread'
        );
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

-- Currencies table
CREATE TABLE currencies (
    currency_code VARCHAR(3) PRIMARY KEY,
    currency_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updating updated_at in currencies
CREATE TRIGGER update_currencies_updated_at
    BEFORE UPDATE ON currencies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Currency Conversions table
CREATE TABLE currency_conversions (
    conversion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency_code VARCHAR(3) NOT NULL,
    to_currency_code VARCHAR(3) NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    effective_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT,
    FOREIGN KEY (to_currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in currency_conversions
CREATE TRIGGER update_currency_conversions_updated_at
    BEFORE UPDATE ON currency_conversions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Setup table
CREATE TABLE setup (
    setup_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    default_currency_code VARCHAR(3) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    budget_period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    ui_settings JSONB, -- e.g., {"dashboard_layout": "grid", "widgets": ["balance", "budget"]}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (default_currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in setup
CREATE TRIGGER update_setup_updated_at
    BEFORE UPDATE ON setup
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Error Logs table
CREATE TABLE error_logs (
    error_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID,
    context JSONB, -- e.g., {"endpoint": "/api/transactions", "status": 500}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Notifications table
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., budget_alert, goal_milestone
    status VARCHAR(20) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for updating updated_at in notifications
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Audit Logs table
CREATE TABLE audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action_type VARCHAR(50) NOT NULL, -- e.g., create_account, update_transaction
    entity_name VARCHAR(50) NOT NULL, -- e.g., accounts, income_records
    entity_id UUID NOT NULL,
    changes JSONB, -- e.g., {"old": {"amount": 100}, "new": {"amount": 200}}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Reports table
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- e.g., monthly_spending, net_worth
    currency_code VARCHAR(3) NOT NULL,
    data JSONB NOT NULL, -- e.g., {"categories": [{"name": "Groceries", "amount": 500}]}
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Scheduled Transactions table
CREATE TABLE scheduled_transactions (
    schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    category_id UUID, -- Can reference income or expense category
    amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    frequency VARCHAR(20) NOT NULL, -- e.g., daily, weekly, monthly
    next_execution_date DATE NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in scheduled_transactions
CREATE TRIGGER update_scheduled_transactions_updated_at
    BEFORE UPDATE ON scheduled_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger for updating updated_at in users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Accounts table
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in accounts
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Income Categories table
CREATE TABLE income_categories (
    income_category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for updating updated_at in income_categories
CREATE TRIGGER update_income_categories_updated_at
    BEFORE UPDATE ON income_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Expense Categories table
CREATE TABLE expense_categories (
    expense_category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for updating updated_at in expense_categories
CREATE TRIGGER update_expense_categories_updated_at
    BEFORE UPDATE ON expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Income Records table
CREATE TABLE income_records (
    income_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    income_category_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (income_category_id) REFERENCES income_categories(income_category_id) ON DELETE RESTRICT,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in income_records
CREATE TRIGGER update_income_records_updated_at
    BEFORE UPDATE ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for validating currency in income_records
CREATE TRIGGER validate_income_currency
    BEFORE INSERT OR UPDATE ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION validate_transaction_currency();

-- Trigger for audit logging on income_records
CREATE OR REPLACE FUNCTION log_income_record_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, changes)
    VALUES (
        NEW.user_id,
        CASE WHEN TG_OP = 'INSERT' THEN 'create' ELSE 'update' END,
        'income_records',
        NEW.income_id,
        jsonb_build_object('new', to_jsonb(NEW))
    );
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER audit_income_records
    AFTER INSERT OR UPDATE ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION log_income_record_audit();

-- Expense Records table
CREATE TABLE expense_records (
    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    expense_category_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    transaction_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(expense_category_id) ON DELETE RESTRICT,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in expense_records
CREATE TRIGGER update_expense_records_updated_at
    BEFORE UPDATE ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for validating currency in expense_records
CREATE TRIGGER validate_expense_currency
    BEFORE INSERT OR UPDATE ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION validate_transaction_currency();

-- Trigger for audit logging on expense_records
CREATE OR REPLACE FUNCTION log_expense_record_audit()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (user_id, action_type, entity_name, entity_id, changes)
    VALUES (
        NEW.user_id,
        CASE WHEN TG_OP = 'INSERT' THEN 'create' ELSE 'update' END,
        'expense_records',
        NEW.expense_id,
        jsonb_build_object('new', to_jsonb(NEW))
    );
    RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER audit_expense_records
    AFTER INSERT OR UPDATE ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION log_expense_record_audit();

-- Budgets table
CREATE TABLE budgets (
    budget_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    expense_category_id UUID,
    income_category_id UUID,
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    calculated_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(3) NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (expense_category_id) REFERENCES expense_categories(expense_category_id) ON DELETE RESTRICT,
    FOREIGN KEY (income_category_id) REFERENCES income_categories(income_category_id) ON DELETE RESTRICT,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT,
    CHECK (expense_category_id IS NOT NULL OR income_category_id IS NOT NULL)
);

-- Trigger for updating calculated_amount in budgets
CREATE TRIGGER update_budgets_calculated_amount
    BEFORE INSERT OR UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_calculated_amount();

-- Trigger for updating updated_at in budgets
CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Budget Tracker table
CREATE TABLE budget_tracker (
    budget_tracker_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL,
    total_spent DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    total_received DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(budget_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in budget_tracker
CREATE TRIGGER update_budget_tracker_updated_at
    BEFORE UPDATE ON budget_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for generating notifications on budget_tracker updates
CREATE TRIGGER generate_budget_notification
    AFTER UPDATE ON budget_tracker
    FOR EACH ROW
    EXECUTE FUNCTION generate_budget_notification();

-- Trigger to update budget_tracker when income/expense records are added
CREATE OR REPLACE FUNCTION update_budget_tracker()
RETURNS TRIGGER AS $$
DECLARE
    budget_currency VARCHAR(3);
BEGIN
    -- Get the budget's currency
    SELECT b.currency_code INTO budget_currency
    FROM budgets b
    JOIN budget_tracker bt ON b.budget_id = bt.budget_id
    WHERE bt.budget_id = (
        SELECT budget_id FROM budgets
        WHERE (income_category_id IS NOT NULL AND income_category_id = NEW.income_category_id)
        OR (expense_category_id IS NOT NULL AND expense_category_id = NEW.expense_category_id)
        LIMIT 1
    );
    
    -- Update total_received for income budgets
    IF TG_TABLE_NAME = 'income_records' THEN
        UPDATE budget_tracker
        SET total_received = (
            SELECT COALESCE(SUM(
                ir.amount * COALESCE(get_latest_exchange_rate(ir.currency_code, budget_currency), 1.0)
            ), 0.00)
            FROM income_records ir
            JOIN budgets b ON ir.income_category_id = b.income_category_id
            WHERE b.budget_id = budget_tracker.budget_id
            AND ir.transaction_date BETWEEN b.period_start_date AND b.period_end_date
        )
        WHERE EXISTS (
            SELECT 1 FROM budgets
            WHERE budget_id = budget_tracker.budget_id
            AND income_category_id IS NOT NULL
        );
    -- Update total_spent for expense budgets
    ELSIF TG_TABLE_NAME = 'expense_records' THEN
        UPDATE budget_tracker
        SET total_spent = (
            SELECT COALESCE(SUM(
                er.amount * COALESCE(get_latest_exchange_rate(er.currency_code, budget_currency), 1.0)
            ), 0.00)
            FROM expense_records er
            JOIN budgets b ON er.expense_category_id = b.expense_category_id
            WHERE b.budget_id = budget_tracker.budget_id
            AND er.transaction_date BETWEEN b.period_start_date AND b.period_end_date
        )
        WHERE EXISTS (
            SELECT 1 FROM budgets
            WHERE budget_id = budget_tracker.budget_id
            AND expense_category_id IS NOT NULL
        );
    END IF;
    RETURN NEW;
END;
$$ language plpgsql;

-- Trigger for income_records
CREATE TRIGGER update_budget_tracker_on_income
    AFTER INSERT ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_tracker();

-- Trigger for expense_records
CREATE TRIGGER update_budget_tracker_on_expense
    AFTER INSERT ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_tracker();

-- Investments table
CREATE TABLE investments (
    investment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    investment_type VARCHAR(50) NOT NULL,
    amount_invested DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    purchase_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in investments
CREATE TRIGGER update_investments_updated_at
    BEFORE UPDATE ON investments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Investment Tracker table
CREATE TABLE investment_tracker (
    tracker_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investment_id UUID NOT NULL,
    recorded_value DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    record_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investment_id) REFERENCES investments(investment_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in investment_tracker
CREATE TRIGGER update_investment_tracker_updated_at
    BEFORE UPDATE ON investment_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Debts table
CREATE TABLE debts (
    debt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    creditor_name VARCHAR(100) NOT NULL,
    amount_owed DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    interest_rate DECIMAL(5, 2) DEFAULT 0.00,
    due_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in debts
CREATE TRIGGER update_debts_updated_at
    BEFORE UPDATE ON debts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Debt Tracker table
CREATE TABLE debt_tracker (
    debt_tracker_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debt_id UUID NOT NULL,
    payment_amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    payment_date DATE NOT NULL,
    remaining_balance DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (debt_id) REFERENCES debts(debt_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in debt_tracker
CREATE TRIGGER update_debt_tracker_updated_at
    BEFORE UPDATE ON debt_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Goals table
CREATE TABLE goals (
    goal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    currency_code VARCHAR(3) NOT NULL,
    target_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in goals
CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Goal Tracker table
CREATE TABLE goal_tracker (
    goal_tracker_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL,
    contribution_amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    contribution_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT
);

-- Trigger for updating updated_at in goal_tracker
CREATE TRIGGER update_goal_tracker_updated_at
    BEFORE UPDATE ON goal_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Transfer Records table
CREATE TABLE transfer_records (
    transfer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    from_account_id UUID NOT NULL,
    to_account_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    transfer_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (from_account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (to_account_id) REFERENCES accounts(account_id) ON DELETE CASCADE,
    FOREIGN KEY (currency_code) REFERENCES currencies(currency_code) ON DELETE RESTRICT,
    CHECK (from_account_id != to_account_id)
);

-- Trigger for updating updated_at in transfer_records
CREATE TRIGGER update_transfer_records_updated_at
    BEFORE UPDATE ON transfer_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for handling currency conversion in transfer_records
CREATE TRIGGER handle_transfer_currency
    AFTER INSERT ON transfer_records
    FOR EACH ROW
    EXECUTE FUNCTION handle_transfer_currency();

-- Enable Row-Level Security (RLS) for all tables
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE currency_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Currencies table (read-only for all authenticated users)
CREATE POLICY read_currencies ON currencies
    FOR SELECT
    USING (true);

-- Currency Conversions table (read-only for all authenticated users, admin-only for updates)
CREATE POLICY read_currency_conversions ON currency_conversions
    FOR SELECT
    USING (true);
CREATE POLICY admin_currency_conversions ON currency_conversions
    FOR ALL
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Setup table (user-specific access)
CREATE POLICY user_access ON setup
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Error Logs table (admin-only access)
CREATE POLICY admin_access ON error_logs
    FOR ALL
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Notifications table (user-specific read/update, admin read-only)
CREATE POLICY user_access ON notifications
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY admin_read ON notifications
    FOR SELECT
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Audit Logs table (admin-only access)
CREATE POLICY admin_access ON audit_logs
    FOR ALL
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Reports table (user-specific access, admin full access)
CREATE POLICY user_access ON reports
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY admin_access ON reports
    FOR ALL
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Scheduled Transactions table (user-specific access, admin full access)
CREATE POLICY user_access ON scheduled_transactions
    FOR ALL
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY admin_access ON scheduled_transactions
    FOR ALL
    USING ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Users table
CREATE POLICY user_access ON users
    FOR ALL
    USING (user_id = auth.uid() OR role = 'admin')
    WITH CHECK (user_id = auth.uid() OR role = 'admin');

-- Accounts table
CREATE POLICY user_access ON accounts
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Income Categories table
CREATE POLICY user_access ON income_categories
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Expense Categories table
CREATE POLICY user_access ON expense_categories
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Income Records table
CREATE POLICY user_access ON income_records
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Expense Records table
CREATE POLICY user_access ON expense_records
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Budgets table
CREATE POLICY user_access ON budgets
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Budget Tracker table
CREATE POLICY user_access ON budget_tracker
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM budgets
            WHERE budget_id = budget_tracker.budget_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM budgets
            WHERE budget_id = budget_tracker.budget_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    );

-- Investments table
CREATE POLICY user_access ON investments
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Investment Tracker table
CREATE POLICY user_access ON investment_tracker
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM investments
            WHERE investment_id = investment_tracker.investment_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM investments
            WHERE investment_id = investment_tracker.investment_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    );

-- Debts table
CREATE POLICY user_access ON debts
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Debt Tracker table
CREATE POLICY user_access ON debt_tracker
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM debts
            WHERE debt_id = debt_tracker.debt_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM debts
            WHERE debt_id = debt_tracker.debt_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    );

-- Goals table
CREATE POLICY user_access ON goals
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Goal Tracker table
CREATE POLICY user_access ON goal_tracker
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goal_id = goal_tracker.goal_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM goals
            WHERE goal_id = goal_tracker.goal_id
            AND (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
        )
    );

-- Transfer Records table
CREATE POLICY user_access ON transfer_records
    FOR ALL
    USING (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin')
    WITH CHECK (user_id = auth.uid() OR (SELECT role FROM users WHERE user_id = auth.uid()) = 'admin');

-- Grant necessary permissions to authenticated users
GRANT ALL ON currencies, currency_conversions, setup, error_logs, notifications, audit_logs, reports, scheduled_transactions, users, accounts, income_categories, expense_categories, income_records, expense_records, budgets, budget_tracker, investments, investment_tracker, debts, debt_tracker, goals, goal_tracker, transfer_records TO authenticated;

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_scheduled_transactions_next_execution ON scheduled_transactions(next_execution_date);