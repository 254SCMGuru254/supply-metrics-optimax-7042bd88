
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralDataContentProps {
  projectId: string;
}

export const GeneralDataContent: React.FC<GeneralDataContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">General Data Input</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">General data input interface for project: {projectId}</p>
      </CardContent>
    </Card>
  );
};
