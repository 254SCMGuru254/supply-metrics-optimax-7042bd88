CREATE TABLE horticultural_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    country TEXT,
    reliability FLOAT,
    transport_cost FLOAT,
    quality_score FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE horticultural_suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own horticultural suppliers"
ON horticultural_suppliers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own horticultural suppliers"
ON horticultural_suppliers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own horticultural suppliers"
ON horticultural_suppliers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own horticultural suppliers"
ON horticultural_suppliers FOR DELETE
USING (auth.uid() = user_id); 