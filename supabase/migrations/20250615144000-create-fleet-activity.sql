CREATE TABLE fleet_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    activity TEXT,
    timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fleet_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own fleet activity"
ON fleet_activity FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fleet activity"
ON fleet_activity FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fleet activity"
ON fleet_activity FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fleet activity"
ON fleet_activity FOR DELETE
USING (auth.uid() = user_id); 