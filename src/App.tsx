
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";

// Import all pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NetworkOptimization from "@/pages/NetworkOptimization";
import RouteOptimization from "@/pages/RouteOptimization";
import InventoryManagement from "@/pages/InventoryManagement";
import NetworkDesign from "@/pages/NetworkDesign";
import CenterOfGravity from "@/pages/CenterOfGravity";
import DataInput from "@/pages/DataInput";
import Analytics from "@/pages/Analytics";
import BusinessValue from "@/pages/BusinessValue";
import NotFound from "@/pages/NotFound";
import Pricing from "@/pages/Pricing";
import Introduction from "@/pages/Introduction";
import Onboarding from "@/pages/Onboarding";
import DemandForecasting from "@/pages/DemandForecasting";
import FleetManagement from "@/pages/FleetManagement";
import Simulation from "@/pages/Simulation";
import Heuristic from "@/pages/Heuristic";
import Isohedron from "@/pages/Isohedron";
import NetworkFlow from "@/pages/NetworkFlow";
import ChatAssistant from "@/pages/ChatAssistant";
import DesignAssistant from "@/pages/DesignAssistant";
import KenyaSupplyChain from "@/pages/KenyaSupplyChain";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/introduction" element={<Introduction />} />
              
              {/* Protected routes with Layout */}
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />
              <Route path="/onboarding/select-model" element={<Layout><DataInput /></Layout>} />
              <Route path="/data-input" element={<Layout><DataInput /></Layout>} />
              <Route path="/network-optimization" element={<Layout><NetworkOptimization /></Layout>} />
              <Route path="/route-optimization" element={<Layout><RouteOptimization /></Layout>} />
              <Route path="/inventory-management" element={<Layout><InventoryManagement /></Layout>} />
              <Route path="/network-design" element={<Layout><NetworkDesign /></Layout>} />
              <Route path="/center-of-gravity" element={<Layout><CenterOfGravity /></Layout>} />
              <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
              <Route path="/business-value" element={<Layout><BusinessValue /></Layout>} />
              <Route path="/demand-forecasting" element={<Layout><DemandForecasting /></Layout>} />
              <Route path="/fleet-management" element={<Layout><FleetManagement /></Layout>} />
              <Route path="/simulation" element={<Layout><Simulation /></Layout>} />
              <Route path="/heuristic" element={<Layout><Heuristic /></Layout>} />
              <Route path="/isohedron" element={<Layout><Isohedron /></Layout>} />
              <Route path="/network-flow" element={<Layout><NetworkFlow /></Layout>} />
              <Route path="/chat-assistant" element={<Layout><ChatAssistant /></Layout>} />
              <Route path="/design-assistant" element={<Layout><DesignAssistant /></Layout>} />
              <Route path="/kenya-supply-chain" element={<Layout><KenyaSupplyChain /></Layout>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
