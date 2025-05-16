
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Factory, Depot, Customer, NetworkModel } from './types/NetworkTypes';
import { Building, Warehouse, User, Truck } from 'lucide-react';

interface NetworkDesignFormProps {
  networkModel: NetworkModel;
  onAddFactory: (factory: Omit<Factory, 'id'>) => void;
  onAddDepot: (depot: Omit<Depot, 'id'>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
  onAssignCustomerToDepot: (customerId: string, depotId: string) => void;
  onAssignDepotToFactory: (depotId: string, factoryId: string) => void;
  onUpdateSettings: (settings: NetworkModel['settings']) => void;
}

export const NetworkDesignForm: React.FC<NetworkDesignFormProps> = ({
  networkModel,
  onAddFactory,
  onAddDepot,
  onAddCustomer,
  onAssignCustomerToDepot,
  onAssignDepotToFactory,
  onUpdateSettings,
}) => {
  const [factoryForm, setFactoryForm] = useState<Omit<Factory, 'id'>>({
    name: '',
    latitude: 0,
    longitude: 0,
    type: 'factory',
    productionCost: 10
  });
  
  const [depotForm, setDepotForm] = useState<Omit<Depot, 'id'>>({
    name: '',
    latitude: 0,
    longitude: 0,
    type: 'depot',
    fixedCost: 500,
    throughput: 0,
    servesCustomerIds: []
  });
  
  const [customerForm, setCustomerForm] = useState<Omit<Customer, 'id'>>({
    name: '',
    latitude: 0,
    longitude: 0,
    type: 'customer',
    demand: 100
  });
  
  const [assignCustomerForm, setAssignCustomerForm] = useState({
    customerId: '',
    depotId: ''
  });
  
  const [assignDepotForm, setAssignDepotForm] = useState({
    depotId: '',
    factoryId: ''
  });
  
  const [settingsForm, setSettingsForm] = useState({
    stockLevelDays: networkModel.settings.stockLevelDays,
    transitTimeDays: networkModel.settings.transitTimeDays,
    monthlyHoldingRate: networkModel.settings.monthlyHoldingRate * 100 // Convert to percentage for display
  });
  
  const handleFactorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddFactory(factoryForm);
    setFactoryForm({
      name: '',
      latitude: 0,
      longitude: 0,
      type: 'factory',
      productionCost: 10
    });
  };
  
  const handleDepotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDepot(depotForm);
    setDepotForm({
      name: '',
      latitude: 0,
      longitude: 0,
      type: 'depot',
      fixedCost: 500,
      throughput: 0,
      servesCustomerIds: []
    });
  };
  
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer(customerForm);
    setCustomerForm({
      name: '',
      latitude: 0,
      longitude: 0,
      type: 'customer',
      demand: 100
    });
  };
  
  const handleAssignCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignCustomerToDepot(assignCustomerForm.customerId, assignCustomerForm.depotId);
    setAssignCustomerForm({
      customerId: '',
      depotId: ''
    });
  };
  
  const handleAssignDepot = (e: React.FormEvent) => {
    e.preventDefault();
    onAssignDepotToFactory(assignDepotForm.depotId, assignDepotForm.factoryId);
    setAssignDepotForm({
      depotId: '',
      factoryId: ''
    });
  };
  
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      stockLevelDays: settingsForm.stockLevelDays,
      transitTimeDays: settingsForm.transitTimeDays,
      monthlyHoldingRate: settingsForm.monthlyHoldingRate / 100 // Convert back to decimal
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="factory">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="factory">Factory</TabsTrigger>
          <TabsTrigger value="depot">Depot</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="factory" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <h3 className="text-lg font-medium">Add Factory</h3>
          </div>
          
          <form onSubmit={handleFactorySubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="factory-name">Name</Label>
                <Input 
                  id="factory-name" 
                  value={factoryForm.name} 
                  onChange={e => setFactoryForm(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Factory Name" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="factory-lat">Latitude</Label>
                  <Input 
                    id="factory-lat" 
                    type="number" 
                    step="0.0001" 
                    value={factoryForm.latitude || ''} 
                    onChange={e => setFactoryForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))} 
                    placeholder="Latitude" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="factory-lng">Longitude</Label>
                  <Input 
                    id="factory-lng" 
                    type="number" 
                    step="0.0001" 
                    value={factoryForm.longitude || ''} 
                    onChange={e => setFactoryForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))} 
                    placeholder="Longitude" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="production-cost">Production Cost</Label>
                <Input 
                  id="production-cost" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={factoryForm.productionCost || ''} 
                  onChange={e => setFactoryForm(prev => ({ ...prev, productionCost: parseFloat(e.target.value) }))} 
                  placeholder="Production Cost" 
                  required 
                />
              </div>
              
              <Button type="submit">Add Factory</Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="depot" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-5 w-5" />
            <h3 className="text-lg font-medium">Add Depot</h3>
          </div>
          
          <form onSubmit={handleDepotSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depot-name">Name</Label>
                <Input 
                  id="depot-name" 
                  value={depotForm.name} 
                  onChange={e => setDepotForm(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Depot Name" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="depot-lat">Latitude</Label>
                  <Input 
                    id="depot-lat" 
                    type="number" 
                    step="0.0001" 
                    value={depotForm.latitude || ''} 
                    onChange={e => setDepotForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))} 
                    placeholder="Latitude" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="depot-lng">Longitude</Label>
                  <Input 
                    id="depot-lng" 
                    type="number" 
                    step="0.0001" 
                    value={depotForm.longitude || ''} 
                    onChange={e => setDepotForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))} 
                    placeholder="Longitude" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fixed-cost">Fixed Cost (Weekly)</Label>
                <Input 
                  id="fixed-cost" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={depotForm.fixedCost || ''} 
                  onChange={e => setDepotForm(prev => ({ ...prev, fixedCost: parseFloat(e.target.value) }))} 
                  placeholder="Fixed Cost" 
                  required 
                />
              </div>
              
              <Button type="submit">Add Depot</Button>
            </div>
          </form>
          
          <div className="space-y-4 border-t pt-4 mt-4">
            <h4 className="text-sm font-medium">Assign Depot to Factory</h4>
            
            {networkModel.factories.length === 0 || networkModel.depots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add at least one factory and depot to make assignments
              </p>
            ) : (
              <form onSubmit={handleAssignDepot} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assign-depot">Depot</Label>
                  <Select
                    value={assignDepotForm.depotId}
                    onValueChange={value => setAssignDepotForm(prev => ({ ...prev, depotId: value }))}
                  >
                    <SelectTrigger id="assign-depot">
                      <SelectValue placeholder="Select Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      {networkModel.depots.map(depot => (
                        <SelectItem key={depot.id} value={depot.id}>{depot.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assign-factory">Factory</Label>
                  <Select
                    value={assignDepotForm.factoryId}
                    onValueChange={value => setAssignDepotForm(prev => ({ ...prev, factoryId: value }))}
                  >
                    <SelectTrigger id="assign-factory">
                      <SelectValue placeholder="Select Factory" />
                    </SelectTrigger>
                    <SelectContent>
                      {networkModel.factories.map(factory => (
                        <SelectItem key={factory.id} value={factory.id}>{factory.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" variant="outline">Assign</Button>
              </form>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <h3 className="text-lg font-medium">Add Customer</h3>
          </div>
          
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Name</Label>
                <Input 
                  id="customer-name" 
                  value={customerForm.name} 
                  onChange={e => setCustomerForm(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Customer Name" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-lat">Latitude</Label>
                  <Input 
                    id="customer-lat" 
                    type="number" 
                    step="0.0001" 
                    value={customerForm.latitude || ''} 
                    onChange={e => setCustomerForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))} 
                    placeholder="Latitude" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer-lng">Longitude</Label>
                  <Input 
                    id="customer-lng" 
                    type="number" 
                    step="0.0001" 
                    value={customerForm.longitude || ''} 
                    onChange={e => setCustomerForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))} 
                    placeholder="Longitude" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="demand">Weekly Demand</Label>
                <Input 
                  id="demand" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={customerForm.demand || ''} 
                  onChange={e => setCustomerForm(prev => ({ ...prev, demand: parseFloat(e.target.value) }))} 
                  placeholder="Demand" 
                  required 
                />
              </div>
              
              <Button type="submit">Add Customer</Button>
            </div>
          </form>
          
          <div className="space-y-4 border-t pt-4 mt-4">
            <h4 className="text-sm font-medium">Assign Customer to Depot</h4>
            
            {networkModel.customers.length === 0 || networkModel.depots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Add at least one customer and depot to make assignments
              </p>
            ) : (
              <form onSubmit={handleAssignCustomer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assign-customer">Customer</Label>
                  <Select
                    value={assignCustomerForm.customerId}
                    onValueChange={value => setAssignCustomerForm(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger id="assign-customer">
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {networkModel.customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assign-to-depot">Depot</Label>
                  <Select
                    value={assignCustomerForm.depotId}
                    onValueChange={value => setAssignCustomerForm(prev => ({ ...prev, depotId: value }))}
                  >
                    <SelectTrigger id="assign-to-depot">
                      <SelectValue placeholder="Select Depot" />
                    </SelectTrigger>
                    <SelectContent>
                      {networkModel.depots.map(depot => (
                        <SelectItem key={depot.id} value={depot.id}>{depot.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" variant="outline">Assign</Button>
              </form>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="p-4 mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Truck className="h-5 w-5" />
          <h3 className="text-lg font-medium">Network Settings</h3>
        </div>
        
        <form onSubmit={handleSettingsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock-level">Average Stock Level (days)</Label>
              <Input 
                id="stock-level" 
                type="number" 
                min="1" 
                value={settingsForm.stockLevelDays} 
                onChange={e => setSettingsForm(prev => ({ ...prev, stockLevelDays: parseInt(e.target.value) }))} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transit-time">Transit Time (days)</Label>
              <Input 
                id="transit-time" 
                type="number" 
                min="0" 
                value={settingsForm.transitTimeDays} 
                onChange={e => setSettingsForm(prev => ({ ...prev, transitTimeDays: parseInt(e.target.value) }))} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="holding-rate">Monthly Holding Rate (%)</Label>
              <Input 
                id="holding-rate" 
                type="number" 
                min="0" 
                step="0.1" 
                value={settingsForm.monthlyHoldingRate} 
                onChange={e => setSettingsForm(prev => ({ ...prev, monthlyHoldingRate: parseFloat(e.target.value) }))} 
                required 
              />
            </div>
          </div>
          
          <Button type="submit" variant="outline">Update Settings</Button>
        </form>
      </Card>
    </div>
  );
};
