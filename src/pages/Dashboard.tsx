
import React from 'react';
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
  Zap,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const optimizationModels = [
    {
      name: 'Route Optimization',
      icon: <MapPin className="h-6 w-6" />,
      href: '/route-optimization',
      description: 'Optimize delivery routes and reduce transportation costs',
      savings: '15-25%',
      status: 'Active',
      usage: 85,
      color: 'bg-blue-500'
    },
    {
      name: 'Inventory Management',
      icon: <Package className="h-6 w-6" />,
      href: '/inventory-management',
      description: 'Multi-echelon inventory optimization with EOQ and safety stock',
      savings: '20-30%',
      status: 'Active',
      usage: 92,
      color: 'bg-green-500'
    },
    {
      name: 'Center of Gravity',
      icon: <TrendingUp className="h-6 w-6" />,
      href: '/center-of-gravity',
      description: 'Find optimal facility locations based on demand weights',
      savings: '18-22%',
      status: 'Active',
      usage: 78,
      color: 'bg-purple-500'
    },
    {
      name: 'Network Optimization',
      icon: <Network className="h-6 w-6" />,
      href: '/network-optimization',
      description: 'Optimize entire supply chain network topology',
      savings: '25-35%',
      status: 'Active',
      usage: 88,
      color: 'bg-orange-500'
    },
    {
      name: 'Network Flow',
      icon: <Zap className="h-6 w-6" />,
      href: '/network-flow',
      description: 'Minimum cost flow optimization for material movement',
      savings: '12-18%',
      status: 'Active',
      usage: 65,
      color: 'bg-cyan-500'
    },
    {
      name: 'Monte Carlo Simulation',
      icon: <Calculator className="h-6 w-6" />,
      href: '/simulation',
      description: 'Stochastic simulation for uncertainty analysis',
      savings: '20-25%',
      status: 'Active',
      usage: 75,
      color: 'bg-pink-500'
    }
  ];

  const recentAnalytics = [
    { metric: 'Total Cost Reduction', value: '24%', trend: 'up' },
    { metric: 'Service Level', value: '96.8%', trend: 'up' },
    { metric: 'Inventory Turnover', value: '8.2x', trend: 'up' },
    { metric: 'Transport Efficiency', value: '89%', trend: 'stable' }
  ];

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
          <h2 className="text-2xl font-bold mb-6 text-center">Elite Optimization Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizationModels.map((model, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${model.color} text-white`}>
                      {model.icon}
                    </div>
                    <Badge variant={model.status === 'Active' ? 'default' : 'secondary'}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{model.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cost Savings</span>
                      <span className="text-sm font-bold text-green-600">{model.savings}</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Usage Rate</span>
                        <span className="text-sm">{model.usage}%</span>
                      </div>
                      <Progress value={model.usage} className="h-2" />
                    </div>
                  </div>

                  <Link to={model.href}>
                    <Button className="w-full mt-4 group">
                      Launch Model
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
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
