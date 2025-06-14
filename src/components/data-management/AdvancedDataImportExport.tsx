
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, FileText, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

interface AdvancedDataImportExportProps {
  projectId?: string;
}

export const AdvancedDataImportExport = ({ projectId }: AdvancedDataImportExportProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'nodes' | 'routes' | 'inventory'>('nodes');
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
      validateFile(file);
    }
  };

  const validateFile = async (file: File) => {
    try {
      const fileText = await file.text();
      let data: any[];

      if (file.name.endsWith('.csv')) {
        data = parseCSV(fileText);
      } else if (file.name.endsWith('.json')) {
        data = JSON.parse(fileText);
      } else {
        throw new Error('Unsupported file format');
      }

      const validation = validateData(data, importType);
      setValidationResults(validation);
    } catch (error) {
      toast({
        title: "Validation Failed",
        description: "Could not validate file format",
        variant: "destructive"
      });
    }
  };

  const validateData = (data: any[], type: string) => {
    const requiredFields = {
      nodes: ['name', 'latitude', 'longitude'],
      routes: ['origin_id', 'destination_id'],
      inventory: ['sku', 'unit_cost']
    };

    const required = requiredFields[type as keyof typeof requiredFields];
    const errors: string[] = [];
    const warnings: string[] = [];

    data.forEach((row, index) => {
      required.forEach(field => {
        if (!row[field] || row[field] === '') {
          errors.push(`Row ${index + 1}: Missing ${field}`);
        }
      });

      // Type-specific validations
      if (type === 'nodes') {
        if (isNaN(parseFloat(row.latitude)) || isNaN(parseFloat(row.longitude))) {
          errors.push(`Row ${index + 1}: Invalid coordinates`);
        }
        if (Math.abs(parseFloat(row.latitude)) > 90 || Math.abs(parseFloat(row.longitude)) > 180) {
          warnings.push(`Row ${index + 1}: Coordinates outside valid range`);
        }
      }

      if (type === 'inventory') {
        if (isNaN(parseFloat(row.unit_cost)) || parseFloat(row.unit_cost) <= 0) {
          errors.push(`Row ${index + 1}: Invalid unit cost`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      totalRows: data.length,
      validRows: data.length - errors.length,
      errors,
      warnings
    };
  };

  const handleImport = async () => {
    if (!importFile || !projectId || !validationResults?.isValid) {
      toast({
        title: "Cannot Import",
        description: "File validation failed or missing requirements",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const fileText = await importFile.text();
      let data: any[];

      if (importFile.name.endsWith('.csv')) {
        data = parseCSV(fileText);
      } else {
        data = JSON.parse(fileText);
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: result, error } = await supabase.functions.invoke('data-import', {
        body: {
          projectId,
          fileName: importFile.name,
          fileType: importFile.name.endsWith('.csv') ? 'csv' : 'json',
          data,
          dataType: importType
        }
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `Imported ${result.importedCount} records successfully`
      });

      setImportFile(null);
      setValidationResults(null);

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
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

      // Enhanced export with metadata
      const enhancedExport = {
        metadata: {
          exportDate: new Date().toISOString(),
          projectId,
          exportType,
          version: '1.0'
        },
        data: exportData
      };

      const dataStr = JSON.stringify(enhancedExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `supply-chain-${exportType}-${new Date().toISOString().split('T')[0]}.json`;
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
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
      });
      return obj;
    });
  };

  const downloadTemplate = (type: string) => {
    const templates = {
      nodes: "name,latitude,longitude,node_type,capacity,demand\nNairobi DC,-1.2921,36.8219,distribution,1000,500\nMombasa Port,-4.0435,39.6682,port,2000,800",
      routes: "origin_id,destination_id,distance,cost_per_unit,transit_time\nnode_1,node_2,100,5.50,2.5\nnode_2,node_3,150,7.25,3.0",
      inventory: "sku,description,unit_cost,holding_cost_rate,ordering_cost,lead_time_days\nSKU001,Rice 50kg,2500,0.25,500,7\nSKU002,Beans 25kg,1200,0.20,300,5"
    };

    const template = templates[type as keyof typeof templates];
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Advanced Data Import
          </CardTitle>
          <CardDescription>
            Import data with validation, error checking, and progress tracking
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

          {validationResults && (
            <div className={`p-4 rounded-lg border ${validationResults.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validationResults.isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <h4 className="font-medium">
                  Validation {validationResults.isValid ? 'Passed' : 'Failed'}
                </h4>
              </div>
              <p className="text-sm mb-2">
                {validationResults.validRows} of {validationResults.totalRows} rows are valid
              </p>
              {validationResults.errors.length > 0 && (
                <div className="text-sm text-red-600">
                  <p className="font-medium">Errors:</p>
                  <ul className="list-disc list-inside">
                    {validationResults.errors.slice(0, 5).map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  {validationResults.errors.length > 5 && (
                    <p>... and {validationResults.errors.length - 5} more errors</p>
                  )}
                </div>
              )}
            </div>
          )}

          {isImporting && (
            <div className="space-y-2">
              <Label>Import Progress</Label>
              <Progress value={importProgress} />
              <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleImport} 
              disabled={!importFile || isImporting || !validationResults?.isValid}
              className="flex-1"
            >
              {isImporting ? 'Importing...' : 'Import Data'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => downloadTemplate(importType)}
            >
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Enhanced Data Export
          </CardTitle>
          <CardDescription>
            Export your project data with metadata and formatting options
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
              <span>Supply Nodes</span>
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
              <span>Complete Export</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
