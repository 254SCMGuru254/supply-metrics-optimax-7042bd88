
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Search, 
  SlidersHorizontal, 
  Calculator, 
  Code, 
  ExternalLink,
  FileText,
  Lightbulb
} from 'lucide-react';

const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const documentationSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of Supply Chain Optimization",
      topics: [
        "Platform Overview",
        "Setting up your first project",
        "Understanding the dashboard",
        "Basic optimization concepts"
      ],
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Optimization Models",
      description: "Comprehensive guide to all optimization algorithms",
      topics: [
        "Center of Gravity Method",
        "Route Optimization (TSP/VRP)",
        "Inventory Management (EOQ, ABC Analysis)",
        "Network Flow Optimization",
        "Facility Location Problems"
      ],
      icon: <Calculator className="h-5 w-5" />
    },
    {
      title: "API Reference",
      description: "Technical documentation for developers",
      topics: [
        "Authentication",
        "Data Import/Export",
        "Optimization Endpoints",
        "Webhook Configuration",
        "Rate Limits and Quotas"
      ],
      icon: <Code className="h-5 w-5" />
    },
    {
      title: "Advanced Features",
      description: "Explore advanced optimization capabilities",
      topics: [
        "Multi-Echelon Optimization",
        "Stochastic Models",
        "Sensitivity Analysis",
        "Scenario Planning",
        "Real-time Optimization"
      ],
      icon: <SlidersHorizontal className="h-5 w-5" />
    }
  ];

  const quickLinks = [
    { name: "Video Tutorials", icon: <ExternalLink className="h-4 w-4" /> },
    { name: "Sample Datasets", icon: <FileText className="h-4 w-4" /> },
    { name: "Best Practices", icon: <Lightbulb className="h-4 w-4" /> },
    { name: "Troubleshooting", icon: <Search className="h-4 w-4" /> },
  ];

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Documentation</h1>
        <p className="text-muted-foreground">
          Comprehensive guides and resources for Supply Chain Optimization
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Button key={index} variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            {link.icon}
            <span className="text-sm">{link.name}</span>
          </Button>
        ))}
      </div>

      {/* Main Documentation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSections.map((section, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center justify-between">
                        <span className="text-sm">{topic}</span>
                        <Badge variant="secondary" className="text-xs">
                          Guide
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Section
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Step-by-Step Tutorials</CardTitle>
                <p className="text-muted-foreground">Follow along with these comprehensive tutorials</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold">Setting up your first optimization project</h3>
                    <p className="text-sm text-muted-foreground">Learn how to import data and configure your first optimization run</p>
                    <Badge variant="outline" className="mt-2">Beginner</Badge>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold">Advanced routing with multiple constraints</h3>
                    <p className="text-sm text-muted-foreground">Master complex routing scenarios with time windows and capacity constraints</p>
                    <Badge variant="outline" className="mt-2">Advanced</Badge>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="font-semibold">Integrating with external systems</h3>
                    <p className="text-sm text-muted-foreground">Connect your optimization results with ERP and WMS systems</p>
                    <Badge variant="outline" className="mt-2">Intermediate</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="examples">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Retail Distribution", "Manufacturing", "E-commerce Fulfillment", "Cold Chain", "Last Mile Delivery", "3PL Operations"].map((example, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{example}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-world example showcasing optimization techniques for {example.toLowerCase()} operations.
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Example
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">How do I get started with optimization?</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by importing your data, then select the appropriate optimization model based on your business needs. 
                    Our guided setup will walk you through each step.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What data formats are supported?</h3>
                  <p className="text-sm text-muted-foreground">
                    We support CSV, Excel, JSON, and direct API integration. Our data validation ensures your data is correctly formatted.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How accurate are the optimization results?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our algorithms typically achieve 95%+ accuracy in real-world scenarios. Results depend on data quality and problem complexity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Can I integrate with my existing systems?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, we provide REST APIs and webhooks for seamless integration with ERP, WMS, and other enterprise systems.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;
