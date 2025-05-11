
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Upload, Download, FileInput, Info, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface InventoryItem {
  id: string;
  name: string;
  unitCost: number;
  annualDemand: number;
  annualValue: number;
  cumulativePercentage: number;
  category: "A" | "B" | "C" | null;
}

export const ABCAnalysis = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([
    { 
      id: "1", 
      name: "Product A", 
      unitCost: 500, 
      annualDemand: 200, 
      annualValue: 100000,
      cumulativePercentage: 0,
      category: null
    },
    { 
      id: "2", 
      name: "Product B", 
      unitCost: 50, 
      annualDemand: 800, 
      annualValue: 40000,
      cumulativePercentage: 0,
      category: null
    },
    { 
      id: "3", 
      name: "Product C", 
      unitCost: 100, 
      annualDemand: 300, 
      annualValue: 30000,
      cumulativePercentage: 0,
      category: null
    },
    { 
      id: "4", 
      name: "Product D", 
      unitCost: 10, 
      annualDemand: 2000, 
      annualValue: 20000,
      cumulativePercentage: 0,
      category: null
    },
    { 
      id: "5", 
      name: "Product E", 
      unitCost: 5, 
      annualDemand: 1000, 
      annualValue: 5000,
      cumulativePercentage: 0,
      category: null
    }
  ]);
  const [analysisResults, setAnalysisResults] = useState<{
    classA: { itemCount: number, valuePercent: number },
    classB: { itemCount: number, valuePercent: number },
    classC: { itemCount: number, valuePercent: number },
    totalValue: number
  } | null>(null);

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    unitCost: 0,
    annualDemand: 0
  });

  const handleInputChange = (field: keyof InventoryItem, value: string, id?: string) => {
    if (id) {
      // Update existing item
      setItems(items.map(item => {
        if (item.id === id) {
          const updatedItem = { 
            ...item, 
            [field]: field === 'name' ? value : Number(value)
          };
          
          if (field === 'unitCost' || field === 'annualDemand') {
            updatedItem.annualValue = updatedItem.unitCost * updatedItem.annualDemand;
          }
          
          return updatedItem;
        }
        return item;
      }));
    } else {
      // Update new item form
      setNewItem({
        ...newItem,
        [field]: field === 'name' ? value : Number(value)
      });
    }
  };

  const addItem = () => {
    if (!newItem.name || !newItem.unitCost || !newItem.annualDemand) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields for the new item.",
        variant: "destructive"
      });
      return;
    }

    const annualValue = (newItem.unitCost || 0) * (newItem.annualDemand || 0);
    
    const newItemComplete: InventoryItem = {
      id: crypto.randomUUID(),
      name: newItem.name || "",
      unitCost: newItem.unitCost || 0,
      annualDemand: newItem.annualDemand || 0,
      annualValue,
      cumulativePercentage: 0,
      category: null
    };
    
    setItems([...items, newItemComplete]);
    setNewItem({
      name: "",
      unitCost: 0,
      annualDemand: 0
    });
    
    toast({
      title: "Item Added",
      description: `${newItemComplete.name} has been added to the analysis.`
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const performABCAnalysis = () => {
    if (items.length === 0) {
      toast({
        title: "No Items",
        description: "Add items to perform ABC analysis.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Sort items by annual value (descending)
      const sortedItems = [...items].sort((a, b) => b.annualValue - a.annualValue);
      
      // Calculate total annual value
      const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
      
      // Calculate cumulative percentages
      let cumulativeValue = 0;
      const itemsWithCumulative = sortedItems.map(item => {
        cumulativeValue += item.annualValue;
        const cumulativePercentage = (cumulativeValue / totalValue) * 100;
        
        let category: "A" | "B" | "C" | null = null;
        if (cumulativePercentage <= 70) {
          category = "A";
        } else if (cumulativePercentage <= 90) {
          category = "B";
        } else {
          category = "C";
        }
        
        return {
          ...item,
          cumulativePercentage,
          category
        };
      });
      
      // Count items and value by category
      const categoryStats = itemsWithCumulative.reduce((stats, item) => {
        if (item.category) {
          stats[item.category].count += 1;
          stats[item.category].value += item.annualValue;
        }
        return stats;
      }, {
        A: { count: 0, value: 0 },
        B: { count: 0, value: 0 },
        C: { count: 0, value: 0 }
      });
      
      // Calculate percentages
      const totalItems = items.length;
      const results = {
        classA: {
          itemCount: (categoryStats.A.count / totalItems) * 100,
          valuePercent: (categoryStats.A.value / totalValue) * 100
        },
        classB: {
          itemCount: (categoryStats.B.count / totalItems) * 100,
          valuePercent: (categoryStats.B.value / totalValue) * 100
        },
        classC: {
          itemCount: (categoryStats.C.count / totalItems) * 100,
          valuePercent: (categoryStats.C.value / totalValue) * 100
        },
        totalValue
      };
      
      setItems(itemsWithCumulative);
      setAnalysisResults(results);
      
      toast({
        title: "ABC Analysis Complete",
        description: "Items have been classified into A, B, and C categories."
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred while performing the ABC analysis.",
        variant: "destructive"
      });
    }
  };

  const exportCSV = () => {
    if (items.length === 0) {
      toast({
        title: "No Data",
        description: "There are no items to export.",
        variant: "destructive"
      });
      return;
    }
    
    const headers = ["Item Name", "Unit Cost", "Annual Demand", "Annual Value", "Cumulative %", "Category"];
    const rows = items.map(item => [
      item.name,
      item.unitCost,
      item.annualDemand,
      item.annualValue,
      item.cumulativePercentage.toFixed(2) + "%",
      item.category || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abc_analysis.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "ABC analysis data has been exported to CSV."
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">ABC Inventory Analysis</h2>
          </div>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import inventory data from CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">
          ABC Analysis is an inventory categorization technique that divides inventory into three categories based on value:
          Class A (high-value), Class B (medium-value), and Class C (low-value). This helps optimize inventory management resources.
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-name">Item Name</Label>
              <Input 
                id="new-name"
                value={newItem.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-unit-cost">Unit Cost ($)</Label>
              <Input 
                id="new-unit-cost"
                type="number"
                value={newItem.unitCost}
                onChange={(e) => handleInputChange('unitCost', e.target.value)}
                placeholder="Enter unit cost"
                min="0.01"
                step="0.01"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-annual-demand">Annual Demand (units)</Label>
              <div className="flex space-x-2">
                <Input 
                  id="new-annual-demand"
                  type="number"
                  value={newItem.annualDemand}
                  onChange={(e) => handleInputChange('annualDemand', e.target.value)}
                  placeholder="Enter annual demand"
                  min="1"
                  className="flex-1"
                />
                <Button onClick={addItem}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-medium">Inventory Items</h3>
              <Button onClick={performABCAnalysis}>Run ABC Analysis</Button>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Unit Cost ($)</TableHead>
                    <TableHead className="text-right">Annual Demand</TableHead>
                    <TableHead className="text-right">Annual Value ($)</TableHead>
                    {analysisResults && (
                      <>
                        <TableHead className="text-right">Cumulative %</TableHead>
                        <TableHead>Category</TableHead>
                      </>
                    )}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className={
                      item.category === "A" ? "bg-green-50 dark:bg-green-900/20" :
                      item.category === "B" ? "bg-blue-50 dark:bg-blue-900/20" :
                      item.category === "C" ? "bg-amber-50 dark:bg-amber-900/20" : ""
                    }>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">${item.unitCost}</TableCell>
                      <TableCell className="text-right">{item.annualDemand}</TableCell>
                      <TableCell className="text-right">${item.annualValue.toLocaleString()}</TableCell>
                      {analysisResults && (
                        <>
                          <TableCell className="text-right">{item.cumulativePercentage.toFixed(2)}%</TableCell>
                          <TableCell>
                            {item.category && (
                              <span className={
                                item.category === "A" ? "font-semibold text-green-600 dark:text-green-400" :
                                item.category === "B" ? "font-semibold text-blue-600 dark:text-blue-400" :
                                "font-semibold text-amber-600 dark:text-amber-400"
                              }>
                                Class {item.category}
                              </span>
                            )}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>
      
      {analysisResults && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-6">ABC Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-4 border-l-4 border-green-500">
              <h4 className="text-lg font-medium text-green-700 dark:text-green-400">Class A Items</h4>
              <p className="text-3xl font-bold my-2">{analysisResults.classA.itemCount.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of items</p>
              <p className="text-xl font-semibold mt-4 text-green-600">{analysisResults.classA.valuePercent.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of total value</p>
            </Card>
            
            <Card className="p-4 border-l-4 border-blue-500">
              <h4 className="text-lg font-medium text-blue-700 dark:text-blue-400">Class B Items</h4>
              <p className="text-3xl font-bold my-2">{analysisResults.classB.itemCount.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of items</p>
              <p className="text-xl font-semibold mt-4 text-blue-600">{analysisResults.classB.valuePercent.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of total value</p>
            </Card>
            
            <Card className="p-4 border-l-4 border-amber-500">
              <h4 className="text-lg font-medium text-amber-700 dark:text-amber-400">Class C Items</h4>
              <p className="text-3xl font-bold my-2">{analysisResults.classC.itemCount.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of items</p>
              <p className="text-xl font-semibold mt-4 text-amber-600">{analysisResults.classC.valuePercent.toFixed(0)}%</p>
              <p className="text-sm text-muted-foreground">of total value</p>
            </Card>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <h4 className="text-lg font-medium mb-2">Management Recommendations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>Class A Items:</strong> Strict inventory control, frequent counting, accurate demand forecasting, and close monitoring of lead times.</li>
              <li><strong>Class B Items:</strong> Regular monitoring with moderate controls, less frequent reviews than Class A items.</li>
              <li><strong>Class C Items:</strong> Simplest controls with minimal record keeping, bulk ordering, and higher safety stock levels.</li>
            </ul>
          </div>
        </Card>
      )}
      
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-primary mt-1" />
          <div>
            <h3 className="text-lg font-medium">About ABC Analysis</h3>
            <p className="text-sm text-muted-foreground mt-2">
              ABC Analysis is based on the Pareto principle (80/20 rule), which suggests that 80% of effects come from 20% of causes. 
              In inventory management, this translates to a small percentage of items accounting for a large percentage of inventory value.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Typically, Class A items (10-20% of inventory) account for 70-80% of the total value, Class B items (30%) represent 15-20% of value, 
              and Class C items (50-60%) account for just 5-10% of value. This categorization helps allocate resources efficiently.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
