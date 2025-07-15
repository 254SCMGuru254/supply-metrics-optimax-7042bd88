
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { MainLayout } from '@/components/layout/MainLayout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import DataInput from '@/pages/DataInput';
import CenterOfGravity from '@/pages/CenterOfGravity';
import RouteOptimization from '@/pages/RouteOptimization';
import NetworkDesign from '@/pages/NetworkDesign';
import NetworkFlow from '@/pages/NetworkFlow';
import NetworkOptimization from '@/pages/NetworkOptimization';
import InventoryManagement from '@/pages/InventoryManagement';
import CostModeling from '@/pages/CostModeling';
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import Documentation from '@/pages/Documentation';
import Isohedron from '@/pages/Isohedron';
import Auth from '@/pages/Auth';
import Support from '@/pages/Support';
import Simulation from '@/pages/Simulation';
import ChatAssistant from '@/pages/ChatAssistant';
import Pricing from '@/pages/Pricing';
import KenyaSupplyChain from '@/pages/KenyaSupplyChain';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/support" element={<Support />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/kenya-supply-chain" element={<KenyaSupplyChain />} />
              <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
              <Route path="/data-input/:projectId" element={<MainLayout><DataInput /></MainLayout>} />
              <Route path="/center-of-gravity/:projectId" element={<MainLayout><CenterOfGravity /></MainLayout>} />
              <Route path="/route-optimization/:projectId" element={<MainLayout><RouteOptimization /></MainLayout>} />
              <Route path="/network-design/:projectId" element={<MainLayout><NetworkDesign /></MainLayout>} />
              <Route path="/network-flow/:projectId" element={<MainLayout><NetworkFlow /></MainLayout>} />
              <Route path="/network-optimization/:projectId" element={<MainLayout><NetworkOptimization /></MainLayout>} />
              <Route path="/inventory-management/:projectId" element={<MainLayout><InventoryManagement /></MainLayout>} />
              <Route path="/cost-modeling/:projectId" element={<MainLayout><CostModeling /></MainLayout>} />
              <Route path="/analytics-dashboard/:projectId" element={<MainLayout><AnalyticsDashboard /></MainLayout>} />
              <Route path="/simulation/:projectId" element={<MainLayout><Simulation /></MainLayout>} />
              <Route path="/chat-assistant" element={<MainLayout><ChatAssistant /></MainLayout>} />
              <Route path="/documentation" element={<MainLayout><Documentation /></MainLayout>} />
              <Route path="/isohedron/:projectId" element={<MainLayout><Isohedron /></MainLayout>} />
            </Routes>
            <Toaster />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
