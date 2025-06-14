
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import RouteOptimization from "@/pages/RouteOptimization";
import NetworkOptimization from "@/pages/NetworkOptimization";
import CenterOfGravity from "@/pages/CenterOfGravity";
import Heuristic from "@/pages/Heuristic";
import Isohedron from "@/pages/Isohedron";
import BusinessValue from "@/pages/BusinessValue";
import Simulation from "@/pages/Simulation";
import InventoryManagement from "@/pages/InventoryManagement";
import Pricing from "@/pages/Pricing";
import DataManagement from "@/pages/DataManagement";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/route-optimization" element={<RouteOptimization />} />
        <Route path="/network-optimization" element={<NetworkOptimization />} />
        <Route path="/center-of-gravity" element={<CenterOfGravity />} />
        <Route path="/heuristic-optimization" element={<Heuristic />} />
        <Route path="/isohedron-analysis" element={<Isohedron />} />
        <Route path="/business-value" element={<BusinessValue />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/data-management" element={<DataManagement />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
