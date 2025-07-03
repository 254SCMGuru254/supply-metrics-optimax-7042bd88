
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ABCAnalysisProps {
  projectId: string;
}

interface InventoryItem {
  id: string;
  sku: string;
  description: string;
  unit_cost: number;
  demand_rate: number;
  abc_classification?: 'A' | 'B' | 'C';
}

interface ABCAnalysisResult {
  item: InventoryItem;
  annualValue: number;
  percentage: number;
  cumulativePercentage: number;
  classification: 'A' | 'B' | 'C';
}

export const ABCAnalysis = ({ projectId }: ABCAnalysisProps) => {
  const [analysisResults, setAnalysisResults] = useState<ABCAnalysisResult[]>([]);

  // Fetch inventory items
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['inventoryItems', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) throw new Error(error.message);
      return data as InventoryItem[];
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (inventoryItems && inventoryItems.length > 0) {
      performABCAnalysis(inventoryItems);
    }
  }, [inventoryItems]);

  const performABCAnalysis = (items: InventoryItem[]) => {
    // Calculate annual value for each item
    const itemsWithValue = items.map(item => ({
      item,
      annualValue: item.unit_cost * item.demand_rate * 365 // Assuming daily demand rate
    }));

    // Sort by annual value (descending)
    itemsWithValue.sort((a, b) => b.annualValue - a.annualValue);

    // Calculate total value
    const totalValue = itemsWithValue.reduce((sum, item) => sum + item.annualValue, 0);

    // Calculate percentages and cumulative percentages
    let cumulativeValue = 0;
    const results: ABCAnalysisResult[] = itemsWithValue.map(({ item, annualValue }) => {
      const percentage = (annualValue / totalValue) * 100;
      cumulativeValue += percentage;
      
      // Classify based on cumulative percentage
      let classification: 'A' | 'B' | 'C';
      if (cumulativeValue <= 80) {
        classification = 'A';
      } else if (cumulativeValue <= 95) {
        classification = 'B';
      } else {
        classification = 'C';
      }

      return {
        item,
        annualValue,
        percentage,
        cumulativePercentage: cumulativeValue,
        classification
      };
    });

    setAnalysisResults(results);
  };

  const getClassificationColor = (classification: 'A' | 'B' | 'C') => {
    switch (classification) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const chartData = analysisResults.slice(0, 10).map(result => ({
    sku: result.item.sku,
    value: result.annualValue,
    classification: result.classification
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading ABC Analysis...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inventoryItems || inventoryItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ABC Analysis</CardTitle>
          <CardDescription>No inventory items found for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Add inventory items to perform ABC analysis.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ABC Analysis Results</CardTitle>
          <CardDescription>
            Categorization of inventory items based on annual value contribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sku" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Annual Value"]} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed ABC Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Annual Value</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Cumulative %</TableHead>
                <TableHead>Classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysisResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{result.item.sku}</TableCell>
                  <TableCell>{result.item.description}</TableCell>
                  <TableCell>${result.annualValue.toLocaleString()}</TableCell>
                  <TableCell>{result.percentage.toFixed(2)}%</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{result.cumulativePercentage.toFixed(2)}%</span>
                      <Progress value={result.cumulativePercentage} className="w-16 h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getClassificationColor(result.classification)}>
                      Class {result.classification}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
