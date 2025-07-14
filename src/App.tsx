
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
import Analytics from "./pages/Analytics";
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
import Isohedron from "./pages/Isohedron";
import WarehousePage from "./pages/Warehouse";
import Support from "./pages/Support";

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
              <Route path="/support" element={<Support />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/kenya-supply-chain" element={<KenyaSupplyChain />} />

              {/* Analytics route - public for now but functional */}
              <Route path="/analytics" element={<Analytics />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoutesLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics-dashboard/:projectId" element={<AnalyticsDashboard />} />
                <Route path="/analytics-dashboard/new" element={<AnalyticsDashboard />} />
                <Route path="/data-input/:projectId" element={<DataInput />} />
                <Route path="/data-input/new" element={<DataInput />} />
                <Route path="/route-optimization/:projectId" element={<RouteOptimization />} />
                <Route path="/route-optimization/new" element={<RouteOptimization />} />
                <Route path="/inventory-management/:projectId" element={<InventoryManagement />} />
                <Route path="/inventory-management/new" element={<InventoryManagement />} />
                <Route path="/network-optimization/:projectId" element={<NetworkOptimization />} />
                <Route path="/network-optimization/new" element={<NetworkOptimization />} />
                <Route path="/center-of-gravity/:projectId" element={<CenterOfGravity />} />
                <Route path="/center-of-gravity/new" element={<CenterOfGravity />} />
                <Route path="/heuristic/:projectId" element={<Heuristic />} />
                <Route path="/isohedron/:projectId" element={<Isohedron />} />
                <Route path="/simulation/:projectId" element={<Simulation />} />
                <Route path="/simulation/new" element={<Simulation />} />
                <Route path="/warehouse/:projectId" element={<WarehousePage />} />
                <Route path="/fleet-management/:projectId" element={<FleetManagement />} />
                <Route path="/cost-modeling/:projectId" element={<CostModeling />} />
                <Route path="/business-value" element={<BusinessValue />} />
              </Route>

              {/* Redirect old onboarding routes to data-input */}
              <Route path="/onboarding/*" element={<Navigate to="/data-input/new" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
