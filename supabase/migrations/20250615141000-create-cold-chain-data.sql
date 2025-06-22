CREATE TABLE cold_chain_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    project_id UUID REFERENCES projects(id),
    temperature_min FLOAT,
    temperature_max FLOAT,
    equipment_failure_rate FLOAT,
    power_outage_rate FLOAT,
    human_error_rate FLOAT,
    transport_failure_rate FLOAT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cold_chain_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cold chain data"
ON cold_chain_data FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cold chain data"
ON cold_chain_data FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cold chain data"
ON cold_chain_data FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cold chain data"
ON cold_chain_data FOR DELETE
USING (auth.uid() = user_id); 