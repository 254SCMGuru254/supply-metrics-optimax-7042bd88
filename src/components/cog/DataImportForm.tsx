
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Download, Plus, Trash2 } from "lucide-react";
import type { Node } from "@/components/NetworkMap";

interface DataImportFormProps {
  onImport: (nodes: Node[]) => void;
}

export const DataImportForm = ({ onImport }: DataImportFormProps) => {
  const [csvData, setCsvData] = useState("");
  const [manualEntries, setManualEntries] = useState([
    { name: "", latitude: "", longitude: "", weight: "" }
  ]);
  const { toast } = useToast();

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
        parseCSVData(text);
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const parseCSVData = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      // Expected headers: name, latitude, longitude, weight (or demand)
      const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('location'));
      const latIndex = headers.findIndex(h => h.includes('lat'));
      const lngIndex = headers.findIndex(h => h.includes('lng') || h.includes('lon'));
      const weightIndex = headers.findIndex(h => h.includes('weight') || h.includes('demand') || h.includes('volume'));

      if (nameIndex === -1 || latIndex === -1 || lngIndex === -1) {
        throw new Error("CSV must contain name, latitude, and longitude columns");
      }

      const nodes: Node[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length >= 3) {
          const node: Node = {
            id: crypto.randomUUID(),
            type: "customer",
            name: values[nameIndex] || `Location ${i}`,
            latitude: parseFloat(values[latIndex]),
            longitude: parseFloat(values[lngIndex]),
            weight: weightIndex !== -1 ? parseFloat(values[weightIndex]) || 10 : 10,
            ownership: 'owned'
          };
          
          if (!isNaN(node.latitude) && !isNaN(node.longitude)) {
            nodes.push(node);
          }
        }
      }

      if (nodes.length > 0) {
        onImport(nodes);
        toast({
          title: "Import Successful",
          description: `Imported ${nodes.length} locations from CSV.`,
        });
      } else {
        throw new Error("No valid data found in CSV");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV data.",
        variant: "destructive",
      });
    }
  };

  const addManualEntry = () => {
    setManualEntries([...manualEntries, { name: "", latitude: "", longitude: "", weight: "" }]);
  };

  const removeManualEntry = (index: number) => {
    setManualEntries(manualEntries.filter((_, i) => i !== index));
  };

  const updateManualEntry = (index: number, field: string, value: string) => {
    const updated = manualEntries.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    );
    setManualEntries(updated);
  };

  const handleManualImport = () => {
    try {
      const nodes: Node[] = manualEntries
        .filter(entry => entry.name && entry.latitude && entry.longitude)
        .map((entry, index) => ({
          id: crypto.randomUUID(),
          type: "customer" as const,
          name: entry.name,
          latitude: parseFloat(entry.latitude),
          longitude: parseFloat(entry.longitude),
          weight: parseFloat(entry.weight) || 10,
          ownership: 'owned' as const,
        }))
        .filter(node => !isNaN(node.latitude) && !isNaN(node.longitude));

      if (nodes.length > 0) {
        onImport(nodes);
        toast({
          title: "Import Successful",
          description: `Imported ${nodes.length} manually entered locations.`,
        });
        // Reset form
        setManualEntries([{ name: "", latitude: "", longitude: "", weight: "" }]);
      } else {
        throw new Error("No valid entries found");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Please check your entries and try again.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = "name,latitude,longitude,weight\nCustomer A,40.7128,-74.0060,50\nCustomer B,34.0522,-118.2437,75\nCustomer C,41.8781,-87.6298,30";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cog_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Data Import
        </CardTitle>
        <CardDescription>
          Import demand points from CSV file or enter manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="csv">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="csv-file">Upload CSV File</Label>
                  <p className="text-sm text-muted-foreground">
                    File should contain: name, latitude, longitude, weight
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Template
                </Button>
              </div>
              
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
              />
              
              {csvData && (
                <div className="mt-4">
                  <Label>CSV Preview</Label>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono max-h-32 overflow-y-auto">
                    {csvData.split('\n').slice(0, 5).map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                    {csvData.split('\n').length > 5 && <div>...</div>}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Manual Data Entry</Label>
                <Button variant="outline" size="sm" onClick={addManualEntry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {manualEntries.map((entry, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-3">
                      <Label htmlFor={`name-${index}`} className="text-xs">Name</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder="Location name"
                        value={entry.name}
                        onChange={(e) => updateManualEntry(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`lat-${index}`} className="text-xs">Latitude</Label>
                      <Input
                        id={`lat-${index}`}
                        type="number"
                        step="0.0001"
                        placeholder="Latitude"
                        value={entry.latitude}
                        onChange={(e) => updateManualEntry(index, 'latitude', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`lng-${index}`} className="text-xs">Longitude</Label>
                      <Input
                        id={`lng-${index}`}
                        type="number"
                        step="0.0001"
                        placeholder="Longitude"
                        value={entry.longitude}
                        onChange={(e) => updateManualEntry(index, 'longitude', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`weight-${index}`} className="text-xs">Weight</Label>
                      <Input
                        id={`weight-${index}`}
                        type="number"
                        placeholder="Weight"
                        value={entry.weight}
                        onChange={(e) => updateManualEntry(index, 'weight', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeManualEntry(index)}
                        disabled={manualEntries.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button onClick={handleManualImport} className="w-full">
                Import Manual Data
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
