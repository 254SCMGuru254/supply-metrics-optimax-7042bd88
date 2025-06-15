import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import Index from "./pages/Index";
import RouteOptimization from "./pages/RouteOptimization";
import InventoryManagement from "./pages/InventoryManagement";
import CenterOfGravity from "./pages/CenterOfGravity";
import NetworkOptimization from "./pages/NetworkOptimization";
import Heuristic from "./pages/Heuristic";
import Simulation from "./pages/Simulation";
import DataManagement from "./pages/DataManagement";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/route-optimization" element={<RouteOptimization />} />
              <Route path="/inventory-optimization" element={<InventoryManagement />} />
              <Route path="/center-of-gravity" element={<CenterOfGravity />} />
              <Route path="/network-optimization" element={<NetworkOptimization />} />
              <Route path="/heuristic" element={<Heuristic />} />
              <Route path="/simulation" element={<Simulation />} />
              <Route path="/data-management" element={<DataManagement />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
