
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NodeForm } from '@/components/forms/NodeForm';
import { DemandPointForm } from '@/components/forms/DemandPointForm';

interface DataInputFormProps {
  projectId: string;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ projectId }) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="supply-nodes" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supply-nodes">Supply Nodes</TabsTrigger>
          <TabsTrigger value="demand-points">Demand Points</TabsTrigger>
        </TabsList>
        
        <TabsContent value="supply-nodes">
          <NodeForm projectId={projectId} />
        </TabsContent>
        
        <TabsContent value="demand-points">
          <DemandPointForm projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
