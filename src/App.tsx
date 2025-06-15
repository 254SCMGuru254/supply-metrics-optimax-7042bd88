
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DataInput from "./pages/DataInput";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/analytics-dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <AnalyticsDashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/data-input" element={
                  <ProtectedRoute>
                    <Layout>
                      <DataInput />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/pricing" element={
                  <ProtectedRoute>
                    <Layout>
                      <Pricing />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Redirect old onboarding routes to data-input */}
                <Route path="/onboarding/*" element={<Navigate to="/data-input" replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
