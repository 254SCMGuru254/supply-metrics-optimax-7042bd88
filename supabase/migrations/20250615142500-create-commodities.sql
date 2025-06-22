CREATE TABLE commodities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    name TEXT,
    source_id UUID,
    sink_id UUID,
    demand FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own commodities"
ON commodities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commodities"
ON commodities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commodities"
ON commodities FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own commodities"
ON commodities FOR DELETE
USING (auth.uid() = user_id); 