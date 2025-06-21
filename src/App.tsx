import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import NewLandingPage from "./NewLandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DataInput from "./pages/DataInput";
import RouteOptimization from "./pages/RouteOptimization";
import InventoryManagement from "./pages/InventoryManagement";
import NetworkOptimization from "./pages/NetworkOptimization";
import CenterOfGravity from "./pages/CenterOfGravity";
import Heuristic from "./pages/Heuristic";
import Simulation from "./pages/Simulation";
import FleetManagement from "./pages/FleetManagement";
import CostModeling from "./pages/CostModeling";
import KenyaSupplyChain from "./pages/KenyaSupplyChain";
import BusinessValue from "./pages/BusinessValue";
import Documentation from "./pages/Documentation";
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
                <Route path="/" element={<NewLandingPage />} />
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
                
                <Route path="/route-optimization" element={
                  <ProtectedRoute>
                    <Layout>
                      <RouteOptimization />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/inventory-management" element={
                  <ProtectedRoute>
                    <Layout>
                      <InventoryManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/network-optimization" element={
                  <ProtectedRoute>
                    <Layout>
                      <NetworkOptimization />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/center-of-gravity" element={
                  <ProtectedRoute>
                    <Layout>
                      <CenterOfGravity />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/heuristic" element={
                  <ProtectedRoute>
                    <Layout>
                      <Heuristic />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/simulation" element={
                  <ProtectedRoute>
                    <Layout>
                      <Simulation />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/fleet-management" element={
                  <ProtectedRoute>
                    <Layout>
                      <FleetManagement />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/cost-modeling" element={
                  <ProtectedRoute>
                    <Layout>
                      <CostModeling />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/kenya-supply-chain" element={
                  <ProtectedRoute>
                    <Layout>
                      <KenyaSupplyChain />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/business-value" element={
                  <ProtectedRoute>
                    <Layout>
                      <BusinessValue />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/documentation" element={
                  <ProtectedRoute>
                    <Layout>
                      <Documentation />
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
