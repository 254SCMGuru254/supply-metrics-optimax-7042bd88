
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, TrendingUp, BarChart3, Users, Award } from 'lucide-react';

const Auth = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consultation form state
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    industry: ''
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setConsultationForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message || "Invalid email or password. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password,
        {
          full_name: formData.fullName,
          company: formData.company
        }
      );
      
      if (error) {
        if (error.message?.includes('already registered')) {
          toast({
            title: "Account Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: error.message || "Failed to create account. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          company: ''
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingConsultation(true);

    // Simulate API call for consultation request
    setTimeout(() => {
      toast({
        title: "Consultation Request Sent!",
        description: "We'll contact you within 24 hours to discuss your supply chain needs.",
      });
      
      // Clear form
      setConsultationForm({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        industry: ''
      });
      
      setIsSubmittingConsultation(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-in">Chain.IO</h1>
          <p className="text-lg text-gray-600 animate-slide-up">
            Supply Chain 3.0: Outthink. Outmaneuver. Outperform
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left side - Auth Forms */}
          <div className="space-y-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>
                      Enter your email and password to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signin-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Fill in your details to create a new account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Company Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create a password"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Right side - Value Proposition & Consultation Form */}
          <div className="space-y-6">
            {/* Animated Value Proposition */}
            <Card className="animate-slide-up bg-gradient-to-r from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Transform Your Supply Chain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold">42+ Models</h4>
                    <p className="text-sm text-gray-600">Advanced optimization algorithms</p>
                  </div>
                  <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Kenya Focus</h4>
                    <p className="text-sm text-gray-600">Local market expertise</p>
                  </div>
                  <div className="text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold">98% Accuracy</h4>
                    <p className="text-sm text-gray-600">Enterprise-grade precision</p>
                  </div>
                  <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                    <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-semibold">Real ROI</h4>
                    <p className="text-sm text-gray-600">Measurable business impact</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-700 mb-4">
                    Join enterprises, farmers, and researchers who trust Chain.IO for supply chain optimization
                  </p>
                  <div className="flex justify-center space-x-4 text-xs text-gray-500">
                    <span>✓ Real-time analytics</span>
                    <span>✓ AI-powered insights</span>
                    <span>✓ Scalable solutions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Request Form */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Request Personal Consultation
                </CardTitle>
                <CardDescription>
                  Get expert advice tailored to your supply chain challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="consultation-name">Full Name</Label>
                      <Input
                        id="consultation-name"
                        name="name"
                        value={consultationForm.name}
                        onChange={handleConsultationChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation-email">Email</Label>
                      <Input
                        id="consultation-email"
                        name="email"
                        type="email"
                        value={consultationForm.email}
                        onChange={handleConsultationChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="consultation-company">Company</Label>
                      <Input
                        id="consultation-company"
                        name="company"
                        value={consultationForm.company}
                        onChange={handleConsultationChange}
                        placeholder="Company name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultation-phone">Phone</Label>
                      <Input
                        id="consultation-phone"
                        name="phone"
                        type="tel"
                        value={consultationForm.phone}
                        onChange={handleConsultationChange}
                        placeholder="+254 xxx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-industry">Industry</Label>
                    <select
                      id="consultation-industry"
                      name="industry"
                      value={consultationForm.industry}
                      onChange={handleConsultationChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      required
                    >
                      <option value="">Select your industry</option>
                      <option value="agriculture">Agriculture & Food</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail & FMCG</option>
                      <option value="logistics">Logistics & Transport</option>
                      <option value="mining">Mining & Resources</option>
                      <option value="healthcare">Healthcare & Pharma</option>
                      <option value="construction">Construction</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consultation-message">Tell us about your supply chain challenges</Label>
                    <Textarea
                      id="consultation-message"
                      name="message"
                      value={consultationForm.message}
                      onChange={handleConsultationChange}
                      placeholder="Describe your current supply chain challenges, goals, and how we can help..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmittingConsultation}
                  >
                    {isSubmittingConsultation ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Request Consultation
                      </>
                    )}
                  </Button>

                  <div className="text-center text-xs text-gray-500 space-y-1">
                    <p>✓ Free initial consultation</p>
                    <p>✓ 24-hour response time</p>
                    <p>✓ Kenya supply chain experts</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
