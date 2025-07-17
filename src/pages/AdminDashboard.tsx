
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminTodoTracker from '@/components/admin/AdminTodoTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Database, Users, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const systemStatus = {
    database: 'warning',
    authentication: 'operational',
    features: 'degraded',
    security: 'needs-attention'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          System monitoring and issue tracking for Supply Metrics Optimax
        </p>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={systemStatus.database === 'warning' ? 'destructive' : 'default'}>
              {systemStatus.database}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Missing RLS policies causing blank pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="default">
              {systemStatus.authentication}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Auth system working correctly
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="destructive">
              {systemStatus.features}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Multiple pages showing blank content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">
              {systemStatus.security}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Admin role system needs setup
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" />
            Critical Issues Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>• Analytics and Route Optimization pages are blank due to missing data tables and RLS policies</p>
            <p>• Multiple TypeScript compilation errors preventing proper app functionality</p>
            <p>• No admin role management system implemented</p>
            <p>• Missing database tables for core features like chat, simulation, and analytics</p>
          </div>
        </CardContent>
      </Card>

      {/* TODO Tracker */}
      <AdminTodoTracker />
    </div>
  );
};

export default AdminDashboard;
