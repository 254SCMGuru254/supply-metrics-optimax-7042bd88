
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComprehensiveDataContentProps {
  projectId: string;
}

export const ComprehensiveDataContent: React.FC<ComprehensiveDataContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">Comprehensive Data Input</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Data input interface for project: {projectId}</p>
      </CardContent>
    </Card>
  );
};
