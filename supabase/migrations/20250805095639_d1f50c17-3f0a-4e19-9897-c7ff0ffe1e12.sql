-- Fix remaining RLS issues: identify tables without RLS and enable it
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for KPIs (user-specific data)
CREATE POLICY "Users can view their own KPIs" 
ON public.kpis 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = kpis.project_id 
    AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own KPIs" 
ON public.kpis 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.id = kpis.project_id 
    AND p.user_id = auth.uid()
  )
);

-- Create RLS policies for chat conversations
CREATE POLICY "Users can manage their own conversations" 
ON public.chat_conversations 
FOR ALL 
USING (auth.uid() = user_id);