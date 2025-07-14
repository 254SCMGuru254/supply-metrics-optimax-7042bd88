import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  ExternalLink, 
  Download,
  Lightbulb,
  Zap as Lightning,
  Search,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const Documentation = () => {
  const features = [
    {
      title: "Comprehensive Analytics",
      description: "Gain deep insights into your supply chain with our advanced analytics tools.",
      icon: BookOpen,
    },
    {
      title: "Optimization Models",
      description: "Optimize your operations with our powerful optimization models.",
      icon: Lightning,
    },
    {
      title: "Real-time Data",
      description: "Access real-time data to make informed decisions.",
      icon: FileText,
    },
    {
      title: "Customizable Dashboards",
      description: "Create custom dashboards to track the metrics that matter most to you.",
      icon: Settings,
    },
    {
      title: "Predictive Analytics",
      description: "Predict future trends and optimize your supply chain accordingly.",
      icon: Search,
    },
  ];

  const quickLinks = [
    {
      title: "Getting Started",
      description: "Learn how to get started with Supply Metrics Optimax.",
      href: "#getting-started",
      icon: Book,
    },
    {
      title: "Troubleshooting",
      description: "Find solutions to common problems.",
      href: "#troubleshooting",
      icon: HelpCircle,
    },
    {
      title: "API Reference",
      description: "Learn about our API and how to use it.",
      href: "#api-reference",
      icon: ExternalLink,
    },
    {
      title: "Downloads",
      description: "Download our latest software and tools.",
      href: "#downloads",
      icon: Download,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Supply Metrics Optimax - Documentation
          </h1>
          <p className="text-gray-600">
            Explore our comprehensive documentation to learn how to use Supply Metrics Optimax to its
            fullest potential.
          </p>
        </div>

        <section id="quick-links" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Card key={link.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{link.description}</p>
                  <Link to={link.href} className="text-blue-500 hover:underline block mt-2">
                    Learn More <ExternalLink className="inline-block h-3 w-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="features" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <feature.icon className="h-4 w-4" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="getting-started" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Getting Started</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Step-by-Step Guide</CardTitle>
              <CardDescription>
                Follow these steps to set up and start using Supply Metrics Optimax.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <p>
                    <strong>Create an Account:</strong> <Link to="/auth">Sign up</Link> for a new account or{" "}
                    <Link to="/auth">log in</Link> if you already have one.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Configure Your Supply Chain:</strong> Input your supply chain data, including
                    locations, products, and transportation routes.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Run Optimization Models:</strong> Choose from our range of optimization models to
                    analyze and improve your supply chain.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Analyze Results:</strong> View detailed analytics and reports to understand the
                    impact of your optimization efforts.
                  </p>
                </li>
              </ol>
              <Button asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="troubleshooting" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Troubleshooting</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Common Issues and Solutions</CardTitle>
              <CardDescription>Find solutions to common problems you may encounter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Issue: Data Input Errors</h3>
                <p className="text-gray-500">
                  <strong>Solution:</strong> Double-check your data inputs for accuracy and completeness.
                  Ensure all required fields are filled and that the data is in the correct format.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Issue: Optimization Model Failures</h3>
                <p className="text-gray-500">
                  <strong>Solution:</strong> Verify that your data meets the requirements of the selected
                  optimization model. Some models may require specific data formats or constraints.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Issue: Slow Performance</h3>
                <p className="text-gray-500">
                  <strong>Solution:</strong> Optimize your data inputs by reducing unnecessary complexity.
                  Ensure your system meets the minimum requirements for running the software.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="api-reference" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">API Reference</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Supply Metrics Optimax API</CardTitle>
              <CardDescription>
                Learn about our API and how to use it to integrate with your systems.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-500">
                Our API allows you to programmatically access and manage your supply chain data. You can
                use the API to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Retrieve supply chain data</li>
                <li>Run optimization models</li>
                <li>Analyze results</li>
                <li>Automate tasks</li>
              </ul>
              <Button variant="secondary">
                <ExternalLink className="inline-block h-4 w-4 mr-2" />
                View API Documentation
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="downloads" className="space-y-4">
          <h2 className="text-2xl font-bold mb-2">Downloads</h2>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Software and Tools</CardTitle>
              <CardDescription>Download our latest software and tools to enhance your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Supply Metrics Optimax Desktop App</h3>
                <p className="text-gray-500">
                  Download our desktop app for a seamless experience.
                </p>
                <Button>
                  <Download className="inline-block h-4 w-4 mr-2" />
                  Download Now
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Data Input Templates</h3>
                <p className="text-gray-500">
                  Download our data input templates to ensure your data is in the correct format.
                </p>
                <Button variant="secondary">
                  <Download className="inline-block h-4 w-4 mr-2" />
                  Download Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <div className="text-center text-gray-500">
          <p>&copy; 2025 Supply Metrics Optimax. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
