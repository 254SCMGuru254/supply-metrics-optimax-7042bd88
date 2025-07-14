
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { DollarSign, Calculator, TrendingUp } from 'lucide-react';

const costBreakdownData = [
  { name: 'Transportation', value: 35, color: '#8884d8' },
  { name: 'Warehousing', value: 25, color: '#82ca9d' },
  { name: 'Labor', value: 20, color: '#ffc658' },
  { name: 'Materials', value: 15, color: '#ff7c7c' },
  { name: 'Other', value: 5, color: '#8dd1e1' }
];

export const ComprehensiveCostModeling = () => {
  const [modelResults, setModelResults] = useState(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Comprehensive Cost Modeling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cost Components</h3>
              <div className="space-y-2">
                {costBreakdownData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <Badge variant="secondary">{item.value}%</Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Costs
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Cost Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {costBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
