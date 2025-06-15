
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { Outlet } from "react-router-dom";

// Import pages
import Index from "@/pages/Index";
import RouteOptimization from "@/pages/RouteOptimization";
import InventoryManagement from "@/pages/InventoryManagement";
import CenterOfGravity from "@/pages/CenterOfGravity";
import NetworkOptimization from "@/pages/NetworkOptimization";
import NetworkFlow from "@/pages/NetworkFlow";
import Simulation from "@/pages/Simulation";
import Heuristic from "@/pages/Heuristic";
import DataInput from "@/pages/DataInput";
import Documentation from "@/pages/Documentation";
import Isohedron from "@/pages/Isohedron";
import Dashboard from "@/pages/Dashboard";
import Introduction from "@/pages/Introduction";
import BusinessValue from "@/pages/BusinessValue";
import Analytics from "@/pages/Analytics";
import { AnalyticsDashboard } from "@/pages/AnalyticsDashboard";
import FleetManagement from "@/pages/FleetManagement";
import DemandForecasting from "@/pages/DemandForecasting";
import NetworkDesign from "@/pages/NetworkDesign";
import HorticulturalOptimization from "@/pages/HorticulturalOptimization";
import KenyaSupplyChain from "@/pages/KenyaSupplyChain";
import ProjectDashboard from "@/pages/ProjectDashboard";
import DataManagement from "@/pages/DataManagement";
import Pricing from "@/pages/Pricing";
import DesignAssistant from "@/pages/DesignAssistant";
import ChatAssistant from "@/pages/ChatAssistant";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/NotFound";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><Outlet /></Layout>}>
              <Route index element={<Index />} />
              <Route path="route-optimization" element={<RouteOptimization />} />
              <Route path="inventory-management" element={<InventoryManagement />} />
              <Route path="center-of-gravity" element={<CenterOfGravity />} />
              <Route path="network-optimization" element={<NetworkOptimization />} />
              <Route path="network-flow" element={<NetworkFlow />} />
              <Route path="simulation" element={<Simulation />} />
              <Route path="heuristic" element={<Heuristic />} />
              <Route path="data-input" element={<DataInput />} />
              <Route path="documentation" element={<Documentation />} />
              <Route path="isohedron" element={<Isohedron />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="introduction" element={<Introduction />} />
              <Route path="business-value" element={<BusinessValue />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="analytics-dashboard" element={<AnalyticsDashboard />} />
              <Route path="fleet-management" element={<FleetManagement />} />
              <Route path="demand-forecasting" element={<DemandForecasting />} />
              <Route path="network-design" element={<NetworkDesign />} />
              <Route path="horticultural-optimization" element={<HorticulturalOptimization />} />
              <Route path="kenya-supply-chain" element={<KenyaSupplyChain />} />
              <Route path="project-dashboard" element={<ProjectDashboard />} />
              <Route path="data-management" element={<DataManagement />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="design-assistant" element={<DesignAssistant />} />
              <Route path="chat-assistant" element={<ChatAssistant />} />
              <Route path="onboarding" element={<Onboarding />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
