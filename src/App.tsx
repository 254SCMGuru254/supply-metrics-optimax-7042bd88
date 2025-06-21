import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
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

const ProtectedRoutesLayout = () => {
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

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<NewLandingPage />} />
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoutesLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
                <Route path="/data-input" element={<DataInput />} />
                <Route path="/route-optimization" element={<RouteOptimization />} />
                <Route path="/inventory-management" element={<InventoryManagement />} />
                <Route path="/network-optimization" element={<NetworkOptimization />} />
                <Route path="/center-of-gravity" element={<CenterOfGravity />} />
                <Route path="/heuristic" element={<Heuristic />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/fleet-management" element={<FleetManagement />} />
                <Route path="/cost-modeling" element={<CostModeling />} />
                <Route path="/kenya-supply-chain" element={<KenyaSupplyChain />} />
                <Route path="/business-value" element={<BusinessValue />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/pricing" element={<Pricing />} />
              </Route>

              {/* Redirect old onboarding routes to data-input */}
              <Route path="/onboarding/*" element={<Navigate to="/data-input" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
