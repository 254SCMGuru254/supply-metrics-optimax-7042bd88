
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Factory, Route } from '@/components/map/MapTypes';
import { NetworkMap } from "@/components/NetworkMap";
import { 
  NetworkModel, 
  Factory as NetworkFactory, 
  Depot,
  Customer, 
  CostAnalysis 
} from '@/components/network-design/types/NetworkTypes';
import { 
  calculateNetworkCosts,
  calculateDepotThroughputs 
} from '@/components/network-design/utils/NetworkModelCalculator';
import { NetworkDesignForm } from '@/components/network-design/NetworkDesignForm';
import { CostBreakdown } from '@/components/network-design/CostBreakdown';

const NetworkDesign = () => {
  const [networkModel, setNetworkModel] = useState<NetworkModel>({
    factories: [],
    depots: [],
    customers: [],
    settings: {
      stockLevelDays: 15, // Default to half a month
      transitTimeDays: 3,
      monthlyHoldingRate: 0.02, // 2% default monthly holding rate
    }
  });
  
  const [costAnalysis, setCostAnalysis] = useState<CostAnalysis | null>(null);
  const { toast } = useToast();

  // Generate unique ID
  const generateId = (prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Add a factory to the network
  const handleAddFactory = (factory: Omit<NetworkFactory, 'id'>) => {
    const newFactory: NetworkFactory = {
      ...factory,
      id: generateId('factory'),
    };
    
    setNetworkModel(prev => ({
      ...prev,
      factories: [...prev.factories, newFactory]
    }));
    
    toast({
      title: "Factory Added",
      description: `${factory.name} added at [${factory.latitude.toFixed(4)}, ${factory.longitude.toFixed(4)}]`,
    });
  };

  // Add a depot to the network
  const handleAddDepot = (depot: Omit<Depot, 'id'>) => {
    const newDepot: Depot = {
      ...depot,
      id: generateId('depot'),
    };
    
    setNetworkModel(prev => ({
      ...prev,
      depots: [...prev.depots, newDepot]
    }));
    
    toast({
      title: "Depot Added",
      description: `${depot.name} added at [${depot.latitude.toFixed(4)}, ${depot.longitude.toFixed(4)}]`,
    });
  };

  // Add a customer to the network
  const handleAddCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId('customer'),
    };
    
    setNetworkModel(prev => ({
      ...prev,
      customers: [...prev.customers, newCustomer]
    }));
    
    toast({
      title: "Customer Added",
      description: `${customer.name} added at [${customer.latitude.toFixed(4)}, ${customer.longitude.toFixed(4)}]`,
    });
  };

  // Assign a customer to a depot
  const handleAssignCustomerToDepot = (customerId: string, depotId: string) => {
    setNetworkModel(prev => {
      const updatedCustomers = prev.customers.map(customer => 
        customer.id === customerId ? { ...customer, depotId } : customer
      );
      
      const updatedDepots = prev.depots.map(depot => {
        if (depot.id === depotId) {
          return {
            ...depot,
            servesCustomerIds: [
              ...depot.servesCustomerIds,
              customerId
            ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
          };
        }
        return depot;
      });
      
      return {
        ...prev,
        customers: updatedCustomers,
        depots: updatedDepots
      };
    });
  };

  // Assign a depot to a factory
  const handleAssignDepotToFactory = (depotId: string, factoryId: string) => {
    setNetworkModel(prev => {
      const updatedDepots = prev.depots.map(depot => 
        depot.id === depotId ? { ...depot, factoryId } : depot
      );
      
      return {
        ...prev,
        depots: updatedDepots
      };
    });
  };

  // Update network settings
  const handleUpdateSettings = (settings: NetworkModel['settings']) => {
    setNetworkModel(prev => ({
      ...prev,
      settings
    }));
  };

  // Calculate total network costs
  const handleAnalyzeNetwork = () => {
    if (networkModel.factories.length === 0) {
      toast({
        title: "Analysis Failed",
        description: "Please add at least one factory to your network.",
        variant: "destructive"
      });
      return;
    }
    
    if (networkModel.depots.length === 0) {
      toast({
        title: "Analysis Failed",
        description: "Please add at least one depot to your network.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate depot throughputs first
    const updatedModel = calculateDepotThroughputs(networkModel);
    setNetworkModel(updatedModel);
    
    // Calculate network costs
    const analysis = calculateNetworkCosts(updatedModel);
    setCostAnalysis(analysis);
    
    toast({
      title: "Network Analysis Complete",
      description: `Total network cost: $${analysis.totalCost.toFixed(2)}`,
    });
  };

  // Convert our network model to nodes and routes for the map
  const getMapNodes = () => {
    const nodes = [
      ...networkModel.factories.map(factory => ({
        id: factory.id,
        name: factory.name,
        latitude: factory.latitude,
        longitude: factory.longitude,
        type: 'factory' as const
      })),
      ...networkModel.depots.map(depot => ({
        id: depot.id,
        name: depot.name,
        latitude: depot.latitude,
        longitude: depot.longitude,
        type: 'warehouse' as const,
        throughput: depot.throughput
      })),
      ...networkModel.customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        latitude: customer.latitude,
        longitude: customer.longitude,
        type: 'customer' as const,
        demand: customer.demand
      }))
    ];
    
    return nodes;
  };

  // Generate routes between connected locations
  const getMapRoutes = () => {
    const routes: Route[] = [];
    
    // Factory to depot routes
    networkModel.depots.forEach(depot => {
      if (depot.factoryId) {
        const factory = networkModel.factories.find(f => f.id === depot.factoryId);
        if (factory) {
          routes.push({
            id: `route-${factory.id}-${depot.id}`,
            from: factory.id,
            to: depot.id,
            volume: depot.throughput,
            type: 'primary'
          });
        }
      }
    });
    
    // Depot to customer routes
    networkModel.customers.forEach(customer => {
      if (customer.depotId) {
        const depot = networkModel.depots.find(d => d.id === customer.depotId);
        if (depot) {
          routes.push({
            id: `route-${depot.id}-${customer.id}`,
            from: depot.id,
            to: customer.id,
            volume: customer.demand,
            type: 'secondary'
          });
        }
      }
    });
    
    return routes;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Physical Network Design</h1>
          <p className="text-muted-foreground mt-2">
            Design and optimize your supply chain network with cost analysis
          </p>
        </div>
        <div>
          <Button onClick={handleAnalyzeNetwork}>Calculate Network Costs</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-4">
          <NetworkMap
            nodes={getMapNodes()}
            routes={getMapRoutes()} 
          />
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="form">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="form">Add Locations</TabsTrigger>
              <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="space-y-4">
              <NetworkDesignForm
                networkModel={networkModel}
                onAddFactory={handleAddFactory}
                onAddDepot={handleAddDepot}
                onAddCustomer={handleAddCustomer}
                onAssignCustomerToDepot={handleAssignCustomerToDepot}
                onAssignDepotToFactory={handleAssignDepotToFactory}
                onUpdateSettings={handleUpdateSettings}
              />
            </TabsContent>
            <TabsContent value="analysis">
              <CostBreakdown costAnalysis={costAnalysis} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NetworkDesign;
