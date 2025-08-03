import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import { ThemeProvider } from "./components/ui/theme-provider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DataInput from "./pages/DataInput";
import RouteOptimization from "./pages/RouteOptimization";
import NetworkDesign from "./pages/NetworkDesign";
import CenterOfGravity from "./pages/CenterOfGravity";
import Heuristic from "./pages/Heuristic";
import Isohedron from "./pages/Isohedron";
import NetworkOptimization from "./pages/NetworkOptimization";
import NetworkFlow from "./pages/NetworkFlow";
import InventoryManagement from "./pages/InventoryManagement";
import Simulation from "./pages/Simulation";
import CostModeling from "./pages/CostModeling";
import FleetManagement from "./pages/FleetManagement";
import Analytics from "./pages/Analytics";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import BusinessValue from "./pages/BusinessValue";
import HorticulturalOptimization from "./pages/HorticulturalOptimization";
import KenyaSupplyChain from "./pages/KenyaSupplyChain";
import DataManagement from "./pages/DataManagement";
import DemandForecasting from "./pages/DemandForecasting";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import Introduction from "./pages/Introduction";
import ProjectDashboard from "./pages/ProjectDashboard";
import Warehouse from "./pages/Warehouse";
import Documentation from "./pages/Documentation";
import Support from "./pages/Support";
import ChatAssistant from "./pages/ChatAssistant";
import DesignAssistant from "./pages/DesignAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/data-input" element={<DataInput />} />
              <Route path="/route-optimization" element={<RouteOptimization />} />
              <Route path="/network-design" element={<NetworkDesign />} />
              <Route path="/center-of-gravity" element={<CenterOfGravity />} />
              <Route path="/center-of-gravity/new" element={<CenterOfGravity />} />
              <Route path="/center-of-gravity/:projectId" element={<CenterOfGravity />} />
              <Route path="/heuristic" element={<Heuristic />} />
              <Route path="/isohedron" element={<Isohedron />} />
              <Route path="/network-optimization" element={<NetworkOptimization />} />
              <Route path="/network-flow" element={<NetworkFlow />} />
              <Route path="/inventory-management" element={<InventoryManagement />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/cost-modeling" element={<CostModeling />} />
              <Route path="/fleet-management" element={<FleetManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
              <Route path="/business-value" element={<BusinessValue />} />
              <Route path="/horticultural-optimization" element={<HorticulturalOptimization />} />
              <Route path="/kenya-supply-chain" element={<KenyaSupplyChain />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="/demand-forecasting" element={<DemandForecasting />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/introduction" element={<Introduction />} />
              <Route path="/project-dashboard" element={<ProjectDashboard />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/support" element={<Support />} />
              <Route path="/chat-assistant" element={<ChatAssistant />} />
              <Route path="/design-assistant" element={<DesignAssistant />} />
              <Route path="/route-advanced" element={<RouteAdvanced />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
