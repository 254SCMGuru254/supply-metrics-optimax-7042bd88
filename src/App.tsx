
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import DataInput from "./pages/DataInput";
import CenterOfGravity from "./pages/CenterOfGravity";
import NetworkOptimization from "./pages/NetworkOptimization";
import Heuristic from "./pages/Heuristic";
import Isohedron from "./pages/Isohedron";
import Simulation from "./pages/Simulation";
import Analytics from "./pages/Analytics";
import ChatAssistant from "./pages/ChatAssistant";
import KenyaSupplyChain from "./pages/KenyaSupplyChain";
import RouteOptimization from "./pages/RouteOptimization";
import Dashboard from "./pages/Dashboard";
import Introduction from "./pages/Introduction";
import DemandForecasting from "./pages/DemandForecasting";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Index />} />
          <Route path="introduction" element={<Introduction />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="onboarding/*" element={<Onboarding />} />
          <Route path="data-input" element={<DataInput />} />
          <Route path="center-of-gravity" element={<CenterOfGravity />} />
          <Route path="network-optimization" element={<NetworkOptimization />} />
          <Route path="route-optimization" element={<RouteOptimization />} />
          <Route path="demand-forecasting" element={<DemandForecasting />} />
          <Route path="heuristic" element={<Heuristic />} />
          <Route path="isohedron" element={<Isohedron />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="chat-assistant" element={<ChatAssistant />} />
          <Route path="kenya-supply-chain" element={<KenyaSupplyChain />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
