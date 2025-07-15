import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Search, 
  FileText, 
  Calculator, 
  BarChart3, 
  Network, 
  MapPin, 
  Package, 
  Truck, 
  Sliders, 
  ExternalLink, 
  Download, 
  Zap 
} from 'lucide-react';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    alert(`Searching for: ${searchTerm}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Supply Chain Optimization Documentation
        </h1>
        <p className="text-gray-600">
          Comprehensive guides, tutorials, and API references for all optimization models
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search documentation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="getting-started" className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="getting-started" className="text-sm">
            Getting Started
          </TabsTrigger>
          <TabsTrigger value="models" className="text-sm">
            Optimization Models
          </TabsTrigger>
          <TabsTrigger value="api" className="text-sm">
            API Reference
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="text-sm">
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-sm">
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Introduction to Supply Chain Optimization
              </CardTitle>
              <CardDescription>
                Learn the basics of supply chain optimization and how to use this platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Supply chain optimization is the process of improving the efficiency and effectiveness of a supply chain by reducing costs, improving service levels, and minimizing risks.
              </p>
              <ul className="list-disc pl-5">
                <li><strong>Network Design:</strong> Optimize the location and capacity of facilities.</li>
                <li><strong>Inventory Management:</strong> Determine optimal inventory levels.</li>
                <li><strong>Route Optimization:</strong> Plan the most efficient delivery routes.</li>
                <li><strong>Demand Forecasting:</strong> Predict future demand to minimize stockouts.</li>
              </ul>
              <Button variant="secondary">
                <FileText className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Optimize your supply chain network by determining the best locations for facilities and the optimal flow of goods.
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>Center of Gravity:</strong> Find the optimal location for a new facility.</li>
                  <li><strong>MILP Optimization:</strong> Use mixed-integer linear programming for complex problems.</li>
                </ul>
                <Button variant="secondary">
                  <FileText className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Manage your inventory levels to minimize costs and meet customer demand.
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>Economic Order Quantity (EOQ):</strong> Calculate the optimal order quantity.</li>
                  <li><strong>ABC Analysis:</strong> Classify inventory items based on their value.</li>
                </ul>
                <Button variant="secondary">
                  <FileText className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Route Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Plan the most efficient delivery routes to reduce transportation costs and improve service levels.
                </p>
                <ul className="list-disc pl-5">
                  <li><strong>Traveling Salesman Problem (TSP):</strong> Find the shortest route for a single vehicle.</li>
                  <li><strong>Vehicle Routing Problem (VRP):</strong> Optimize routes for multiple vehicles.</li>
                </ul>
                <Button variant="secondary">
                  <FileText className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Reference Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Detailed documentation for all API endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our API allows you to programmatically access and control various aspects of the supply chain optimization platform.
              </p>
              <ul className="list-disc pl-5">
                <li><strong>/network-design:</strong> Create and optimize supply chain networks.</li>
                <li><strong>/inventory-management:</strong> Manage inventory levels and calculate optimal order quantities.</li>
                <li><strong>/route-optimization:</strong> Plan efficient delivery routes.</li>
              </ul>
              <Button variant="secondary">
                <ExternalLink className="h-4 w-4 mr-2" />
                View API Reference
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText className="h-4 w-4 mr-2" />
                  Getting Started with Network Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  A step-by-step guide to designing and optimizing your supply chain network using our platform.
                </p>
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tutorial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText className="h-4 w-4 mr-2" />
                  Inventory Optimization Tutorial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Learn how to optimize your inventory levels to minimize costs and meet customer demand.
                </p>
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Tutorial
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  What is supply chain optimization?
                </h3>
                <p>
                  Supply chain optimization is the process of improving the efficiency and effectiveness of a supply chain by reducing costs, improving service levels, and minimizing risks.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  How do I get started with this platform?
                </h3>
                <p>
                  Start by exploring the "Getting Started" section and then dive into the specific optimization models that interest you.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
