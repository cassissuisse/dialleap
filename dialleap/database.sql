-- =============================================
-- DIALLEAP DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- BILLING: Per-minute, rounded up
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  credits_cents INTEGER DEFAULT 500,  -- $5.00 free to start
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call history (with per-minute billing)
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_number TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  billed_minutes INTEGER DEFAULT 0,  -- Rounded up minutes
  cost_cents INTEGER DEFAULT 0,
  rate_cents_per_min INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS messages
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  cost_cents INTEGER DEFAULT 5,  -- $0.05 per SMS
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Callback queue (unique feature!)
CREATE TABLE IF NOT EXISTS callback_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_number TEXT NOT NULL,
  target_name TEXT,
  status TEXT DEFAULT 'pending',  -- pending, waiting, connected, completed, failed
  cost_cents INTEGER DEFAULT 50,  -- $0.50 flat fee
  hold_duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  connected_at TIMESTAMPTZ
);

-- Known numbers database (for hold time estimates)
CREATE TABLE IF NOT EXISTS known_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,  -- government, airline, bank, etc.
  avg_hold_seconds INTEGER,
  best_call_times JSONB,
  tips TEXT
);

-- Purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL,
  credits_cents INTEGER NOT NULL,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Add credits to user account
CREATE OR REPLACE FUNCTION add_credits(p_user_id UUID, p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE profiles
  SET credits_cents = credits_cents + p_amount
  WHERE id = p_user_id
  RETURNING credits_cents INTO new_balance;
  RETURN new_balance;
END;
$$;

-- Deduct credits from user account
CREATE OR REPLACE FUNCTION deduct_credits(p_user_id UUID, p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  UPDATE profiles
  SET credits_cents = GREATEST(0, credits_cents - p_amount)
  WHERE id = p_user_id
  RETURNING credits_cents INTO new_balance;
  RETURN new_balance;
END;
$$;

-- Calculate billed minutes (rounded UP)
CREATE OR REPLACE FUNCTION calculate_billed_minutes(duration_seconds INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF duration_seconds = 0 THEN
    RETURN 0;
  END IF;
  RETURN CEIL(duration_seconds::NUMERIC / 60);
END;
$$;

-- Record a completed call and deduct credits
CREATE OR REPLACE FUNCTION record_call(
  p_user_id UUID,
  p_to_number TEXT,
  p_duration_seconds INTEGER,
  p_rate_cents_per_min INTEGER
)
RETURNS TABLE(call_id UUID, billed_minutes INTEGER, cost_cents INTEGER, new_balance INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_call_id UUID;
  v_billed_minutes INTEGER;
  v_cost_cents INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Calculate billing
  v_billed_minutes := calculate_billed_minutes(p_duration_seconds);
  v_cost_cents := v_billed_minutes * p_rate_cents_per_min;
  
  -- Insert call record
  INSERT INTO calls (user_id, to_number, duration_seconds, billed_minutes, cost_cents, rate_cents_per_min)
  VALUES (p_user_id, p_to_number, p_duration_seconds, v_billed_minutes, v_cost_cents, p_rate_cents_per_min)
  RETURNING id INTO v_call_id;
  
  -- Deduct credits
  v_new_balance := deduct_credits(p_user_id, v_cost_cents);
  
  RETURN QUERY SELECT v_call_id, v_billed_minutes, v_cost_cents, v_new_balance;
END;
$$;

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE known_numbers ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Calls: users can only see/insert their own
CREATE POLICY "Users can view own calls" ON calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calls" ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SMS: users can only see/insert their own
CREATE POLICY "Users can view own SMS" ON sms_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own SMS" ON sms_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Callback queue: users can only see/insert their own
CREATE POLICY "Users can view own callbacks" ON callback_queue FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own callbacks" ON callback_queue FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Purchases: users can only see their own
CREATE POLICY "Users can view own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);

-- Known numbers: anyone can read (public info)
CREATE POLICY "Anyone can view known numbers" ON known_numbers FOR SELECT USING (true);

-- =============================================
-- SEED DATA: Known Numbers
-- =============================================

INSERT INTO known_numbers (phone_number, name, category, avg_hold_seconds, best_call_times, tips) VALUES
('+18008291040', 'IRS', 'government', 2700, '{"days": ["tue", "wed", "thu"], "hours": [7, 8]}', 'Call early Tuesday-Thursday. Mondays are brutal after holidays.'),
('+18007721213', 'Social Security', 'government', 2100, '{"days": ["wed", "thu"], "hours": [8, 9]}', 'Wednesdays have shortest waits. Local offices are often faster.'),
('+18004321000', 'US Passport', 'government', 1500, '{"days": ["tue", "wed"], "hours": [8, 9]}', 'Call right when they open at 8 AM EST.'),
('+18002829749', 'USCIS', 'government', 3300, '{"days": ["tue", "wed", "thu"], "hours": [7, 8]}', 'Avoid Mondays. Use the online portal for simple questions.'),
('+18009194542', 'Delta Airlines', 'airline', 900, '{"days": ["tue", "wed"], "hours": [6, 7, 20, 21]}', 'Early morning or late evening has shortest waits.'),
('+18004359792', 'American Airlines', 'airline', 1200, '{"days": ["tue", "wed"], "hours": [6, 7]}', 'Try the app for rebooking before calling.'),
('+18002255288', 'United Airlines', 'airline', 1080, '{"days": ["tue", "wed"], "hours": [6, 7]}', 'Elite status line is much faster.')
ON CONFLICT (phone_number) DO NOTHING;

-- =============================================
-- DONE!
-- =============================================
