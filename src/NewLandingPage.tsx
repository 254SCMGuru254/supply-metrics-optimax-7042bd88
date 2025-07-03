
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Activity, // Replace Zap
  Shield, 
  Users, 
  CheckCircle, 
  Target, // Replace Star
  ArrowRight,
  Play,
  Globe,
  Settings, // Replace Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const NewLandingPage = () => {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Real-time insights with 40+ optimization models including Center of Gravity, MILP, and Network Flow algorithms."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Interactive Maps",
      description: "Visualize your supply chain with OpenStreetMap integration, route optimization, and facility location planning."
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "AI-Powered Optimization",
      description: "Machine learning algorithms for demand forecasting, inventory optimization, and predictive analytics."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access control and comprehensive audit trails."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaborative Platform",
      description: "Multi-user environment with project management and real-time collaboration features."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Kenya-Focused Solutions",
      description: "Specialized features for tea, coffee, floriculture, and other key Kenyan industries."
    }
  ];

  const models = [
    "Center of Gravity", "Route Optimization", "Network Flow", "MILP", "Facility Location",
    "Inventory Management", "Demand Forecasting", "Cost Modeling", "Fleet Management",
    "Simulation Engine", "Heuristic Algorithms", "Risk Management"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Supply Chain Director",
      company: "Global Manufacturing Co.",
      content: "Supply Metrics Optimax transformed our operations, reducing costs by 23% while improving service levels.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Operations Manager",
      company: "East Africa Logistics",
      content: "The Kenya-specific features helped us optimize our tea supply chain across 50+ collection centers.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Analytics Lead",
      company: "Tech Solutions Inc.",
      content: "Incredible depth of optimization models. The real-time analytics dashboard is game-changing.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Supply Metrics Optimax
                </span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#models" className="text-gray-600 hover:text-gray-900 transition-colors">Models</a>
              <Link to="/documentation" className="text-gray-600 hover:text-gray-900 transition-colors">Docs</Link>
              <Link to="/support" className="text-gray-600 hover:text-gray-900 transition-colors">Support</Link>
            </div>
            
            <div className="flex items-center">
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
                <Target className="h-4 w-4 mr-2" />
                Enterprise-Grade Supply Chain Optimization
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Intelligent Supply Chain
                </span>
                <br />
                <span className="text-gray-900">Optimization Platform</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Transform your supply chain with AI-powered optimization. 40+ advanced models, 
                real-time analytics, and Kenya-focused solutions for enterprise-scale operations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Optimizing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-gray-50">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-2xl font-bold text-gray-400">ENTERPRISE A</div>
                <div className="text-2xl font-bold text-gray-400">GLOBAL CORP</div>
                <div className="text-2xl font-bold text-gray-400">LOGISTICS PRO</div>
                <div className="text-2xl font-bold text-gray-400">SUPPLY CHAIN+</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Supply Chains
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize, analyze, and transform your supply chain operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section id="models" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              40+ Advanced Optimization Models
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic algorithms to enterprise-scale multi-echelon optimization
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {models.map((model, index) => (
              <div key={index} className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Settings className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900">{model}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/documentation">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2">
                View All Models
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Supply Chain Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See how organizations transform their operations with Supply Metrics Optimax
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Target key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of professionals who trust Supply Metrics Optimax for enterprise-scale optimization
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Supply Metrics Optimax</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade supply chain optimization platform with AI-powered analytics.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link to="/optimization" className="hover:text-white transition-colors">Optimization</Link></li>
                <li><Link to="/simulation" className="hover:text-white transition-colors">Simulation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Supply Metrics Optimax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
