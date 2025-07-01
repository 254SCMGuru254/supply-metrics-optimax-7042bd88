
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Globe, Award, TrendingUp, MapPin, Package, Calculator, Network } from "lucide-react";

const logos = [
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
];

const testimonials = [
  {
    quote: "Supply Metrics Optimax gave us real-time visibility and cut our logistics costs by 18% in 3 months.",
    author: "Jane Doe, COO, MegaRetail Kenya"
  },
  {
    quote: "The AI-powered insights are a game changer for our global operations and Kenya focus.",
    author: "John Smith, VP Supply Chain, AgroCorp East Africa"
  }
];

const stats = [
  { label: "Models Available", value: 42, suffix: "+" },
  { label: "Active Users", value: 40000, suffix: "" },
  { label: "Accuracy Rate", value: 98, suffix: "%" },
  { label: "Kenya Industries", value: 12, suffix: "" }
];

const features = [
  {
    title: "Network Design",
    desc: "Model and optimize your end-to-end supply chain network with advanced algorithms.",
    icon: Network
  },
  {
    title: "Inventory Optimization",
    desc: "Reduce stockouts and costs with AI-driven inventory policies and safety stock optimization.",
    icon: Package
  },
  {
    title: "Route Optimization",
    desc: "Minimize transport costs and delivery times with advanced routing algorithms.",
    icon: MapPin
  },
  {
    title: "Kenya Focus",
    desc: "Specialized models for Kenya's unique supply chain challenges and opportunities.",
    icon: Globe
  }
];

const FeatureCard = ({ title, desc, icon: Icon }) => (
  <Card className="h-full group hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
    <CardHeader>
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <CardTitle className="text-lg font-bold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600">{desc}</p>
    </CardContent>
  </Card>
);

const TestimonialCard = ({ quote, author }) => (
  <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
    <CardContent className="p-6">
      <blockquote className="italic text-gray-700 mb-4">"{quote}"</blockquote>
      <div className="font-semibold text-blue-600">{author}</div>
    </CardContent>
  </Card>
);

const StatBox = ({ label, value, suffix }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 mb-2">
      {value.toLocaleString()}{suffix || ""}
    </div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const NewLandingPage = () => {
  useEffect(() => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href") as string);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", () => {});
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Supply Metrics Optimax
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</a>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Pricing</Link>
              <Link to="/documentation" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Docs</Link>
              <Link to="/kenya-supply-chain" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Kenya Focus</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  🇰🇪 Kenya-Focused Supply Chain Intelligence
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                  Supply Chain 3.0: 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}Outthink. Outmaneuver. Outperform
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The next generation of supply chain optimization. Harness AI and advanced analytics to build a resilient, efficient, and sustainable supply chain with specialized Kenya market focus.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                    See Live Demo
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => (
                  <StatBox
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Network className="h-24 w-24 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">42+ Models</h3>
                  <p className="text-blue-100">Advanced optimization algorithms for every supply chain challenge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 mb-8 font-medium">Trusted by leading Kenya businesses</div>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {logos.map((logo, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Optimization Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced mathematical models and AI-driven insights to transform your supply chain operations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real results from Kenya businesses using our platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses optimizing their operations with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/kenya-supply-chain">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6">
                Explore Kenya Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Network className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Supply Metrics Optimax</span>
              </div>
              <p className="text-gray-400">
                Advanced supply chain optimization platform with specialized focus on Kenya market dynamics.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <div className="space-y-2">
                <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                <Link to="/analytics-dashboard/demo" className="block text-gray-400 hover:text-white transition-colors">Analytics</Link>
                <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors">Documentation</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-white transition-colors">Pricing</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <div className="space-y-2">
                <Link to="/kenya-supply-chain" className="block text-gray-400 hover:text-white transition-colors">Kenya Focus</Link>
                <Link to="/business-value" className="block text-gray-400 hover:text-white transition-colors">Business Value</Link>
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
                <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors">Case Studies</Link>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors">Help Center</Link>
                <Link to="/auth" className="block text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors">API Reference</Link>
                <Link to="/documentation" className="block text-gray-400 hover:text-white transition-colors">Community</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Supply Metrics Optimax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
