
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataImportExportProps {
  projectId?: string;
}

export const DataImportExport = ({ projectId }: DataImportExportProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'nodes' | 'routes' | 'inventory'>('nodes');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile || !projectId) {
      toast({
        title: "Error",
        description: "Please select a file and ensure you're in a project",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    try {
      const fileText = await importFile.text();
      let data: any[];

      // Parse file based on type
      if (importFile.name.endsWith('.csv')) {
        data = parseCSV(fileText);
      } else if (importFile.name.endsWith('.json')) {
        data = JSON.parse(fileText);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      // Call import function
      const { data: result, error } = await supabase.functions.invoke('data-import', {
        body: {
          projectId,
          fileName: importFile.name,
          fileType: importFile.name.endsWith('.csv') ? 'csv' : 'json',
          data,
          dataType: importType
        }
      });

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `Imported ${result.importedCount} records. ${result.errors?.length || 0} errors.`
      });

      if (result.errors && result.errors.length > 0) {
        console.warn('Import errors:', result.errors);
      }

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (exportType: 'nodes' | 'routes' | 'inventory' | 'all') => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project selected",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      let exportData: any = {};

      if (exportType === 'nodes' || exportType === 'all') {
        const { data: nodes } = await supabase
          .from('supply_nodes')
          .select('*')
          .eq('project_id', projectId);
        exportData.nodes = nodes;
      }

      if (exportType === 'routes' || exportType === 'all') {
        const { data: routes } = await supabase
          .from('supply_routes')
          .select('*')
          .eq('project_id', projectId);
        exportData.routes = routes;
      }

      if (exportType === 'inventory' || exportType === 'all') {
        const { data: inventory } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('project_id', projectId);
        exportData.inventory = inventory;
      }

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-${exportType}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Data exported successfully`
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Data Import
          </CardTitle>
          <CardDescription>
            Import data from CSV or JSON files. Supported formats include nodes, routes, and inventory data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="import-type">Data Type</Label>
              <Select value={importType} onValueChange={(value: any) => setImportType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nodes">Supply Nodes</SelectItem>
                  <SelectItem value="routes">Routes/Connections</SelectItem>
                  <SelectItem value="inventory">Inventory Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleImport} 
            disabled={!importFile || isImporting}
            className="w-full"
          >
            {isImporting ? 'Importing...' : 'Import Data'}
          </Button>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Import Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Nodes: name, latitude, longitude (required)</li>
                  <li>Routes: origin_id, destination_id (required)</li>
                  <li>Inventory: sku, unit_cost (required)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Export your project data in JSON format for backup or analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={() => handleExport('nodes')}
              disabled={isExporting}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Database className="h-6 w-6" />
              <span>Nodes</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('routes')}
              disabled={isExporting}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="h-6 w-6" />
              <span>Routes</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('inventory')}
              disabled={isExporting}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="h-6 w-6" />
              <span>Inventory</span>
            </Button>
            <Button
              onClick={() => handleExport('all')}
              disabled={isExporting}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Download className="h-6 w-6" />
              <span>All Data</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
