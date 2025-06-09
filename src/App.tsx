
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectDashboard from "./pages/ProjectDashboard";
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
                
                {/* Main application routes */}
                <Route path="/app" element={<Layout><ProjectDashboard /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/route-optimization" element={<Layout><RouteOptimization /></Layout>} />
                <Route path="/network-optimization" element={<Layout><NetworkOptimization /></Layout>} />
                <Route path="/inventory-management" element={<Layout><InventoryManagement /></Layout>} />
                <Route path="/network-design" element={<Layout><NetworkDesign /></Layout>} />
                <Route path="/center-of-gravity" element={<Layout><CenterOfGravity /></Layout>} />
                <Route path="/simulation" element={<Layout><Simulation /></Layout>} />
                <Route path="/heuristic" element={<Layout><Heuristic /></Layout>} />
                <Route path="/isohedron" element={<Layout><Isohedron /></Layout>} />
                <Route path="/network-flow" element={<Layout><NetworkFlow /></Layout>} />
                <Route path="/data-input" element={<Layout><DataInput /></Layout>} />
                <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
                <Route path="/fleet-management" element={<Layout><FleetManagement /></Layout>} />
                <Route path="/demand-forecasting" element={<Layout><DemandForecasting /></Layout>} />
                <Route path="/kenya-supply-chain" element={<Layout><KenyaSupplyChain /></Layout>} />
                <Route path="/horticultural-optimization" element={<Layout><HorticulturalOptimization /></Layout>} />
                <Route path="/business-value" element={<Layout><BusinessValue /></Layout>} />
                <Route path="/design-assistant" element={<Layout><DesignAssistant /></Layout>} />
                <Route path="/chat-assistant" element={<Layout><ChatAssistant /></Layout>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
