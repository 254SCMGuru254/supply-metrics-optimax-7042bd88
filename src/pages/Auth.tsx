
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { 
  Network, 
  BarChart3, 
  MapPin, 
  Activity, 
  Shield,
  Mail,
  Phone,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    { icon: <BarChart3 className="h-8 w-8" />, title: "Advanced Analytics", description: "40+ optimization models" },
    { icon: <MapPin className="h-8 w-8" />, title: "Interactive Maps", description: "Real-time visualization" },
    { icon: <Activity className="h-8 w-8" />, title: "AI-Powered", description: "Machine learning insights" },
    { icon: <Shield className="h-8 w-8" />, title: "Enterprise Security", description: "Bank-grade protection" },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Supply Chain Director",
      company: "Global Corp",
      content: "Transformed our operations with 25% cost reduction.",
      rating: 5
    },
    {
      name: "Jane Smith", 
      role: "Operations Manager",
      company: "Kenya Logistics",
      content: "The Kenya-specific features are exactly what we needed.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supply Metrics Optimax
            </span>
          </Link>
          <Badge className="bg-green-100 text-green-700 px-3 py-1">
            🇰🇪 Kenya Ready Platform
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Auth Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </CardTitle>
                <CardDescription>
                  {isLogin ? 'Sign in to your account to continue' : 'Create your account to begin optimizing'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLogin ? <LoginForm /> : <RegisterForm />}
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isLogin ? 'Sign up now' : 'Sign in instead'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features & Testimonials */}
          <div className="space-y-8">
            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Why Choose Supply Metrics Optimax?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <Card key={index} className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <div className="text-blue-600">
                            {feature.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Trusted by Industry Leaders
              </h2>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-0">
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-3">"{testimonial.content}"</p>
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

            {/* Contact Info */}
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold mb-4">Need Help Getting Started?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <span>support@supplymetricsoptimax.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5" />
                    <span>+254 (0) 700 123 456</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5" />
                    <span>24/7 Expert Support Available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
