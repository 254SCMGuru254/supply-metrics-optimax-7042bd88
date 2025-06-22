CREATE TABLE inventory_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    title TEXT NOT NULL,
    value TEXT NOT NULL,
    change TEXT,
    trend TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inventory_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own inventory metrics"
ON inventory_metrics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory metrics"
ON inventory_metrics FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory metrics"
ON inventory_metrics FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory metrics"
ON inventory_metrics FOR DELETE
USING (auth.uid() = user_id); 