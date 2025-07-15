
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComprehensiveDataContentProps {
  projectId: string;
}

export const ComprehensiveDataContent: React.FC<ComprehensiveDataContentProps> = ({ projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Data Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Comprehensive data analysis for project {projectId}</p>
      </CardContent>
    </Card>
  );
};
