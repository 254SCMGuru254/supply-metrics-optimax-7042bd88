
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Clock, Database, Globe, Shield } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  category: 'database' | 'ui' | 'security' | 'features' | 'integration';
  status: 'pending' | 'in-progress' | 'completed' | 'critical';
  description: string;
  priority: 'high' | 'medium' | 'low';
  cycle: number;
}

const AdminTodoTracker = () => {
  const [todos] = useState<TodoItem[]>([
    // Database Issues (Cycle 1)
    { id: '1-1', title: 'Create missing RLS policies for analytics data', category: 'database', status: 'critical', description: 'Analytics pages are blank due to missing RLS policies', priority: 'high', cycle: 1 },
    { id: '1-2', title: 'Setup user roles table with proper admin assignment', category: 'security', status: 'critical', description: 'No admin role management system exists', priority: 'high', cycle: 1 },
    { id: '1-3', title: 'Create analytics_data table with proper structure', category: 'database', status: 'critical', description: 'Analytics dashboard has no data source', priority: 'high', cycle: 1 },
    { id: '1-4', title: 'Setup route_optimization_results table', category: 'database', status: 'critical', description: 'Route optimization page cannot store results', priority: 'high', cycle: 1 },
    { id: '1-5', title: 'Create chat_conversations table for AI assistant', category: 'database', status: 'pending', description: 'Chat assistant needs conversation storage', priority: 'medium', cycle: 1 },
    { id: '1-6', title: 'Fix Recharts PieChart data prop issues', category: 'ui', status: 'critical', description: 'Multiple chart components have TypeScript errors', priority: 'high', cycle: 1 },
    { id: '1-7', title: 'Create simulation_templates table', category: 'database', status: 'pending', description: 'Simulation page needs predefined templates', priority: 'medium', cycle: 1 },
    { id: '1-8', title: 'Setup documentation_articles table', category: 'database', status: 'pending', description: 'Documentation page needs content management', priority: 'low', cycle: 1 },
    { id: '1-9', title: 'Create support_tickets table', category: 'database', status: 'pending', description: 'Support page needs ticket management', priority: 'medium', cycle: 1 },
    { id: '1-10', title: 'Fix Lucide React icon import errors', category: 'ui', status: 'completed', description: 'Multiple files have incorrect icon imports', priority: 'high', cycle: 1 },

    // UI/Feature Issues (Cycle 2)
    { id: '2-1', title: 'Implement actual analytics dashboard content', category: 'features', status: 'critical', description: 'Analytics page shows blank content', priority: 'high', cycle: 2 },
    { id: '2-2', title: 'Build functional route optimization interface', category: 'features', status: 'critical', description: 'Route optimization page is blank', priority: 'high', cycle: 2 },
    { id: '2-3', title: 'Create interactive simulation engine', category: 'features', status: 'pending', description: 'Simulation page needs working simulation tools', priority: 'high', cycle: 2 },
    { id: '2-4', title: 'Implement AI chat functionality', category: 'features', status: 'pending', description: 'Chat assistant needs actual AI integration', priority: 'medium', cycle: 2 },
    { id: '2-5', title: 'Add map integration to route optimization', category: 'features', status: 'pending', description: 'Route optimization needs map visualization', priority: 'high', cycle: 2 },
    { id: '2-6', title: 'Create inventory management dashboard', category: 'features', status: 'pending', description: 'Inventory page needs comprehensive interface', priority: 'medium', cycle: 2 },
    { id: '2-7', title: 'Build network optimization visualizations', category: 'features', status: 'pending', description: 'Network optimization needs visual tools', priority: 'medium', cycle: 2 },
    { id: '2-8', title: 'Implement formula calculation engines', category: 'features', status: 'pending', description: 'Mathematical models need working calculators', priority: 'high', cycle: 2 },
    { id: '2-9', title: 'Add data export functionality', category: 'features', status: 'pending', description: 'Users need to export optimization results', priority: 'medium', cycle: 2 },
    { id: '2-10', title: 'Create responsive design for all pages', category: 'ui', status: 'pending', description: 'Pages need mobile optimization', priority: 'medium', cycle: 2 }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'integration': return <Globe className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    const key = `cycle-${todo.cycle}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(todo);
    return acc;
  }, {} as Record<string, TodoItem[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin TODO Tracker</h1>
        <p className="text-muted-foreground">
          Comprehensive tracking of missing features, database issues, and system improvements
        </p>
      </div>

      <Tabs defaultValue="cycle-1" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cycle-1">Cycle 1 (Critical)</TabsTrigger>
          <TabsTrigger value="cycle-2">Cycle 2 (Features)</TabsTrigger>
        </TabsList>

        {Object.entries(groupedTodos).map(([cycle, items]) => (
          <TabsContent key={cycle} value={cycle} className="space-y-4">
            <div className="grid gap-4">
              {items.map((todo) => (
                <Card key={todo.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {getStatusIcon(todo.status)}
                        {getCategoryIcon(todo.category)}
                        {todo.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant={todo.priority === 'high' ? 'destructive' : todo.priority === 'medium' ? 'default' : 'secondary'}>
                          {todo.priority}
                        </Badge>
                        <Badge variant={todo.status === 'critical' ? 'destructive' : 'outline'}>
                          {todo.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{todo.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Category: {todo.category}</span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {todos.filter(t => t.status === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {todos.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {todos.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round((todos.filter(t => t.status === 'completed').length / todos.length) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTodoTracker;
