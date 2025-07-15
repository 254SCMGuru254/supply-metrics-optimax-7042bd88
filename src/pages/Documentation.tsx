import React, { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  Network, 
  TrendingUp, 
  Package, 
  Truck, 
  MapPin, 
  BarChart3, 
  Layers, 
  Settings, 
  Sliders as SlidersHorizontal,
  FileText,
  Code2 as Code,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-foreground flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          Documentation
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Comprehensive guides and API references to help you get started and master the Supply Metrics Optimax platform.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="getting-started" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network Optimization
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory Management
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Supply Metrics Optimax is a comprehensive supply chain optimization platform designed to help enterprises improve efficiency, reduce costs, and gain real-time insights. This documentation covers all modules including network design, route optimization, inventory management, and advanced analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="getting-started">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To get started, create a new project from the dashboard, input your supply chain data, and explore the optimization tools available. Use the navigation menu to access different modules and configure your settings.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Set up your facilities and demand points</li>
                <li>Configure transportation modes and costs</li>
                <li>Run optimization algorithms and analyze results</li>
                <li>Use the interactive maps for visualization and editing</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Network Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The network optimization module allows you to design and optimize your supply chain network. Define nodes, routes, and constraints to minimize costs and improve service levels.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Define warehouses, factories, and distribution centers</li>
                <li>Set transportation modes and capacities</li>
                <li>Run optimization algorithms such as VRP and TSP</li>
                <li>Visualize optimized routes on interactive maps</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Access real-time analytics and performance metrics to monitor your supply chain. Use dashboards to track cost savings, service levels, and operational efficiency.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>View cost breakdowns and savings trends</li>
                <li>Monitor active users and running optimizations</li>
                <li>Analyze inventory turnover and demand patterns</li>
                <li>Leverage AI-powered insights for decision making</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Manage your inventory levels effectively using ABC analysis and EOQ models. Optimize reorder points and safety stock to reduce carrying costs and stockouts.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Classify inventory items by importance and value</li>
                <li>Calculate optimal order quantities</li>
                <li>Set reorder points and safety stock levels</li>
                <li>Integrate with demand forecasting and supply planning</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">API Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Supply Metrics Optimax API provides programmatic access to all platform features. Authenticate using API keys and interact with endpoints for projects, nodes, routes, and analytics.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Authentication and authorization</li>
                <li>Project management endpoints</li>
                <li>Data input and retrieval</li>
                <li>Optimization and analytics triggers</li>
                <li>Webhooks and event subscriptions</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                For detailed API documentation, visit our <a href="https://api.supplymetricsoptimax.com/docs" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">API Docs <ExternalLink className="h-4 w-4" /></a>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
