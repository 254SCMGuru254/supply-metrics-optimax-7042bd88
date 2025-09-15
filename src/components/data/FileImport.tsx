
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileImportProps {
  projectId: string;
}

export const FileImport: React.FC<FileImportProps> = ({ projectId }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('data-imports')
        .upload(fileName, file);

      if (error) throw error;

      // Record import in database
      const { error: dbError } = await supabase
        .from('data_imports')
        .insert({
          project_id: projectId,
          user_id: user.id,
          file_name: file.name,
          file_type: file.name.split('.').pop(),
          file_size_bytes: file.size,
          status: 'uploaded'
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: "Your data is being processed and will be available shortly."
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  }, [projectId, toast]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data from File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">Upload your data file</p>
            <p className="text-gray-600 mb-4">Support for CSV and Excel files</p>
            
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            
            <label htmlFor="file-upload">
              <Button disabled={uploading} asChild>
                <span className="cursor-pointer">
                  {uploading ? "Uploading..." : "Choose File"}
                </span>
              </Button>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">CSV Format</h3>
                    <p className="text-sm text-gray-600">Comma-separated values</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Excel Format</h3>
                    <p className="text-sm text-gray-600">.xlsx and .xls files</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
