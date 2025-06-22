CREATE TABLE kenya_supply_chain_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    category TEXT,
    title TEXT,
    description TEXT,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kenya_supply_chain_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own kenya supply chain data"
ON kenya_supply_chain_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own kenya supply chain data"
ON kenya_supply_chain_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kenya supply chain data"
ON kenya_supply_chain_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kenya supply chain data"
ON kenya_supply_chain_data FOR DELETE
USING (auth.uid() = user_id); 