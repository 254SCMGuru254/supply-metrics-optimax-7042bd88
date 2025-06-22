CREATE TABLE cost_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    activity_rates TEXT,
    activity_usage TEXT,
    acquisition_cost FLOAT,
    operating_cost FLOAT,
    disposal_cost FLOAT,
    benefits TEXT,
    costs TEXT,
    discount_rate FLOAT,
    time_periods INTEGER,
    fixed_costs FLOAT,
    price FLOAT,
    variable_cost FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cost_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cost data"
ON cost_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cost data"
ON cost_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cost data"
ON cost_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cost data"
ON cost_data FOR DELETE
USING (auth.uid() = user_id); 