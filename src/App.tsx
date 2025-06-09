
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import RouteOptimization from "./pages/RouteOptimization";
import NetworkOptimization from "./pages/NetworkOptimization";
import InventoryManagement from "./pages/InventoryManagement";
import NetworkDesign from "./pages/NetworkDesign";
import CenterOfGravity from "./pages/CenterOfGravity";
import Simulation from "./pages/Simulation";
import Heuristic from "./pages/Heuristic";
import Isohedron from "./pages/Isohedron";
import NetworkFlow from "./pages/NetworkFlow";
import DataInput from "./pages/DataInput";
import Analytics from "./pages/Analytics";
import FleetManagement from "./pages/FleetManagement";
import DemandForecasting from "./pages/DemandForecasting";
import KenyaSupplyChain from "./pages/KenyaSupplyChain";
import HorticulturalOptimization from "./pages/HorticulturalOptimization";
import BusinessValue from "./pages/BusinessValue";
import DesignAssistant from "./pages/DesignAssistant";
import ChatAssistant from "./pages/ChatAssistant";
import Introduction from "./pages/Introduction";
import Onboarding from "./pages/Onboarding";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
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
                <Route path="/introduction" element={<Introduction />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/onboarding/*" element={<Onboarding />} />
                <Route path="/*" element={<Layout><Outlet /></Layout>}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="route-optimization" element={<RouteOptimization />} />
                  <Route path="network-optimization" element={<NetworkOptimization />} />
                  <Route path="inventory-management" element={<InventoryManagement />} />
                  <Route path="network-design" element={<NetworkDesign />} />
                  <Route path="center-of-gravity" element={<CenterOfGravity />} />
                  <Route path="simulation" element={<Simulation />} />
                  <Route path="heuristic" element={<Heuristic />} />
                  <Route path="isohedron" element={<Isohedron />} />
                  <Route path="network-flow" element={<NetworkFlow />} />
                  <Route path="data-input" element={<DataInput />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="fleet-management" element={<FleetManagement />} />
                  <Route path="demand-forecasting" element={<DemandForecasting />} />
                  <Route path="kenya-supply-chain" element={<KenyaSupplyChain />} />
                  <Route path="horticultural-optimization" element={<HorticulturalOptimization />} />
                  <Route path="business-value" element={<BusinessValue />} />
                  <Route path="design-assistant" element={<DesignAssistant />} />
                  <Route path="chat-assistant" element={<ChatAssistant />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
