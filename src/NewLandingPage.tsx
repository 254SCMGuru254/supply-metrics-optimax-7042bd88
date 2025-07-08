
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Activity,
  Shield, 
  Users, 
  CheckCircle, 
  Target,
  ArrowRight,
  Play,
  Globe,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfessionalHeader from './components/layout/ProfessionalHeader';
import { ProfessionalFooter } from './components/layout/ProfessionalFooter';

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
      {/* Professional Header */}
      <ProfessionalHeader />

      {/* Hero Section - Balanced Layout */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200">
                  <Target className="h-4 w-4 mr-2" />
                  Enterprise-Grade Supply Chain Optimization
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Intelligent Supply Chain
                  </span>
                  <br />
                  <span className="text-gray-900">Optimization Platform</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your supply chain with AI-powered optimization. 40+ advanced models, 
                  real-time analytics, and Kenya-focused solutions for enterprise-scale operations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
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

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-4">Trusted by leading organizations worldwide</p>
                <div className="flex flex-wrap gap-6 opacity-60">
                  <div className="text-xl font-bold text-gray-400">ENTERPRISE A</div>
                  <div className="text-xl font-bold text-gray-400">GLOBAL CORP</div>
                  <div className="text-xl font-bold text-gray-400">LOGISTICS PRO</div>
                </div>
              </div>
            </div>

            {/* Right side - Balanced Visual */}
            <div className="flex justify-center items-center">
              <div className="relative w-full max-w-md">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="relative z-10">
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold">Supply Chain</h2>
                      <h3 className="text-4xl font-bold">Intelligence</h3>
                      <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="mt-8 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-sm">Real-time Analytics</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-sm">AI-Powered Insights</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-sm">Enterprise Scale</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Balanced decorative elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full"></div>
                  <div className="absolute bottom-6 right-6 w-6 h-6 bg-white/20 rounded-full"></div>
                  <div className="absolute top-1/2 right-12 w-3 h-3 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-1/3 left-4 w-4 h-4 bg-white/15 rounded-full"></div>
                </div>
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
                      <CheckCircle key={i} className="h-5 w-5 text-yellow-400 fill-current" />
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
      <ProfessionalFooter />
    </div>
  );
};

export default NewLandingPage;
