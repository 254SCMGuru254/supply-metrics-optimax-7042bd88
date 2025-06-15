
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModelDataUploaderProps {
  modelType: string;
  onDataUploaded: (data: any[]) => void;
}

export const ModelDataUploader = ({ modelType, onDataUploaded }: ModelDataUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFile(file);

    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith('.csv')) {
        // Parse CSV
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = values[index]?.trim();
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val));
      } else if (file.name.endsWith('.json')) {
        // Parse JSON
        data = JSON.parse(text);
      } else {
        throw new Error('Unsupported file format');
      }

      onDataUploaded(data);
      toast({
        title: "Data Uploaded Successfully",
        description: `${data.length} records loaded from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please check your file format and try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Data Upload for {modelType}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Upload Data File (CSV or JSON)</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            disabled={uploading}
            className="mt-2"
          />
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Processing file...</span>
          </div>
        )}

        {uploadedFile && !uploading && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>File uploaded: {uploadedFile.name}</span>
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-medium mb-2">Expected Data Format for {modelType}:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {modelType === 'Route Optimization' && (
              <>
                <li>• Customer locations (latitude, longitude, demand)</li>
                <li>• Depot/warehouse locations</li>
                <li>• Vehicle capacities and costs</li>
                <li>• Distance matrices or coordinates</li>
              </>
            )}
            {modelType === 'Inventory Management' && (
              <>
                <li>• SKU information (name, cost, demand rate)</li>
                <li>• Lead times and holding costs</li>
                <li>• Supplier information</li>
                <li>• Historical demand data</li>
              </>
            )}
            {modelType === 'Center of Gravity' && (
              <>
                <li>• Demand point locations (latitude, longitude)</li>
                <li>• Demand volumes or weights</li>
                <li>• Cost per unit distance</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
