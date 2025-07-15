import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Mail, 
  Lock, 
  User, 
  Building, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Star
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      // Simulate auth check
      const isAuthenticated = false; // Replace with actual auth check
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        toast({
          title: "Login Successful",
          description: "You have successfully logged in!",
        });
        navigate('/dashboard');
      } else {
        await signUp(email, password, name, company);
        toast({
          title: "Registration Successful",
          description: "You have successfully registered!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            {mode === 'login' ? 'Login' : 'Register'}
          </CardTitle>
          <Sparkles className="h-6 w-6 text-yellow-500 animate-spin-slow" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={mode} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setMode('login')}>Login</TabsTrigger>
              <TabsTrigger value="register" onClick={() => setMode('register')}>Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleAuthAction} className="space-y-4">
                <div>
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 mr-2 inline-block" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    <Lock className="h-4 w-4 mr-2 inline-block" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleAuthAction} className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    <User className="h-4 w-4 mr-2 inline-block" />
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">
                    <Building className="h-4 w-4 mr-2 inline-block" />
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    id="company"
                    placeholder="Enter your company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 mr-2 inline-block" />
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    <Lock className="h-4 w-4 mr-2 inline-block" />
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Star className="mr-2 h-4 w-4" />
                      Register
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
