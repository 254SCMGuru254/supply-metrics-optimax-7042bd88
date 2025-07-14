
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download,
  ExternalLink,
  FileText,
  Zap,
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
                <Filter className="h-4 w-4 mr-2" />
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
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{guide.category}</Badge>
                      <span className="text-sm text-gray-500">{guide.time}</span>
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <Button className="w-full">
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  API Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiDocumentation.map((api, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{api.title}</h3>
                        <Badge variant="outline">{api.endpoint.split(' ')[0]}</Badge>
                      </div>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {api.endpoint}
                      </code>
                      <p className="text-gray-600 mt-2">{api.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="formulas" className="space-y-6">
            <AppDocumentation />
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">ERP Integration</h3>
                    <p className="text-gray-600 mb-4">
                      Connect Supply Metrics Optimax with your existing ERP systems for seamless data flow.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">SAP Integration</h4>
                        <p className="text-sm text-gray-600">Direct API connections to SAP systems</p>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Oracle Integration</h4>
                        <p className="text-sm text-gray-600">Seamless Oracle database connectivity</p>
                      </Card>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Third-Party APIs</h3>
                    <p className="text-gray-600 mb-4">
                      Integrate with external services for enhanced functionality.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Google Maps API</h4>
                        <p className="text-sm text-gray-600">Real-time mapping and routing</p>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Weather API</h4>
                        <p className="text-sm text-gray-600">Weather-based optimization</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Section */}
        <Card className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Offline Access?</h2>
            <p className="mb-6">Download our comprehensive documentation as a PDF for offline reference.</p>
            <Button variant="secondary" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download PDF Guide
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
