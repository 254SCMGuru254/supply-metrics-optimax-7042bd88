
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
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="introduction" element={<Layout><Introduction /></Layout>} />
        <Route path="dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="analytics" element={<Layout><Analytics /></Layout>} />
        <Route path="data-input" element={<Layout><DataInput /></Layout>} />
        <Route path="kenya-supply-chain" element={<Layout><KenyaSupplyChain /></Layout>} />
        <Route path="demand-forecasting" element={<Layout><DemandForecasting /></Layout>} />
        <Route path="chat-assistant" element={<Layout><ChatAssistant /></Layout>} />
        <Route path="inventory-management" element={<Layout><InventoryManagement /></Layout>} />
        <Route path="route-optimization" element={<Layout><RouteOptimization /></Layout>} />
        <Route path="center-of-gravity" element={<Layout><CenterOfGravity /></Layout>} />
        <Route path="network-optimization" element={<Layout><NetworkOptimization /></Layout>} />
        <Route path="heuristic" element={<Layout><Heuristic /></Layout>} />
        <Route path="simulation" element={<Layout><Simulation /></Layout>} />
        <Route path="isohedron" element={<Layout><Isohedron /></Layout>} />
        <Route path="fleet-management" element={<Layout><FleetManagement /></Layout>} />
        <Route path="business-value" element={<Layout><BusinessValue /></Layout>} />
        <Route path="pricing" element={<Layout><Pricing /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
