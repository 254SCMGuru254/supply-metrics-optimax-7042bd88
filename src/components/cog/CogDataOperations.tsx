
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Upload, Save } from "lucide-react";
import { Node } from "@/components/NetworkMap";

type CogDataOperationsProps = {
  nodes: Node[];
  onImport: (importedNodes: Node[]) => void;
  onAddWarehouse: () => void;
  optimized: boolean;
};

export const CogDataOperations = ({
  nodes,
  onImport,
  onAddWarehouse,
  optimized,
}: CogDataOperationsProps) => {
  const handleExport = () => {
    if (nodes.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Add demand points before exporting data.",
        variant: "destructive",
      });
      return;
    }

    const exportData = nodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      latitude: node.latitude,
      longitude: node.longitude,
      weight: node.weight || 1
    }));

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "cog_analysis_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    toast({
      title: "Export Complete",
      description: "The data has been exported successfully.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData) && importedData.length > 0) {
          // Validate the required fields
          const validData = importedData.filter(item => 
            typeof item.latitude === 'number' && 
            typeof item.longitude === 'number'
          ).map(item => ({
            id: item.id || crypto.randomUUID(),
            name: item.name || `Demand Point ${Math.floor(Math.random() * 1000)}`,
            type: item.type || "retail",
            latitude: item.latitude,
            longitude: item.longitude,
            weight: item.weight || 1
          }));

          if (validData.length > 0) {
            onImport(validData);
            toast({
              title: "Import Complete",
              description: `Successfully imported ${validData.length} demand points.`,
            });
          } else {
            throw new Error("No valid data points found.");
          }
        } else {
          throw new Error("Invalid data format. Expected array of locations.");
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: error instanceof Error ? error.message : "Failed to import data.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the file input value so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleExport} className="flex items-center gap-1">
        <Download className="h-4 w-4" />
        Export Data
      </Button>
      
      <div className="relative">
        <Button variant="outline" className="flex items-center gap-1">
          <Upload className="h-4 w-4" />
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onAddWarehouse} 
        disabled={optimized}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Add Existing Warehouse
      </Button>
    </div>
  );
};
