
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Search, 
  Calculator, 
  Network, 
  Package, 
  MapPin, 
  TrendingUp,
  Globe,
  Code,
  Database,
  Zap
} from "lucide-react";

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const documentationSections = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Quick start guide and basic concepts",
      items: [
        { name: "Platform Overview", description: "Introduction to Supply Metrics Optimax", time: "5 min read" },
        { name: "Creating Your First Project", description: "Step-by-step project setup", time: "10 min read" },
        { name: "Data Input Methods", description: "How to input and manage data", time: "8 min read" },
        { name: "Kenya-Specific Setup", description: "Optimizing for Kenya markets", time: "12 min read" }
      ]
    },
    {
      title: "Optimization Models",
      icon: Calculator,
      description: "Mathematical models and algorithms",
      items: [
        { name: "Center of Gravity", description: "Facility location optimization", time: "15 min read" },
        { name: "Multi-Echelon Inventory", description: "Advanced inventory optimization", time: "20 min read" },
        { name: "Route Optimization", description: "Vehicle routing and logistics", time: "18 min read" },
        { name: "Network Flow Models", description: "Supply chain network design", time: "25 min read" }
      ]
    },
    {
      title: "Kenya Solutions",
      icon: Globe,
      description: "Industry-specific applications",
      items: [
        { name: "Tea Supply Chains", description: "Optimizing tea cooperative networks", time: "12 min read" },
        { name: "Coffee Export Logistics", description: "Coffee supply chain optimization", time: "14 min read" },
        { name: "Horticulture Cold Chain", description: "Fresh produce supply chains", time: "16 min read" },
        { name: "Manufacturing Networks", description: "Industrial supply chain design", time: "18 min read" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      description: "Technical integration guides",
      items: [
        { name: "Authentication", description: "API authentication methods", time: "8 min read" },
        { name: "Data Endpoints", description: "REST API documentation", time: "20 min read" },
        { name: "Optimization APIs", description: "Running optimizations via API", time: "15 min read" },
        { name: "Webhooks", description: "Real-time notifications", time: "10 min read" }
      ]
    }
  ];

  const quickLinks = [
    { name: "Video Tutorials", icon: Zap, description: "Visual learning resources" },
    { name: "Sample Datasets", icon: Database, description: "Example data for testing" },
    { name: "Community Forum", icon: Network, description: "Connect with other users" },
    { name: "Support Center", icon: BookOpen, description: "Get help and support" }
  ];

  const filteredSections = documentationSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-600 text-lg">Comprehensive guides and API references</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="getting-started" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="kenya">Kenya</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              
              {documentationSections.map((section, index) => (
                <TabsContent key={section.title} value={section.title.toLowerCase().replace(/\s+/g, '-')}>
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <section.icon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{section.title}</h2>
                      <p className="text-gray-600 text-lg">{section.description}</p>
                    </div>
                    
                    <div className="grid gap-4">
                      {section.items.map((item) => (
                        <Card key={item.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <Badge variant="secondary">{item.time}</Badge>
                            </div>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Button variant="outline" size="sm">
                              Read More
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link) => (
                  <Button key={link.name} variant="ghost" className="w-full justify-start h-auto p-3">
                    <link.icon className="mr-3 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{link.name}</div>
                      <div className="text-xs text-gray-500">{link.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="font-medium">Kenya Tea Optimization</div>
                    <div className="text-gray-500">Most viewed this week</div>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3">
                    <div className="font-medium">Center of Gravity Setup</div>
                    <div className="text-gray-500">Highly rated</div>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-3">
                    <div className="font-medium">API Getting Started</div>
                    <div className="text-gray-500">Developer favorite</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Get Help */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Link to="/support">
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
