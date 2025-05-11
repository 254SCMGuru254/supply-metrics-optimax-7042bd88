
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import RouteOptimization from '@/pages/RouteOptimization';
import InventoryManagement from '@/pages/InventoryManagement';
import NetworkOptimization from '@/pages/NetworkOptimization';
import CenterOfGravity from '@/pages/CenterOfGravity';
import Heuristic from '@/pages/Heuristic';
import BusinessValue from '@/pages/BusinessValue';
import Simulation from '@/pages/Simulation';
import KenyaSupplyChain from '@/pages/KenyaSupplyChain';
import Index from '@/pages/Index';
import Analytics from '@/pages/Analytics';
import Isohedron from '@/pages/Isohedron';
import DataInput from '@/pages/DataInput';
import Onboarding from '@/pages/Onboarding';
import FleetManagement from '@/pages/FleetManagement';
import DemandForecasting from '@/pages/DemandForecasting';
import Introduction from '@/pages/Introduction';
import ChatAssistant from '@/pages/ChatAssistant';
import DesignAssistant from '@/pages/DesignAssistant';
import { Outlet } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/introduction" element={<Introduction />} />
      <Route path="/" element={<Layout><Outlet /></Layout>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/route-optimization" element={<RouteOptimization />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/network-optimization" element={<NetworkOptimization />} />
        <Route path="/center-of-gravity" element={<CenterOfGravity />} />
        <Route path="/heuristic" element={<Heuristic />} />
        <Route path="/business-value" element={<BusinessValue />} />
        <Route path="/simulation" element={<Simulation />} />
        <Route path="/kenya-supply-chain" element={<KenyaSupplyChain />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/isohedron" element={<Isohedron />} />
        <Route path="/data-input" element={<DataInput />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/fleet-management" element={<FleetManagement />} />
        <Route path="/demand-forecasting" element={<DemandForecasting />} />
        <Route path="/chat-assistant" element={<ChatAssistant />} />
        <Route path="/design-assistant" element={<DesignAssistant />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
