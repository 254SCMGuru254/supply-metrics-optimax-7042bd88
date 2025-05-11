
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, FileInput, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  annualValue: number;
  percentOfTotal: number;
  cumulativePercent: number;
  category: 'A' | 'B' | 'C';
}

export const ABCAnalysis = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    annualUsage: 0,
    unitCost: 0
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.name || newItem.annualUsage <= 0 || newItem.unitCost <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid item details",
        variant: "destructive"
      });
      return;
    }

    const updatedItems = [
      ...items,
      {
        id: crypto.randomUUID(),
        name: newItem.name,
        annualUsage: newItem.annualUsage,
        unitCost: newItem.unitCost,
        annualValue: newItem.annualUsage * newItem.unitCost,
        percentOfTotal: 0, // Will be calculated in performABCAnalysis
        cumulativePercent: 0, // Will be calculated in performABCAnalysis
        category: 'C' as 'A' | 'B' | 'C' // Default, will be updated
      }
    ];

    setItems(updatedItems);
    setNewItem({ name: '', annualUsage: 0, unitCost: 0 });
    
    // Perform analysis if we have items
    if (updatedItems.length > 0) {
      performABCAnalysis(updatedItems);
    }
  };

  const performABCAnalysis = (inventoryItems: InventoryItem[]) => {
    // Calculate annual value for each item
    const itemsWithValue = inventoryItems.map(item => ({
      ...item,
      annualValue: item.annualUsage * item.unitCost
    }));

    // Sort items by annual value in descending order
    const sortedItems = [...itemsWithValue].sort((a, b) => b.annualValue - a.annualValue);
    
    // Calculate total annual value
    const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
    
    // Calculate percent of total and cumulative percent
    let cumulativePercent = 0;
    const analyzedItems = sortedItems.map(item => {
      const percentOfTotal = (item.annualValue / totalValue) * 100;
      cumulativePercent += percentOfTotal;
      
      // Assign categories based on Pareto principle
      // A items: Top 80% of value (approximately 20% of items)
      // B items: Next 15% of value (approximately 30% of items)
      // C items: Bottom 5% of value (approximately 50% of items)
      let category: 'A' | 'B' | 'C' = 'C';
      if (cumulativePercent <= 80) {
        category = 'A';
      } else if (cumulativePercent <= 95) {
        category = 'B';
      }
      
      return {
        ...item,
        percentOfTotal,
        cumulativePercent,
        category
      };
    });
    
    setItems(analyzedItems);
    
    toast({
      title: "ABC Analysis Complete",
      description: `Analyzed ${analyzedItems.length} items across categories A, B, and C.`
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processFile = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        
        // Skip header row and process data rows
        const uploadedItems: InventoryItem[] = [];
        
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i].trim();
          if (row) {
            const columns = row.split(',');
            if (columns.length >= 3) {
              const name = columns[0].trim();
              const annualUsage = parseFloat(columns[1]);
              const unitCost = parseFloat(columns[2]);
              
              if (name && !isNaN(annualUsage) && !isNaN(unitCost)) {
                uploadedItems.push({
                  id: crypto.randomUUID(),
                  name,
                  annualUsage,
                  unitCost,
                  annualValue: annualUsage * unitCost,
                  percentOfTotal: 0,
                  cumulativePercent: 0,
                  category: 'C' as 'A' | 'B' | 'C'
                });
              }
            }
          }
        }
        
        if (uploadedItems.length > 0) {
          performABCAnalysis(uploadedItems);
        } else {
          throw new Error("No valid items found in CSV");
        }
      } catch (error) {
        toast({
          title: "File Processing Error",
          description: error instanceof Error ? error.message : "Failed to process CSV file",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "File Reading Error",
        description: "Failed to read the selected file",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  };

  const exportResults = () => {
    if (items.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Perform an ABC analysis first",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    const headers = "Item,Annual Usage,Unit Cost,Annual Value,% of Total,Cumulative %,Category\n";
    const rows = items.map(item => 
      `${item.name},${item.annualUsage},${item.unitCost},${item.annualValue.toFixed(2)},${item.percentOfTotal.toFixed(2)}%,${item.cumulativePercent.toFixed(2)}%,${item.category}`
    ).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abc-analysis-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Export Complete",
      description: "ABC analysis results have been downloaded as CSV"
    });
  };

  // Calculate statistics for summary
  const calculateStatistics = () => {
    if (items.length === 0) return null;
    
    const categories = {
      A: items.filter(item => item.category === 'A'),
      B: items.filter(item => item.category === 'B'),
      C: items.filter(item => item.category === 'C')
    };
    
    const totalValue = items.reduce((sum, item) => sum + item.annualValue, 0);
    
    return {
      totalItems: items.length,
      totalValue,
      categories: {
        A: {
          count: categories.A.length,
          percent: (categories.A.length / items.length) * 100,
          value: categories.A.reduce((sum, item) => sum + item.annualValue, 0),
          valuePercent: (categories.A.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100
        },
        B: {
          count: categories.B.length,
          percent: (categories.B.length / items.length) * 100,
          value: categories.B.reduce((sum, item) => sum + item.annualValue, 0),
          valuePercent: (categories.B.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100
        },
        C: {
          count: categories.C.length,
          percent: (categories.C.length / items.length) * 100,
          value: categories.C.reduce((sum, item) => sum + item.annualValue, 0),
          valuePercent: (categories.C.reduce((sum, item) => sum + item.annualValue, 0) / totalValue) * 100
        }
      }
    };
  };

  const statistics = calculateStatistics();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">ABC Inventory Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-4">Add Inventory Items</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Product name"
                />
              </div>
              <div>
                <Label htmlFor="annual-usage">Annual Usage (units)</Label>
                <Input
                  id="annual-usage"
                  type="number"
                  value={newItem.annualUsage || ''}
                  onChange={(e) => setNewItem({...newItem, annualUsage: Number(e.target.value)})}
                  placeholder="Annual quantity used"
                />
              </div>
              <div>
                <Label htmlFor="unit-cost">Unit Cost ($)</Label>
                <Input
                  id="unit-cost"
                  type="number"
                  value={newItem.unitCost || ''}
                  onChange={(e) => setNewItem({...newItem, unitCost: Number(e.target.value)})}
                  placeholder="Cost per unit"
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">Add Item</Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-lg font-semibold mb-4">Upload CSV</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileInput className="h-4 w-4" />
                <Label htmlFor="csv-upload">Upload inventory data file</Label>
              </div>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <p className="text-xs text-muted-foreground">
                CSV format: name, annual_usage, unit_cost
              </p>
              <Button onClick={processFile} variant="outline" className="w-full">
                Process File
              </Button>
            </div>
          </div>

          {statistics && (
            <div className="pt-4 border-t">
              <h4 className="text-lg font-semibold mb-4">Analysis Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-medium">{statistics.totalItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Value:</span>
                  <span className="font-medium">${statistics.totalValue.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 text-sm font-medium">
                      <span>Category</span>
                      <span>Items</span>
                      <span>% Items</span>
                      <span>% Value</span>
                    </div>
                    <div className="grid grid-cols-4 text-sm bg-green-50 p-1 rounded">
                      <span className="font-medium">A</span>
                      <span>{statistics.categories.A.count}</span>
                      <span>{statistics.categories.A.percent.toFixed(1)}%</span>
                      <span>{statistics.categories.A.valuePercent.toFixed(1)}%</span>
                    </div>
                    <div className="grid grid-cols-4 text-sm bg-yellow-50 p-1 rounded">
                      <span className="font-medium">B</span>
                      <span>{statistics.categories.B.count}</span>
                      <span>{statistics.categories.B.percent.toFixed(1)}%</span>
                      <span>{statistics.categories.B.valuePercent.toFixed(1)}%</span>
                    </div>
                    <div className="grid grid-cols-4 text-sm bg-blue-50 p-1 rounded">
                      <span className="font-medium">C</span>
                      <span>{statistics.categories.C.count}</span>
                      <span>{statistics.categories.C.percent.toFixed(1)}%</span>
                      <span>{statistics.categories.C.valuePercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <Button onClick={exportResults} variant="outline" className="w-full" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold mb-4">ABC Analysis Results</h4>
          {items.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Annual Usage</TableHead>
                    <TableHead className="text-right">Unit Cost</TableHead>
                    <TableHead className="text-right">Annual Value</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead className="text-right">Cumulative %</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.annualUsage.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.unitCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.annualValue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.percentOfTotal.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{item.cumulativePercent.toFixed(2)}%</TableCell>
                      <TableCell className="text-center">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${item.category === 'A' ? 'bg-green-100 text-green-800' : ''}
                          ${item.category === 'B' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${item.category === 'C' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {item.category}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-muted">
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Add inventory items or upload a CSV file to perform ABC analysis</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">About ABC Analysis</h4>
            <p className="text-sm text-muted-foreground">
              ABC Analysis is an inventory categorization method based on the Pareto principle (80/20 rule). 
              It categorizes inventory into three classes:
              <br />
              • <strong>A items</strong>: High-value products (top ~20% of items that account for ~80% of value)
              <br />
              • <strong>B items</strong>: Medium-value products (next ~30% of items accounting for ~15% of value)
              <br />
              • <strong>C items</strong>: Low-value products (bottom ~50% of items accounting for ~5% of value)
              <br />
              <br />
              This analysis helps prioritize inventory management efforts and optimize control systems for each category.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
