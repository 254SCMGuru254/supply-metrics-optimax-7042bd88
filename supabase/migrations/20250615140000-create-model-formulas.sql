CREATE TABLE model_formulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    formula TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    inputs JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE model_formulas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own model formulas"
ON model_formulas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own model formulas"
ON model_formulas FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own model formulas"
ON model_formulas FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own model formulas"
ON model_formulas FOR DELETE
USING (auth.uid() = user_id); 