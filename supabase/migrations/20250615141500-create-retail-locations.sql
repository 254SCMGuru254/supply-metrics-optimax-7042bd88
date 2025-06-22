CREATE TABLE retail_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    type TEXT NOT NULL,
    count INTEGER,
    avg_demand FLOAT,
    weight_factor FLOAT,
    storage_limit INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE retail_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own retail locations"
ON retail_locations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own retail locations"
ON retail_locations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own retail locations"
ON retail_locations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own retail locations"
ON retail_locations FOR DELETE
USING (auth.uid() = user_id); 