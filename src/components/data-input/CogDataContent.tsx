
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface CogDataContentProps {
  projectId: string;
}

export const CogDataContent: React.FC<CogDataContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Center of Gravity Data Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Center of Gravity configuration coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
