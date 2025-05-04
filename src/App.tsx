
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "@/pages/Index";
import Introduction from "@/pages/Introduction";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import DataInput from "@/pages/DataInput";
import KenyaSupplyChain from "@/pages/KenyaSupplyChain";
import DemandForecasting from "@/pages/DemandForecasting";
import ChatAssistant from "@/pages/ChatAssistant";
import InventoryManagement from "@/pages/InventoryManagement";
import RouteOptimization from "@/pages/RouteOptimization";
import CenterOfGravity from "@/pages/CenterOfGravity";
import NetworkOptimization from "@/pages/NetworkOptimization";
import Heuristic from "@/pages/Heuristic";
import Simulation from "@/pages/Simulation";
import Isohedron from "@/pages/Isohedron";
import FleetManagement from "@/pages/FleetManagement";
import Pricing from "@/pages/Pricing";
import NotFound from "@/pages/NotFound";
import BusinessValue from "@/pages/BusinessValue";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="introduction" element={<Introduction />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="data-input" element={<DataInput />} />
          <Route path="kenya-supply-chain" element={<KenyaSupplyChain />} />
          <Route path="demand-forecasting" element={<DemandForecasting />} />
          <Route path="chat-assistant" element={<ChatAssistant />} />
          <Route path="inventory-management" element={<InventoryManagement />} />
          <Route path="route-optimization" element={<RouteOptimization />} />
          <Route path="center-of-gravity" element={<CenterOfGravity />} />
          <Route path="network-optimization" element={<NetworkOptimization />} />
          <Route path="heuristic" element={<Heuristic />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="isohedron" element={<Isohedron />} />
          <Route path="fleet-management" element={<FleetManagement />} />
          <Route path="business-value" element={<BusinessValue />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
