import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, Globe, TrendingUp, MapPin, Package, Calculator, Network } from "lucide-react";
import ProfessionalHeader from "@/components/layout/ProfessionalHeader";
import ProfessionalFooter from "@/components/layout/ProfessionalFooter";

const logos = [
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
  "/lovable-uploads/a2956ea1-b63b-41de-a08a-e2aea31c4533.png",
];

const testimonials = [
  {
    quote: "Supply Metrics Optimax transformed our tea supply chain efficiency by 35% within 3 months.",
    author: "Jane Kiprotich, Operations Director, Kenya Tea Cooperative"
  },
  {
    quote: "The AI-powered insights revolutionized our coffee export logistics and saved us millions.",
    author: "John Mwangi, CEO, East African Coffee Exporters Ltd"
  }
];

const stats = [
  { label: "Optimization Models", value: 42, suffix: "+" },
  { label: "Kenya Businesses", value: 150, suffix: "+" },
  { label: "Accuracy Rate", value: 98, suffix: "%" },
  { label: "Cost Savings", value: 35, suffix: "%" }
];

const features = [
  {
    title: "Multi-Echelon Optimization",
    desc: "Advanced mathematical models for complex multi-tier supply chain networks with real-time optimization.",
    icon: Network
  },
  {
    title: "AI-Powered Inventory",
    desc: "Machine learning algorithms for demand forecasting, safety stock optimization, and automated replenishment.",
    icon: Package
  },
  {
    title: "Kenya-Focused Solutions",
    desc: "Specialized models for Kenya's tea, coffee, horticulture, and agricultural supply chains.",
    icon: Globe
  },
  {
    title: "Mathematical Precision",
    desc: "42+ optimization models including Center of Gravity, MILP, and advanced heuristic algorithms.",
    icon: Calculator
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
      {/* Use Professional Header */}
      <ProfessionalHeader />

      {/* Enhanced Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 hover:from-green-200 hover:to-blue-200 px-4 py-2">
                  🇰🇪 Kenya-First Supply Chain Intelligence Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
                  Supply Chain 4.0: 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}AI-Powered. Kenya-Ready.
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  The most advanced supply chain optimization platform built for Kenya's unique market dynamics. 
                  From tea cooperatives to manufacturing hubs, optimize every link in your supply chain with mathematical precision.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 w-full sm:w-auto">
                    Explore Live Demo
                  </Button>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat) => (
                  <StatBox key={stat.label} {...stat} />
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                <div className="text-center text-white p-8 relative z-10">
                  <Network className="h-24 w-24 mx-auto mb-6 drop-shadow-lg" />
                  <h3 className="text-3xl font-bold mb-4">42+ Models</h3>
                  <p className="text-blue-100 text-lg">Advanced optimization algorithms for every supply chain challenge in Kenya</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">🇰🇪 Kenya Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 mb-8 font-medium">
            Trusted by leading Kenya businesses and cooperatives
          </div>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {logos.map((logo, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Advanced Optimization Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by cutting-edge mathematical models and AI algorithms, specifically designed for Kenya's supply chain challenges
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories from Kenya</h2>
            <p className="text-xl text-gray-600">Real transformations from businesses across Kenya's supply chain ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Kenya businesses optimizing their operations with our AI-powered platform. 
            Start your transformation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/kenya-supply-chain">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 w-full sm:w-auto">
                Explore Kenya Solutions
              </Button>
            </Link>
          </div>
          <div className="mt-8 text-blue-100 text-sm">
            ✓ No credit card required  ✓ 14-day free trial  ✓ Kenya-specific templates included
          </div>
        </div>
      </section>

      {/* Use Professional Footer */}
      <ProfessionalFooter />
    </div>
  );
};

export default NewLandingPage;
