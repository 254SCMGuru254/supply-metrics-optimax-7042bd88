
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Pricing from "@/pages/Pricing";
import Onboarding from "@/pages/Onboarding";
import Dashboard from "@/pages/Dashboard";
import CenterOfGravity from "@/pages/CenterOfGravity";
import NetworkOptimization from "@/pages/NetworkOptimization";
import RouteOptimization from "@/pages/RouteOptimization";
import Simulation from "@/pages/Simulation";
import Heuristic from "@/pages/Heuristic";
import Isohedron from "@/pages/Isohedron";
import Analytics from "@/pages/Analytics";
import DataInput from "@/pages/DataInput";
import NetworkDesign from "@/pages/NetworkDesign";
import NetworkFlow from "@/pages/NetworkFlow";
import InventoryManagement from "@/pages/InventoryManagement";
import FleetManagement from "@/pages/FleetManagement";
import DemandForecasting from "@/pages/DemandForecasting";
import KenyaSupplyChain from "@/pages/KenyaSupplyChain";
import ChatAssistant from "@/pages/ChatAssistant";
import BusinessValue from "@/pages/BusinessValue";
import DesignAssistant from "@/pages/DesignAssistant";
import Introduction from "@/pages/Introduction";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in TanStack Query v5)
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Onboarding routes - nested structure */}
            <Route path="/onboarding/*" element={<Onboarding />} />
            
            {/* Main application routes with layout */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/center-of-gravity" element={<Layout><CenterOfGravity /></Layout>} />
            <Route path="/network-optimization" element={<Layout><NetworkOptimization /></Layout>} />
            <Route path="/route-optimization" element={<Layout><RouteOptimization /></Layout>} />
            <Route path="/simulation" element={<Layout><Simulation /></Layout>} />
            <Route path="/heuristic" element={<Layout><Heuristic /></Layout>} />
            <Route path="/isohedron" element={<Layout><Isohedron /></Layout>} />
            <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
            <Route path="/data-input" element={<Layout><DataInput /></Layout>} />
            <Route path="/network-design" element={<Layout><NetworkDesign /></Layout>} />
            <Route path="/network-flow" element={<Layout><NetworkFlow /></Layout>} />
            <Route path="/inventory-management" element={<Layout><InventoryManagement /></Layout>} />
            <Route path="/fleet-management" element={<Layout><FleetManagement /></Layout>} />
            <Route path="/demand-forecasting" element={<Layout><DemandForecasting /></Layout>} />
            <Route path="/kenya-supply-chain" element={<Layout><KenyaSupplyChain /></Layout>} />
            <Route path="/chat-assistant" element={<Layout><ChatAssistant /></Layout>} />
            <Route path="/business-value" element={<Layout><BusinessValue /></Layout>} />
            <Route path="/design-assistant" element={<Layout><DesignAssistant /></Layout>} />
            <Route path="/introduction" element={<Layout><Introduction /></Layout>} />
            
            {/* 404 fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
