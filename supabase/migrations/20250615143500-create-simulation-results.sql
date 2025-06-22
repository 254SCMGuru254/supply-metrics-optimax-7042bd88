CREATE TABLE simulation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    name TEXT,
    type TEXT,
    date TIMESTAMPTZ,
    status TEXT,
    service_level FLOAT,
    total_cost FLOAT,
    iterations INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own simulation results"
ON simulation_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own simulation results"
ON simulation_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own simulation results"
ON simulation_results FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own simulation results"
ON simulation_results FOR DELETE
USING (auth.uid() = user_id); 