import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Upload, Download, FileInput, Info, Plus, X, AlertCircle, Package } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Link, useParams } from "react-router-dom";

interface InventoryItem {
  id: string;
  name: string;
  unitCost: number;
  annualDemand: number;
  annualValue: number;
  cumulativePercentage: number;
  category: "A" | "B" | "C" | null;
}

interface ABCAnalysisProps {
  projectId: string;
}

export const ABCAnalysis = ({ projectId }: ABCAnalysisProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InventoryItem[]>([]);
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

  useEffect(() => {
    const fetchItems = async () => {
      if (!user || !projectId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('project_id', projectId);
        
        if (error) throw error;
        
        const formattedItems = data.map(item => ({
          id: item.id,
          name: item.name,
          unitCost: item.unit_cost || 0,
          annualDemand: item.annual_demand || 0,
          annualValue: (item.unit_cost || 0) * (item.annual_demand || 0),
          cumulativePercentage: 0,
          category: item.category || null
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user, projectId]);

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

  const addItem = async () => {
    if (!user || !newItem.name || !newItem.unitCost || !newItem.annualDemand) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields for the new item.",
        variant: "destructive"
      });
      return;
    }

    const newItemData = {
      user_id: user.id,
      project_id: projectId,
      name: newItem.name,
      unit_cost: newItem.unitCost,
      annual_demand: newItem.annualDemand,
    };

    const { data, error } = await supabase
      .from('inventory_items')
      .insert([newItemData])
      .select();

    if (error) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive"
      });
    } else if (data) {
      const addedItem = data[0];
      const newFormattedItem: InventoryItem = {
        id: addedItem.id,
        name: addedItem.name,
        unitCost: addedItem.unit_cost || 0,
        annualDemand: addedItem.annual_demand || 0,
        annualValue: (addedItem.unit_cost || 0) * (addedItem.annual_demand || 0),
        cumulativePercentage: 0,
        category: null
      };
      setItems([...items, newFormattedItem]);
      setNewItem({ name: "", unitCost: 0, annualDemand: 0 });
      toast({
        title: "Item Added",
        description: `${addedItem.name} has been added to the analysis.`
      });
    }
  };

  const removeItem = async (id: string) => {
    // Optimistic UI update
    const originalItems = items;
    setItems(items.filter(item => item.id !== id));

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (error) {
      // Revert if there's an error
      setItems(originalItems);
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Item Removed",
        description: "The item has been successfully removed."
      });
    }
  };

  const performABCAnalysis = async () => {
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
      if (totalValue === 0) {
        toast({
          title: "Analysis Warning",
          description: "Total annual value is zero. Cannot perform analysis.",
          variant: "default"
        });
        return;
      }
      
      // Calculate cumulative percentages and assign categories
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
      
      // Update local state immediately for responsive UI
      setItems(itemsWithCumulative);
      
      // Save categories to database
      const updates = itemsWithCumulative.map(item => ({
        id: item.id,
        category: item.category,
        user_id: user?.id,
        project_id: projectId,
      }));

      const { error: updateError } = await supabase
        .from('inventory_items')
        .upsert(updates, { onConflict: 'id' });

      if (updateError) {
        // Handle error, maybe revert UI changes or notify user
        throw updateError;
      }

      // Count items and value by category for summary
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
      
      const classAPercent = (categoryStats.A.value / totalValue) * 100;
      const classBPercent = (categoryStats.B.value / totalValue) * 100;
      const classCPercent = (categoryStats.C.value / totalValue) * 100;
            
      setAnalysisResults({
        classA: { itemCount: categoryStats.A.count, valuePercent: roundToTwo(classAPercent) },
        classB: { itemCount: categoryStats.B.count, valuePercent: roundToTwo(classBPercent) },
        classC: { itemCount: categoryStats.C.count, valuePercent: roundToTwo(classCPercent) },
        totalValue: roundToTwo(totalValue)
      });

      toast({
        title: "Analysis Complete",
        description: "ABC analysis has been successfully performed and results are saved."
      });
    } catch(error: any) {
      console.error("ABC analysis error:", error);
      toast({
        title: "Analysis Error",
        description: error.message || "An error occurred during the analysis.",
        variant: "destructive"
      });
    }
  };

  const roundToTwo = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return 0;
    return Math.round(num * 100) / 100;
  };
  
  const exportCSV = () => {
    const analysisData = items.map(item => ({
      ID: item.id,
      Name: item.name,
      'Unit Cost': item.unitCost,
      'Annual Demand': item.annualDemand,
      'Annual Value': item.annualValue,
      'Cumulative %': roundToTwo(item.cumulativePercentage),
      Category: item.category,
    }));
    
    const header = Object.keys(analysisData[0]);
    const rows = analysisData.map(obj => header.map(key => obj[key as keyof typeof obj]));
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + header.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "abc-analysis.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return <div className="text-center p-6">Loading inventory data...</div>;
  }

  if (items.length === 0 && !loading) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Inventory Items</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding inventory items for your project.</p>
        <div className="mt-6">
          <Link to={`/data-input/${projectId}`}>
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Inventory Data
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">ABC Analysis</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Categorize inventory items based on their importance to the business. Class A items are the most valuable, while Class C items are the least valuable.
        </p>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Item Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Item</h3>
            <div className="space-y-2">
              <Label htmlFor="newItemName">Item Name</Label>
              <Input 
                id="newItemName"
                value={newItem.name || ""}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newItemUnitCost">Unit Cost</Label>
                <Input 
                  id="newItemUnitCost"
                  type="number"
                  value={newItem.unitCost || ""}
                  onChange={(e) => handleInputChange('unitCost', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newItemAnnualDemand">Annual Demand</Label>
                <Input 
                  id="newItemAnnualDemand"
                  type="number"
                  value={newItem.annualDemand || ""}
                  onChange={(e) => handleInputChange('annualDemand', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={addItem}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </div>
          
          {/* Analysis Controls & Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Analysis & Actions</h3>
            <div className="flex gap-2">
              <Button onClick={performABCAnalysis}>Perform Analysis</Button>
              <Button variant="outline" onClick={exportCSV} disabled={items.every(item => !item.category)}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
            </div>
            {analysisResults && (
              <Card className="p-4 bg-muted">
                <h4 className="font-semibold mb-2">Analysis Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><b>Total Value:</b> ${analysisResults.totalValue.toLocaleString()}</p>
                  <p><b>Class A:</b> {analysisResults.classA.itemCount} items ({analysisResults.classA.valuePercent}%)</p>
                  <p><b>Class B:</b> {analysisResults.classB.itemCount} items ({analysisResults.classB.valuePercent}%)</p>
                  <p><b>Class C:</b> {analysisResults.classC.itemCount} items ({analysisResults.classC.valuePercent}%)</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Inventory Item List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Annual Demand</TableHead>
                  <TableHead>Annual Value</TableHead>
                  <TableHead>Cumulative %</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.unitCost.toLocaleString()}</TableCell>
                    <TableCell>{item.annualDemand.toLocaleString()}</TableCell>
                    <TableCell>${item.annualValue.toLocaleString()}</TableCell>
                    <TableCell>{item.category ? `${roundToTwo(item.cumulativePercentage)}%` : 'N/A'}</TableCell>
                    <TableCell>
                      {item.category && (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.category === 'A' ? 'bg-red-200 text-red-800' :
                          item.category === 'B' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          Class {item.category}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <X className="h-4 w-4" />
                      </Button>
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
