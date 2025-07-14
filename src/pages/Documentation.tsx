
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  SlidersHorizontal, 
  Download,
  ExternalLink,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';
import { AppDocumentation } from '@/components/documentation/AppDocumentation';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const quickStartGuides = [
    {
      title: "Getting Started with Supply Chain Optimization",
      description: "Learn the fundamentals of supply chain modeling and optimization",
      time: "10 min read",
      category: "Beginner"
    },
    {
      title: "Center of Gravity Analysis",
      description: "Master facility location optimization using mathematical models",
      time: "15 min read",
      category: "Intermediate"
    },
    {
      title: "Route Optimization Techniques",
      description: "Advanced algorithms for vehicle routing and delivery optimization",
      time: "20 min read",
      category: "Advanced"
    }
  ];

  const apiDocumentation = [
    {
      title: "Authentication API",
      endpoint: "POST /api/auth/login",
      description: "Secure user authentication and session management"
    },
    {
      title: "Optimization Engine API",
      endpoint: "POST /api/optimize/network",
      description: "Run network optimization algorithms with custom parameters"
    },
    {
      title: "Data Export API",
      endpoint: "GET /api/export/results",
      description: "Export optimization results in various formats"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documentation Center
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive guides, API references, and tutorials for Supply Metrics Optimax
          </p>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guides">Quick Start</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="formulas">Formula Library</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickStartGuides.map((guide, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{guide.category}</Badge>
                      <span className="text-sm text-gray-500">{guide.time}</span>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <Button className="w-full">
                      Start Reading
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {apiDocumentation.map((api, index) => (
                <Card key={index} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {api.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Badge variant="outline" className="font-mono">
                          {api.endpoint}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{api.description}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Try It Out
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-6">
            <AppDocumentation />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>System Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Learn how to integrate Supply Metrics Optimax with your existing systems:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">ERP Integration</h4>
                      <p className="text-sm text-gray-600">Connect with SAP, Oracle, and other ERP systems</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">WMS Integration</h4>
                      <p className="text-sm text-gray-600">Warehouse Management System connectivity</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">TMS Integration</h4>
                      <p className="text-sm text-gray-600">Transportation Management System integration</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">API Integration</h4>
                      <p className="text-sm text-gray-600">RESTful API for custom integrations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documentation;
