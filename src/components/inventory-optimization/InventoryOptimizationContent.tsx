import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Package, 
  Boxes, 
  LineChart, 
  Clock, 
  Percent, 
  CircleDollarSign, 
  ShoppingBasket, 
  PieChart,
  Calculator,
  BookOpen,
  Upload,
  Download,
  BarChart
} from "lucide-react";
import { InventoryItem, EOQResult, ABCAnalysisResult } from "@/components/map/MapTypes";
import { calculateEOQ, performABCAnalysis } from "./InventoryOptimizationUtils";

export const InventoryOptimizationContent = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    category: "",
    unitCost: 0,
    annualDemand: 0,
    orderingCost: 0,
    holdingCost: 0,
    leadTime: 0,
    serviceLevel: 95,
  });
  const [eoqResults, setEoqResults] = useState<Record<string, EOQResult>>({});
  const [abcAnalysis, setAbcAnalysis] = useState<ABCAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [includeMPesaFees, setIncludeMPesaFees] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const item: InventoryItem = {
      id: crypto.randomUUID(),
      name: newItem.name || "",
      category: newItem.category || "",
      unitCost: newItem.unitCost || 0,
      annualDemand: newItem.annualDemand || 0,
      orderingCost: newItem.orderingCost || 0,
      holdingCost: newItem.holdingCost || 0,
      leadTime: newItem.leadTime || 0,
      serviceLevel: newItem.serviceLevel || 95
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      category: "",
      unitCost: 0,
      annualDemand: 0,
      orderingCost: 0,
      holdingCost: 0,
      leadTime: 0,
      serviceLevel: 95,
    });

    toast({
      title: "Item added",
      description: `${item.name} has been added to your inventory`
    });
  };

  const handleCalculateEOQ = () => {
    if (items.length === 0) {
      toast({
        title: "No items",
        description: "Please add inventory items first",
        variant: "destructive"
      });
      return;
    }

    const results: Record<string, EOQResult> = {};
    items.forEach(item => {
      // Add M-Pesa fees if enabled (1% of order value as additional ordering cost)
      const adjustedOrderingCost = includeMPesaFees 
        ? item.orderingCost + (0.01 * item.unitCost * Math.sqrt((2 * item.annualDemand * item.orderingCost) / (item.holdingCost * item.unitCost)))
        : item.orderingCost;

      results[item.id] = calculateEOQ({
        ...item,
        orderingCost: adjustedOrderingCost
      });
    });

    setEoqResults(results);
    setActiveTab("results");
    
    toast({
      title: "EOQ Calculation Complete",
      description: `Calculated EOQ for ${items.length} items`
    });
  };

  const handlePerformABCAnalysis = () => {
    if (items.length < 3) {
      toast({
        title: "Not enough items",
        description: "ABC analysis requires at least 3 items",
        variant: "destructive"
      });
      return;
    }

    const analysis = performABCAnalysis(items);
    setAbcAnalysis(analysis);
    setActiveTab("abc");

    toast({
      title: "ABC Analysis Complete",
      description: `Classified ${items.length} items into A, B, and C categories`
    });
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleImportFromCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split("\n");
          const headers = lines[0].split(",");
          
          const importedItems: InventoryItem[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(",");
            const item: any = {
              id: crypto.randomUUID()
            };
            
            headers.forEach((header, index) => {
              const trimmedHeader = header.trim().toLowerCase();
              const value = values[index]?.trim();
              
              if (trimmedHeader === 'name') item.name = value;
              else if (trimmedHeader === 'category') item.category = value;
              else if (trimmedHeader === 'unitcost' || trimmedHeader === 'unit cost') item.unitCost = parseFloat(value);
              else if (trimmedHeader === 'annualdemand' || trimmedHeader === 'annual demand') item.annualDemand = parseFloat(value);
              else if (trimmedHeader === 'orderingcost' || trimmedHeader === 'ordering cost') item.orderingCost = parseFloat(value);
              else if (trimmedHeader === 'holdingcost' || trimmedHeader === 'holding cost') item.holdingCost = parseFloat(value);
              else if (trimmedHeader === 'leadtime' || trimmedHeader === 'lead time') item.leadTime = parseFloat(value);
              else if (trimmedHeader === 'servicelevel' || trimmedHeader === 'service level') item.serviceLevel = parseFloat(value);
            });
            
            // Validate required fields
            if (item.name && item.category) {
              item.unitCost = item.unitCost || 0;
              item.annualDemand = item.annualDemand || 0;
              item.orderingCost = item.orderingCost || 0;
              item.holdingCost = item.holdingCost || 0;
              item.leadTime = item.leadTime || 0;
              item.serviceLevel = item.serviceLevel || 95;
              
              importedItems.push(item as InventoryItem);
            }
          }
          
          if (importedItems.length > 0) {
            setItems([...items, ...importedItems]);
            
            toast({
              title: "Import successful",
              description: `Imported ${importedItems.length} items`
            });
          } else {
            toast({
              title: "Import failed",
              description: "No valid data found in the CSV file",
              variant: "destructive"
            });
          }
        } catch (error) {
          toast({
            title: "Import failed",
            description: "Error processing the CSV file",
            variant: "destructive"
          });
          console.error("CSV import error:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const downloadSampleCsv = () => {
    const headers = "name,category,unitCost,annualDemand,orderingCost,holdingCost,leadTime,serviceLevel";
    const sampleData = [
      "Rice,Grains,100,2000,50,0.2,7,95",
      "Beans,Legumes,80,1500,50,0.15,5,95",
      "Sugar,Essentials,120,3000,50,0.2,10,98"
    ];
    const csvContent = [headers, ...sampleData].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_sample.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Inventory Optimization</h1>
          <p className="text-sm text-muted-foreground">
            Optimize inventory levels to reduce costs while meeting service levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadSampleCsv}>
            <Download className="h-4 w-4 mr-2" />
            Sample CSV
          </Button>
          <Button onClick={handleCalculateEOQ} disabled={items.length === 0}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate EOQ
          </Button>
          <Button onClick={handlePerformABCAnalysis} disabled={items.length < 3} variant="outline">
            <PieChart className="h-4 w-4 mr-2" />
            ABC Analysis
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="results">EOQ Results</TabsTrigger>
          <TabsTrigger value="abc">ABC Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="input" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 md:col-span-1">
              <h2 className="text-lg font-medium mb-4">Add Inventory Item</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., Rice, Sugar, Flour"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    placeholder="e.g., Grains, Produce, Dairy"
                  />
                </div>
                
                <div>
                  <Label htmlFor="unitCost">Unit Cost (KES)</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    value={newItem.unitCost || ""}
                    onChange={e => setNewItem({...newItem, unitCost: parseFloat(e.target.value) || 0})}
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="annualDemand">Annual Demand (Units)</Label>
                  <Input
                    id="annualDemand"
                    type="number"
                    value={newItem.annualDemand || ""}
                    onChange={e => setNewItem({...newItem, annualDemand: parseFloat(e.target.value) || 0})}
                    placeholder="1000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="orderingCost">Ordering Cost (KES)</Label>
                  <Input
                    id="orderingCost"
                    type="number"
                    value={newItem.orderingCost || ""}
                    onChange={e => setNewItem({...newItem, orderingCost: parseFloat(e.target.value) || 0})}
                    placeholder="50"
                  />
                </div>
                
                <div>
                  <Label htmlFor="holdingCost">Annual Holding Cost (as %)</Label>
                  <Input
                    id="holdingCost"
                    type="number"
                    value={newItem.holdingCost || ""}
                    onChange={e => setNewItem({...newItem, holdingCost: parseFloat(e.target.value) || 0})}
                    placeholder="0.25 (25%)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="leadTime">Lead Time (Days)</Label>
                  <Input
                    id="leadTime"
                    type="number"
                    value={newItem.leadTime || ""}
                    onChange={e => setNewItem({...newItem, leadTime: parseFloat(e.target.value) || 0})}
                    placeholder="7"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serviceLevel">Service Level (%)</Label>
                  <Input
                    id="serviceLevel"
                    type="number"
                    value={newItem.serviceLevel || ""}
                    onChange={e => setNewItem({...newItem, serviceLevel: parseFloat(e.target.value) || 0})}
                    placeholder="95"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch 
                    id="mpesa"
                    checked={includeMPesaFees}
                    onCheckedChange={setIncludeMPesaFees}
                  />
                  <Label htmlFor="mpesa">Include M-Pesa fees (1% of order value)</Label>
                </div>
                
                <Button onClick={handleAddItem} className="w-full">
                  <ShoppingBasket className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
                
                <div className="mt-4">
                  <Label htmlFor="importCsv">Or import from CSV</Label>
                  <Input
                    id="importCsv"
                    type="file"
                    accept=".csv"
                    onChange={handleImportFromCsv}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
            
            <Card className="p-4 md:col-span-2">
              <h2 className="text-lg font-medium mb-4">Inventory Items</h2>
              
              {items.length === 0 ? (
                <div className="text-center py-10">
                  <Boxes className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No inventory items added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add items manually or import from CSV
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="p-2 text-left font-medium text-muted-foreground">Name</th>
                          <th className="p-2 text-left font-medium text-muted-foreground">Category</th>
                          <th className="p-2 text-left font-medium text-muted-foreground">Unit Cost</th>
                          <th className="p-2 text-left font-medium text-muted-foreground">Annual Demand</th>
                          <th className="p-2 text-left font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{item.category}</td>
                            <td className="p-2">{item.unitCost} KES</td>
                            <td className="p-2">{item.annualDemand}</td>
                            <td className="p-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-0">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">EOQ Calculation Results</h2>
            
            {Object.keys(eoqResults).length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card className="p-4 bg-muted/50">
                    <h3 className="text-sm font-medium text-muted-foreground">Items Analyzed</h3>
                    <p className="text-2xl font-bold">{Object.keys(eoqResults).length}</p>
                  </Card>
                  
                  <Card className="p-4 bg-muted/50">
                    <h3 className="text-sm font-medium text-muted-foreground">M-Pesa Fees</h3>
                    <p className="text-2xl font-bold">{includeMPesaFees ? "Included" : "Excluded"}</p>
                  </Card>
                </div>
                
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left font-medium text-muted-foreground">Item</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">EOQ</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">Orders/Year</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">Cycle Time (days)</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">Reorder Point</th>
                        <th className="p-2 text-left font-medium text-muted-foreground">Annual Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => {
                        const result = eoqResults[item.id];
                        if (!result) return null;
                        return (
                          <tr key={item.id} className="border-b">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">{Math.round(result.economicOrderQuantity)} units</td>
                            <td className="p-2">{result.ordersPerYear.toFixed(2)}</td>
                            <td className="p-2">{result.cycleTime.toFixed(1)} days</td>
                            <td className="p-2">{Math.round(result.reorderPoint)} units</td>
                            <td className="p-2">{Math.round(result.totalAnnualCost).toLocaleString()} KES</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-600 dark:text-blue-400">Understanding EOQ Results</h3>
                      <ul className="mt-1 text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1">
                        <li><strong>EOQ:</strong> The optimal quantity to order each time to minimize costs</li>
                        <li><strong>Orders/Year:</strong> How many orders should be placed annually</li>
                        <li><strong>Cycle Time:</strong> Average days between orders</li>
                        <li><strong>Reorder Point:</strong> When to place a new order (based on lead time and safety stock)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <Calculator className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No EOQ calculations yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add inventory items and click "Calculate EOQ" 
                </p>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("input")}
                >
                  Go to Input Data
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="abc" className="mt-0">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">ABC Analysis Results</h2>
            
            {abcAnalysis ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400">Class A</h3>
                      <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{abcAnalysis.classA.length} Items</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classAValuePercentage)}% of Value
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classAItemPercentage)}% of Items
                    </p>
                  </Card>
                  
                  <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-green-600 dark:text-green-400">Class B</h3>
                      <BarChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{abcAnalysis.classB.length} Items</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classBValuePercentage)}% of Value
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classBItemPercentage)}% of Items
                    </p>
                  </Card>
                  
                  <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400">Class C</h3>
                      <BarChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{abcAnalysis.classC.length} Items</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classCValuePercentage)}% of Value
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(abcAnalysis.metrics.classCItemPercentage)}% of Items
                    </p>
                  </Card>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-600 dark:text-blue-400">ABC Analysis Recommendations</h3>
                      <ul className="mt-1 text-sm text-blue-600/80 dark:text-blue-400/80 space-y-1">
                        <li><strong>Class A Items:</strong> High value (70-80%), strict control, frequent review</li>
                        <li><strong>Class B Items:</strong> Medium value (15-20%), standard control, regular review</li>
                        <li><strong>Class C Items:</strong> Low value (5-10%), simplified control, occasional review</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">Class A Items (High Value)</h3>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left font-medium text-muted-foreground">Item</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Category</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Annual Value (KES)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abcAnalysis.classA.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">{item.category}</td>
                              <td className="p-2">{((item.unitCost || 0) * (item.annualDemand || 0)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Class B Items (Medium Value)</h3>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left font-medium text-muted-foreground">Item</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Category</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Annual Value (KES)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abcAnalysis.classB.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">{item.category}</td>
                              <td className="p-2">{((item.unitCost || 0) * (item.annualDemand || 0)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-2">Class C Items (Low Value)</h3>
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="p-2 text-left font-medium text-muted-foreground">Item</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Category</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">Annual Value (KES)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {abcAnalysis.classC.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.name}</td>
                              <td className="p-2">{item.category}</td>
                              <td className="p-2">{((item.unitCost || 0) * (item.annualDemand || 0)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <PieChart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No ABC analysis yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add at least 3 inventory items and click "ABC Analysis" 
                </p>
                
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("input")}
                >
                  Go to Input Data
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
