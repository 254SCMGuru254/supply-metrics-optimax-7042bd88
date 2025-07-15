
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  book,
  file-text,
  code,
  play,
  download,
  external-link,
  settings,
  lightbulb
} from 'lucide-react';

const Documentation = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Documentation</h2>
        <p className="text-muted-foreground">
          Comprehensive guides and references for Supply Chain Optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <book className="mr-2 h-5 w-5" />
              Getting Started
            </CardTitle>
            <CardDescription>Quick start guide and tutorials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Learn the basics of supply chain optimization and get up and running quickly.
            </p>
            <Button className="w-full">
              <play className="mr-2 h-4 w-4" />
              Start Tutorial
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <code className="mr-2 h-5 w-5" />
              API Reference
            </CardTitle>
            <CardDescription>Complete API documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Detailed reference for all endpoints and data structures.
            </p>
            <Button className="w-full">
              <external-link className="mr-2 h-4 w-4" />
              View API Docs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <settings className="mr-2 h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>Setup and configuration guides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Learn how to configure and customize your optimization models.
            </p>
            <Button className="w-full">
              <file-text className="mr-2 h-4 w-4" />
              Configuration Guide
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <lightbulb className="mr-2 h-5 w-5" />
              Examples
            </CardTitle>
            <CardDescription>Sample implementations and use cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Real-world examples and best practices for common scenarios.
            </p>
            <Button className="w-full">
              <download className="mr-2 h-4 w-4" />
              Download Examples
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Documentation;
