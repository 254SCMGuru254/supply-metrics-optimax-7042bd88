
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  CodeIcon,
  ArrowRight,
  Download,
  Users,
  Settings2
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Documentation</h2>
        <p className="text-muted-foreground">
          Comprehensive guides and API documentation to help you get started with our platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>Learn the basics of our platform and how to set up your first project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Read Guide <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CodeIcon className="mr-2 h-5 w-5" />
              API Reference
            </CardTitle>
            <CardDescription>Complete API documentation with examples and code snippets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              View API Docs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Tutorials
            </CardTitle>
            <CardDescription>Step-by-step tutorials for common use cases and advanced features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Browse Tutorials <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings2 className="mr-2 h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Learn how to configure and customize the platform for your needs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Configuration Guide <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Best Practices
            </CardTitle>
            <CardDescription>Industry best practices and optimization strategies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              Learn Best Practices <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Downloads
            </CardTitle>
            <CardDescription>Download SDKs, tools, and additional resources.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">
              View Downloads <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
