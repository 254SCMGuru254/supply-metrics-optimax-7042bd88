
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Download, Upload, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  annualValue: number;
  classification: 'A' | 'B' | 'C';
  percentage: number;
  cumulativePercentage: number;
}

interface ABCAnalysisProps {
  projectId?: string;
}

const ABCAnalysis: React.FC<ABCAnalysisProps> = ({ projectId }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    annualUsage: 0,
    unitCost: 0
  });
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const { toast } = useToast();

  // Sample data for demonstration
  const sampleData = [
    { id: '1', name: 'Premium Coffee Beans', annualUsage: 1000, unitCost: 25.50 },
    { id: '2', name: 'Tea Leaves', annualUsage: 500, unitCost: 15.00 },
    { id: '3', name: 'Sugar', annualUsage: 2000, unitCost: 2.50 },
    { id: '4', name: 'Milk Powder', annualUsage: 800, unitCost: 8.00 },
    { id: '5', name: 'Coffee Filters', annualUsage: 1200, unitCost: 0.50 },
    { id: '6', name: 'Packaging Material', annualUsage: 3000, unitCost: 1.20 },
    { id: '7', name: 'Cleaning Supplies', annualUsage: 200, unitCost: 5.00 },
    { id: '8', name: 'Equipment Parts', annualUsage: 50, unitCost: 45.00 },
  ];

  useEffect(() => {
    // Initialize with sample data
    const initialItems = sampleData.map(item => ({
      ...item,
      annualValue: item.annualUsage * item.unitCost,
      classification: 'A' as const,
      percentage: 0,
      cumulativePercentage: 0
    }));
    
    const analyzed = performABCAnalysis(initialItems);
    setItems(analyzed);
  }, []);

  const performABCAnalysis = (itemList: Omit<InventoryItem, 'classification' | 'percentage' | 'cumulativePercentage'>[]): InventoryItem[] => {
    // Calculate total annual value
    const totalValue = itemList.reduce((sum, item) => sum + item.annualValue, 0);
    
    // Sort by annual value in descending order
    const sortedItems = [...itemList].sort((a, b) => b.annualValue - a.annualValue);
    
    // Calculate percentages and cumulative percentages
    let cumulativeValue = 0;
    const analyzedItems: InventoryItem[] = sortedItems.map(item => {
      const percentage = (item.annualValue / totalValue) * 100;
      cumulativeValue += item.annualValue;
      const cumulativePercentage = (cumulativeValue / totalValue) * 100;
      
      // Classify items
      let classification: 'A' | 'B' | 'C';
      if (cumulativePercentage <= 80) {
        classification = 'A';
      } else if (cumulativePercentage <= 95) {
        classification = 'B';
      } else {
        classification = 'C';
      }
      
      return {
        ...item,
        percentage,
        cumulativePercentage,
        classification
      };
    });

    // Calculate summary statistics
    const aItems = analyzedItems.filter(item => item.classification === 'A');
    const bItems = analyzedItems.filter(item => item.classification === 'B');
    const cItems = analyzedItems.filter(item => item.classification === 'C');

    const results = {
      totalItems: analyzedItems.length,
      totalValue,
      aItems: aItems.length,
      bItems: bItems.length,
      cItems: cItems.length,
      classAValuePercentage: (aItems.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100,
      classBValuePercentage: (bItems.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100,
      classCValuePercentage: (cItems.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100,
    };

    setAnalysisResults(results);
    return analyzedItems;
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.annualUsage <= 0 || newItem.unitCost <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields with valid values",
        variant: "destructive"
      });
      return;
    }

    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      annualUsage: newItem.annualUsage,
      unitCost: newItem.unitCost,
      annualValue: newItem.annualUsage * newItem.unitCost
    };

    const updatedItems = [...items, item];
    const analyzed = performABCAnalysis(updatedItems);
    setItems(analyzed);
    setNewItem({ name: '', annualUsage: 0, unitCost: 0 });
    
    toast({
      title: "Item Added",
      description: "Item has been added and analysis updated"
    });
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'A': return 'bg-red-100 text-red-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const chartData = analysisResults ? [
    { name: 'Class A', count: analysisResults.aItems, value: analysisResults.classAValuePercentage, color: '#ef4444' },
    { name: 'Class B', count: analysisResults.bItems, value: analysisResults.classBValuePercentage, color: '#f59e0b' },
    { name: 'Class C', count: analysisResults.cItems, value: analysisResults.classCValuePercentage, color: '#10b981' }
  ] : [];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">ABC Analysis</h2>
          <p className="text-muted-foreground">Classify inventory items based on their annual value</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="annualUsage">Annual Usage</Label>
              <Input
                id="annualUsage"
                type="number"
                value={newItem.annualUsage || ''}
                onChange={(e) => setNewItem({...newItem, annualUsage: parseInt(e.target.value) || 0})}
                placeholder="Enter annual usage"
              />
            </div>
            <div>
              <Label htmlFor="unitCost">Unit Cost ($)</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={newItem.unitCost || ''}
                onChange={(e) => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                placeholder="Enter unit cost"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Classification Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-semibold">Class A Items</div>
                    <div className="text-sm text-gray-600">High value items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{analysisResults.aItems}</div>
                    <div className="text-sm text-gray-600">{analysisResults.classAValuePercentage.toFixed(1)}% of value</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <div className="font-semibold">Class B Items</div>
                    <div className="text-sm text-gray-600">Medium value items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-600">{analysisResults.bItems}</div>
                    <div className="text-sm text-gray-600">{analysisResults.classBValuePercentage.toFixed(1)}% of value</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-semibold">Class C Items</div>
                    <div className="text-sm text-gray-600">Low value items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{analysisResults.cItems}</div>
                    <div className="text-sm text-gray-600">{analysisResults.classCValuePercentage.toFixed(1)}% of value</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Value Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, count }) => `${name}: ${count} items`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Annual Usage</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Annual Value</TableHead>
                  <TableHead>Value %</TableHead>
                  <TableHead>Cumulative %</TableHead>
                  <TableHead>Classification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.annualUsage.toLocaleString()}</TableCell>
                    <TableCell>${item.unitCost.toFixed(2)}</TableCell>
                    <TableCell>${item.annualValue.toFixed(2)}</TableCell>
                    <TableCell>{item.percentage.toFixed(1)}%</TableCell>
                    <TableCell>{item.cumulativePercentage.toFixed(1)}%</TableCell>
                    <TableCell>
                      <Badge className={getClassificationColor(item.classification)}>
                        Class {item.classification}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCAnalysis;
