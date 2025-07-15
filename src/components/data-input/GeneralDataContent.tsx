
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralDataContentProps {
  projectId: string;
}

export const GeneralDataContent: React.FC<GeneralDataContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Data Input</CardTitle>
      </CardHeader>
      <CardContent>
        <p>General data input for project {projectId}</p>
      </CardContent>
    </Card>
  );
};
