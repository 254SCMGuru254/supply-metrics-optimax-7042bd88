import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Package, 
  TrendingUp, 
  Network, 
  Calculator, 
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Tables } from '@/types/database';

type ProjectModel = Tables<'projects'>;

const modelMeta: { [key: string]: { icon: React.ReactNode; color: string; href: string } } = {
  'Route Optimization': { icon: <MapPin className="h-6 w-6" />, color: 'bg-blue-500', href: '/route-optimization' },
  'Inventory Management': { icon: <Package className="h-6 w-6" />, color: 'bg-green-500', href: '/inventory-management' },
  'Center of Gravity': { icon: <TrendingUp className="h-6 w-6" />, color: 'bg-purple-500', href: '/center-of-gravity' },
  'Network Optimization': { icon: <Network className="h-6 w-6" />, color: 'bg-orange-500', href: '/network-optimization' },
  'Network Flow': { icon: <Activity className="h-6 w-6" />, color: 'bg-cyan-500', href: '/network-flow' },
  'Simulation': { icon: <Calculator className="h-6 w-6" />, color: 'bg-pink-500', href: '/simulation' },
  'Default': { icon: <Calculator className="h-6 w-6" />, color: 'bg-gray-500', href: '/dashboard' },
};

const Dashboard = () => {
  const [projects, setProjects] = useState<ProjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  const recentAnalytics = [
    { metric: 'Total Cost Reduction', value: '24%', trend: 'up' },
    { metric: 'Service Level', value: '96.8%', trend: 'up' },
    { metric: 'Inventory Turnover', value: '8.2x', trend: 'up' },
    { metric: 'Transport Efficiency', value: '89%', trend: 'stable' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Loading Projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Supply Chain Command Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elite-grade optimization platform with advanced mathematical models, AI integration, and real-time analytics
          </p>
        </div>

        {/* Quick Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {recentAnalytics.map((analytic, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{analytic.value}</div>
                <div className="text-sm text-gray-600">{analytic.metric}</div>
                <div className="flex items-center justify-center mt-2">
                  {analytic.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                  {analytic.trend === 'stable' && <Activity className="h-4 w-4 text-blue-500" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Link to="/analytics-dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Activity className="h-4 w-4 mr-2" />
              View Analytics Dashboard
            </Button>
          </Link>
          <Link to="/kenya-supply-chain">
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Kenya Supply Chain
            </Button>
          </Link>
          <Link to="/business-value">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Business Value Calculator
            </Button>
          </Link>
        </div>

        {/* Optimization Models Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Your Optimization Projects</h2>
          
          {projects.length === 0 ? (
            <Card className="text-center p-8">
              <CardHeader>
                <CardTitle>No projects yet!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Get started by creating your first optimization project.</p>
                <Link to="/data-input">
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const meta = modelMeta[project.project_type || 'Default'] || modelMeta['Default'];
                return (
                  <Card key={project.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg ${meta.color} text-white`}>
                          {meta.icon}
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status || 'inactive'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 h-10">{project.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Last Updated</span>
                          <span className="text-sm font-bold text-gray-600">
                            {new Date(project.updated_at || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Link to={`${meta.href}/${project.id}`}>
                        <Button className="w-full mt-4 group">
                          Open Project
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                AI-Powered Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Machine Learning Demand Forecasting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time Performance Monitoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Predictive Risk Assessment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Automated Report Generation</span>
                </div>
              </div>
              <Link to="/analytics-dashboard">
                <Button className="w-full">
                  Access AI Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-600" />
                Advanced Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Multi-Echelon Network Optimization</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Stochastic Simulation Models</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Kenya-Specific Industry Solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Enterprise-Grade Security</span>
                </div>
              </div>
              <Link to="/documentation">
                <Button variant="outline" className="w-full">
                  View Documentation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
