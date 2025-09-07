-- Users Table
CREATE TABLE users (
    user_id UUID NOT NULL DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role VARCHAR(10) CHECK (role IN ('admin', 'user', 'god')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (user_id)
);

CREATE INDEX idx_users_name_role ON users (first_name, last_name, role);

-- Accounts Table
CREATE TABLE accounts (
    account_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_name VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(12, 2) NOT NULL CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (account_id),
    CONSTRAINT fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_accounts_user_id_name ON accounts (user_id, account_name);

-- Goals Table
CREATE TABLE goals (
    goal_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    goal_name VARCHAR(50) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(12, 2) NOT NULL CHECK (current_amount >= 0) DEFAULT 0,
    target_date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (goal_id),
    CONSTRAINT fk_goals_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_goals_user_id_name ON goals (user_id, goal_name);

-- Goal_Tracker Table
CREATE TABLE goal_tracker (
    goal_tracker_id UUID NOT NULL DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL,
    contribution_amount DECIMAL(12, 2) NOT NULL CHECK (contribution_amount > 0),
    contribution_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (goal_tracker_id),
    CONSTRAINT fk_goal_tracker_goal_id FOREIGN KEY (goal_id) REFERENCES goals (goal_id) ON DELETE CASCADE
);

CREATE INDEX idx_goal_tracker_goal_id ON goal_tracker (goal_id);

-- Income_Categories Table
CREATE TABLE income_categories (
    income_category_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (income_category_id),
    CONSTRAINT fk_income_categories_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_income_categories_user_id_name ON income_categories (user_id, category_name);

-- Expense_Categories Table
CREATE TABLE expense_categories (
    expense_category_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (expense_category_id),
    CONSTRAINT fk_expense_categories_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_expense_categories_user_id_name ON expense_categories (user_id, category_name);

-- Income_Records Table
CREATE TABLE income_records (
    income_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    income_category_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (income_id),
    CONSTRAINT fk_income_records_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_income_records_account_id FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE CASCADE,
    CONSTRAINT fk_income_records_category_id FOREIGN KEY (income_category_id) REFERENCES income_categories (income_category_id) ON DELETE RESTRICT
);

CREATE INDEX idx_income_records_user_id_date ON income_records (user_id, transaction_date);

-- Expense_Records Table
CREATE TABLE expense_records (
    expense_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    account_id UUID NOT NULL,
    expense_category_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (expense_id),
    CONSTRAINT fk_expense_records_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_records_account_id FOREIGN KEY (account_id) REFERENCES accounts (account_id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_records_category_id FOREIGN KEY (expense_category_id) REFERENCES expense_categories (expense_category_id) ON DELETE RESTRICT
);

CREATE INDEX idx_expense_records_user_id_date ON expense_records (user_id, transaction_date);

-- Budgets Table
CREATE TABLE budgets (
    budget_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    expense_category_id UUID NOT NULL,
    income_category_id UUID NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    calculated_amount DECIMAL(12, 2) NOT NULL CHECK (calculated_amount >= 0),
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (budget_id),
    CONSTRAINT fk_budgets_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_budgets_expense_category_id FOREIGN KEY (expense_category_id) REFERENCES expense_categories (expense_category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_budgets_income_category_id FOREIGN KEY (income_category_id) REFERENCES income_categories (income_category_id) ON DELETE RESTRICT,
    CONSTRAINT chk_budget_period CHECK (period_start_date <= period_end_date)
);

CREATE INDEX idx_budgets_user_id ON budgets (user_id);

-- Budget_Tracker Table
CREATE TABLE budget_tracker (
    budget_tracker_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    budget_id UUID NOT NULL,
    total_spent DECIMAL(12, 2) NOT NULL CHECK (total_spent >= 0) DEFAULT 0,
    total_received DECIMAL(12, 2) NOT NULL CHECK (total_received >= 0) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (budget_tracker_id),
    CONSTRAINT fk_budget_tracker_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_budget_tracker_budget_id FOREIGN KEY (budget_id) REFERENCES budgets (budget_id) ON DELETE CASCADE,
    CONSTRAINT unique_budget_tracker_budget_id UNIQUE (budget_id, user_id)
);

CREATE INDEX idx_budget_tracker_budget_id ON budget_tracker (budget_id);

-- Transfer_Records Table
CREATE TABLE transfer_records (
    transfer_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    from_account_id UUID NOT NULL,
    to_account_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    transfer_date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (transfer_id),
    CONSTRAINT fk_transfer_records_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_transfer_records_from_account_id FOREIGN KEY (from_account_id) REFERENCES accounts (account_id) ON DELETE RESTRICT,
    CONSTRAINT fk_transfer_records_to_account_id FOREIGN KEY (to_account_id) REFERENCES accounts (account_id) ON DELETE RESTRICT
);

CREATE INDEX idx_transfer_records_user_id ON transfer_records (user_id);

-- Portfolio Table
CREATE TABLE portfolio (
    portfolio_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    portfolio_name VARCHAR(150) NOT NULL,
    portfolio_type VARCHAR(50) NOT NULL,
    amount_invested DECIMAL(12, 2) NOT NULL CHECK (amount_invested >= 0),
    current_value DECIMAL(12, 2) NOT NULL CHECK (current_value >= 0),
    purchased_quantity DECIMAL(12, 2) NOT NULL CHECK (purchased_quantity >= 0),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    icon_url TEXT CHECK (icon_url IS NULL OR icon_url <> ''),
    PRIMARY KEY (portfolio_id),
    CONSTRAINT fk_portfolio_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_portfolio_user_id_name ON portfolio (user_id, portfolio_name);

-- Investment_Records Table
CREATE TABLE investment_records (
    investment_record_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    portfolio_id UUID NOT NULL,
    invested_amount DECIMAL(12, 2) NOT NULL CHECK (invested_amount > 0),
    purchased_quantity DECIMAL(12, 2) NOT NULL CHECK (purchased_quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (investment_record_id),
    CONSTRAINT fk_investment_records_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_investment_records_portfolio_id FOREIGN KEY (portfolio_id) REFERENCES portfolio (portfolio_id) ON DELETE CASCADE
);

CREATE INDEX idx_investment_records_user_id_portfolio ON investment_records (user_id, portfolio_id);

-- Debts Table
CREATE TABLE debts (
    debt_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    creditor_name VARCHAR(100) NOT NULL,
    amount_owed DECIMAL(12, 2) NOT NULL CHECK (amount_owed > 0),
    interest_rate DECIMAL(5, 2) NOT NULL CHECK (interest_rate >= 0),
    amount_repaid DECIMAL(12, 2) NOT NULL CHECK (amount_repaid >= 0) DEFAULT 0,
    due_date DATE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (debt_id),
    CONSTRAINT fk_debts_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_debts_user_id_creditor ON debts (user_id, creditor_name);

-- Debt_Tracker Table
CREATE TABLE debt_tracker (
    debt_tracker_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    debt_id UUID NOT NULL,
    payment_amount DECIMAL(12, 2) NOT NULL CHECK (payment_amount > 0),
    payment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (debt_tracker_id),
    CONSTRAINT fk_debt_tracker_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_debt_tracker_debt_id FOREIGN KEY (debt_id) REFERENCES debts (debt_id) ON DELETE CASCADE
);

CREATE INDEX idx_debt_tracker_debt_id ON debt_tracker (debt_id);

-- Trigger Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER trigger_update_users
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_accounts
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_goals
    BEFORE UPDATE ON goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_goal_tracker
    BEFORE UPDATE ON goal_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_income_categories
    BEFORE UPDATE ON income_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_expense_categories
    BEFORE UPDATE ON expense_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_income_records
    BEFORE UPDATE ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_expense_records
    BEFORE UPDATE ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_budgets
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_budget_tracker
    BEFORE UPDATE ON budget_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_transfer_records
    BEFORE UPDATE ON transfer_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_portfolio
    BEFORE UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_investment_records
    BEFORE UPDATE ON investment_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_debts
    BEFORE UPDATE ON debts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_debt_tracker
    BEFORE UPDATE ON debt_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to validate and update account balance for income
CREATE OR REPLACE FUNCTION update_account_balance_income()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE accounts
    SET balance = balance + NEW.amount
    WHERE account_id = NEW.account_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_income_balance
    AFTER INSERT ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance_income();

-- Function to validate and update account balance for expenses
CREATE OR REPLACE FUNCTION update_account_balance_expense()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT balance FROM accounts WHERE account_id = NEW.account_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient balance in account % for expense of %', NEW.account_id, NEW.amount;
    END IF;
    UPDATE accounts
    SET balance = balance - NEW.amount
    WHERE account_id = NEW.account_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_expense_balance
    BEFORE INSERT ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance_expense();

-- Function to validate and update account balance for transfers
CREATE OR REPLACE FUNCTION update_account_balance_transfer()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT balance FROM accounts WHERE account_id = NEW.from_account_id) < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient balance in account % for transfer of %', NEW.from_account_id, NEW.amount;
    END IF;
    UPDATE accounts
    SET balance = balance - NEW.amount
    WHERE account_id = NEW.from_account_id;
    UPDATE accounts
    SET balance = balance + NEW.amount
    WHERE account_id = NEW.to_account_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_transfer_balance
    BEFORE INSERT ON transfer_records
    FOR EACH ROW
    EXECUTE FUNCTION update_account_balance_transfer();

-- Function to update goal current_amount
CREATE OR REPLACE FUNCTION update_goal_amount()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE goals
    SET current_amount = current_amount + NEW.contribution_amount
    WHERE goal_id = NEW.goal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_goal_amount
    AFTER INSERT ON goal_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_goal_amount();

-- Function to update debt amount_repaid
CREATE OR REPLACE FUNCTION update_debt_repaid()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE debts
    SET amount_repaid = amount_repaid + NEW.payment_amount
    WHERE debt_id = NEW.debt_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_debt_repaid
    AFTER INSERT ON debt_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_debt_repaid();

-- Function to update budget_tracker totals
CREATE OR REPLACE FUNCTION update_budget_tracker()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'income_records' THEN
        INSERT INTO budget_tracker (budget_tracker_id, user_id, budget_id, total_spent, total_received, created_at, updated_at)
        SELECT gen_random_uuid(), NEW.user_id, b.budget_id, 0, NEW.amount, now(), now()
        FROM budgets b
        WHERE b.user_id = NEW.user_id
        AND b.income_category_id = NEW.income_category_id
        AND NEW.transaction_date BETWEEN b.period_start_date AND b.period_end_date
        ON CONFLICT ON CONSTRAINT unique_budget_tracker_budget_id
        DO UPDATE SET total_received = budget_tracker.total_received + NEW.amount,
                      updated_at = now();
    ELSIF TG_TABLE_NAME = 'expense_records' THEN
        INSERT INTO budget_tracker (budget_tracker_id, user_id, budget_id, total_spent, total_received, created_at, updated_at)
        SELECT gen_random_uuid(), NEW.user_id, b.budget_id, NEW.amount, 0, now(), now()
        FROM budgets b
        WHERE b.user_id = NEW.user_id
        AND b.expense_category_id = NEW.expense_category_id
        AND NEW.transaction_date BETWEEN b.period_start_date AND b.period_end_date
        ON CONFLICT ON CONSTRAINT unique_budget_tracker_budget_id
        DO UPDATE SET total_spent = budget_tracker.total_spent + NEW.amount,
                      updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_budget_tracker_income
    AFTER INSERT ON income_records
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_tracker();

CREATE TRIGGER trigger_budget_tracker_expense
    AFTER INSERT ON expense_records
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_tracker();