
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CostBreakdownProps {
  results: any;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ results }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Cost:</span>
            <span className="font-medium">KES {results?.totalCost?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Fixed Costs:</span>
            <span>KES {results?.fixedCosts?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Variable Costs:</span>
            <span>KES {results?.variableCosts?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Transportation Costs:</span>
            <span>KES {results?.transportationCosts?.toLocaleString() || 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
