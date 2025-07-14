
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface HeuristicContentProps {
  projectId: string;
}

export const HeuristicContent: React.FC<HeuristicContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Heuristic Algorithm Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Heuristic configuration coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
