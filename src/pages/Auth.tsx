
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  MessageCircle, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Star, 
  TrendingUp 
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    "40+ Optimization Models",
    "Real-time Analytics",
    "Kenya-focused Solutions",
    "Enterprise Security",
    "Multi-user Collaboration"
  ];

  const testimonials = [
    {
      name: "Jane Kiprotich",
      role: "Supply Chain Manager",
      company: "Kenya Tea Development Agency",
      content: "Optimax helped us reduce tea collection costs by 25% across our cooperative network.",
      rating: 5
    },
    {
      name: "David Mwangi",
      role: "Operations Director", 
      company: "Nairobi Logistics Ltd",
      content: "The route optimization feature alone saved us over KSh 2M annually in fuel costs.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Supply Metrics Optimax
                </span>
                <span className="text-xs text-gray-500 -mt-1">Advanced Supply Chain Intelligence</span>
              </div>
            </Link>
            
            <Badge variant="secondary" className="bg-green-100 text-green-700 px-3 py-1">
              🇰🇪 Kenya Ready
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Welcome back' : 'Get started'}
              </h1>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Sign in to your Supply Metrics Optimax account'
                  : 'Create your account and start optimizing'
                }
              </p>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-6">
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0 h-auto font-medium text-blue-600 hover:text-blue-700"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Features & Social Proof */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-white">
          <div className="flex flex-col justify-center space-y-8">
            {/* Key Features */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Why Supply Chain Leaders Choose Optimax
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span className="text-blue-100">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Trusted by Industry Leaders</h3>
              <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-4">
                      <div className="flex mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-300 fill-current" />
                        ))}
                      </div>
                      <p className="text-blue-100 text-sm mb-3">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-xs text-blue-200">{testimonial.role}</div>
                        <div className="text-xs text-blue-300">{testimonial.company}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">support@optimax.co.ke</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">+254 700 000 000</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-200" />
                  <span className="text-blue-100 text-sm">Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
