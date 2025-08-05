import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Clock, Shield, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface BackupRecord {
  id: string;
  model_type: string;
  backup_type: string;
  created_at: string;
  file_size?: number;
  checksum?: string;
}

const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBackups();
    }
  }, [user]);

  const fetchBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('model_backups')
        .select('id, model_type, backup_type, created_at, file_size, checksum')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast({
        title: "Error",
        description: "Failed to load backup history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createManualBackup = async () => {
    try {
      // Get current model data and create backup
      const { error } = await supabase.rpc('create_daily_backup');
      
      if (error) throw error;
      
      toast({
        title: "Backup Created",
        description: "Manual backup has been created successfully",
      });
      
      fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive"
      });
    }
  };

  const restoreBackup = async (backupId: string) => {
    try {
      const { data, error } = await supabase.rpc('restore_model_backup', {
        backup_id: backupId
      });
      
      if (error) throw error;
      
      toast({
        title: "Backup Restored",
        description: "Model configuration has been restored from backup",
      });
      
      // Handle the restored data
      console.log('Restored backup data:', data);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        title: "Error",
        description: "Failed to restore from backup",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading backup history...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Backup & Version Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Daily Backups</h3>
              <p className="text-sm text-muted-foreground">
                All model configurations are automatically backed up daily at 2 AM
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Clock className="h-3 w-3 mr-1" />
              Active
            </Badge>
          </div>
          
          <Button onClick={createManualBackup} className="w-full">
            <Database className="h-4 w-4 mr-2" />
            Create Manual Backup
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No backups found. Create your first backup to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{backup.model_type}</h4>
                      <Badge 
                        variant={backup.backup_type === 'auto' ? 'default' : 'secondary'}
                      >
                        {backup.backup_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backup.created_at).toLocaleString()}
                    </p>
                    {backup.file_size && (
                      <p className="text-xs text-muted-foreground">
                        Size: {(backup.file_size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => restoreBackup(backup.id)}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        // Download backup data
                        toast({
                          title: "Download",
                          description: "Backup download will be implemented"
                        });
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupManager;