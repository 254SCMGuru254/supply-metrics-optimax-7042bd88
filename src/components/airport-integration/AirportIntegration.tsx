import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { NetworkMap } from '@/components/NetworkMap';
import { Loader2, Plus, Save, Search, Trash } from 'lucide-react';
import { TimePickerDemo } from '@/components/ui/time-picker-demo';

type AirportNode = Database['public']['Tables']['airport_nodes']['Row'];
type SupplyChainNetwork = Database['public']['Tables']['supply_chain_networks']['Row'];

export function AirportIntegration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [networks, setNetworks] = useState<SupplyChainNetwork[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [airports, setAirports] = useState<AirportNode[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // New airport form state
  const [newAirport, setNewAirport] = useState({
    name: '',
    iata_code: '',
    location: { lat: 0, lng: 0 },
    capacity: 1000,
    operation_hours: { open: '06:00', close: '22:00' }
  });
  
  // Load user's networks and airports
  useEffect(() => {
    if (user) {
      loadNetworks();
      loadAirports();
    }
  }, [user]);
  
  const loadNetworks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('supply_chain_networks')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setNetworks(data || []);
      if (data && data.length > 0) {
        setSelectedNetwork(data[0].id);
      }
    } catch (error) {
      console.error('Error loading networks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your supply chain networks.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadAirports = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('airport_nodes')
        .select('*')
        .eq('user_id', user?.id);
        
      if (error) throw error;
      setAirports(data || []);
    } catch (error) {
      console.error('Error loading airports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your airport nodes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const searchAirports = async () => {
    if (!searchQuery) {
      toast({
        title: 'Error',
        description: 'Please enter a search term.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSearching(true);
      
      // In a real implementation, this would call an external API
      // For now, we'll simulate a search result
      setTimeout(() => {
        const mockResults = [
          { 
            name: 'Jomo Kenyatta International Airport', 
            iata: 'NBO', 
            city: 'Nairobi',
            country: 'Kenya',
            location: { lat: -1.319167, lng: 36.9275 }
          },
          { 
            name: 'Moi International Airport', 
            iata: 'MBA', 
            city: 'Mombasa',
            country: 'Kenya',
            location: { lat: -4.034833, lng: 39.594333 }
          },
          { 
            name: 'Kisumu International Airport', 
            iata: 'KIS', 
            city: 'Kisumu',
            country: 'Kenya',
            location: { lat: -0.086139, lng: 34.728892 }
          },
          { 
            name: 'Eldoret International Airport', 
            iata: 'EDL', 
            city: 'Eldoret',
            country: 'Kenya',
            location: { lat: 0.404458, lng: 35.238928 }
          }
        ].filter(airport => 
          airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          airport.iata.toLowerCase().includes(searchQuery.toLowerCase()) ||
          airport.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(mockResults);
        setIsSearching(false);
        
        if (mockResults.length === 0) {
          toast({
            title: 'No Results',
            description: 'No airports found matching your search.',
          });
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error searching airports:', error);
      toast({
        title: 'Error',
        description: 'Failed to search for airports.',
        variant: 'destructive',
      });
      setIsSearching(false);
    }
  };
  
  const createAirport = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add an airport.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('airport_nodes')
        .insert({
          name: newAirport.name,
          iata_code: newAirport.iata_code,
          location: newAirport.location,
          capacity: newAirport.capacity,
          operation_hours: newAirport.operation_hours,
          user_id: user.id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Airport node added successfully.',
      });
      
      // Reset form and reload airports
      setNewAirport({
        name: '',
        iata_code: '',
        location: { lat: 0, lng: 0 },
        capacity: 1000,
        operation_hours: { open: '06:00', close: '22:00' }
      });
      
      loadAirports();
      
    } catch (error) {
      console.error('Error adding airport:', error);
      toast({
        title: 'Error',
        description: 'Failed to add airport node.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addFromSearch = (airport: any) => {
    setNewAirport({
      name: airport.name,
      iata_code: airport.iata,
      location: airport.location,
      capacity: 1000,
      operation_hours: { open: '06:00', close: '22:00' }
    });
    
    // Switch to the add tab
    document.querySelector('[data-value="add"]')?.click();
  };
  
  const deleteAirport = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('airport_nodes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Airport node deleted successfully.',
      });
      
      // Reload airports
      loadAirports();
      
    } catch (error) {
      console.error('Error deleting airport:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete airport node.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Find the currently selected network for visualization
  const currentNetwork = networks.find(n => n.id === selectedNetwork);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Airport Integration</h1>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search Airports</TabsTrigger>
          <TabsTrigger value="add">Add Airport</TabsTrigger>
          <TabsTrigger value="manage">Manage Airports</TabsTrigger>
        </TabsList>
        
        {/* Search Airports Tab */}
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Global Airports</CardTitle>
              <CardDescription>
                Search for airports to add to your supply chain network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search by airport name, IATA code, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchAirports()}
                  className="flex-1"
                />
                <Button onClick={searchAirports} disabled={isSearching}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Airport Name</TableHead>
                        <TableHead>IATA Code</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResults.map((airport, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{airport.name}</TableCell>
                          <TableCell>{airport.iata}</TableCell>
                          <TableCell>{airport.city}, {airport.country}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => addFromSearch(airport)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Add Airport Tab */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Airport Node</CardTitle>
              <CardDescription>
                Add a new airport node to your supply chain network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Airport Name</Label>
                    <Input
                      id="name"
                      value={newAirport.name}
                      onChange={(e) => setNewAirport({ ...newAirport, name: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="iata_code">IATA Code</Label>
                    <Input
                      id="iata_code"
                      value={newAirport.iata_code}
                      onChange={(e) => setNewAirport({ ...newAirport, iata_code: e.target.value })}
                      disabled={isLoading}
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="capacity">Capacity (Tons/Day)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newAirport.capacity}
                      onChange={(e) => setNewAirport({ ...newAirport, capacity: parseInt(e.target.value) })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={newAirport.location.lat}
                      onChange={(e) => setNewAirport({ 
                        ...newAirport, 
                        location: { 
                          ...newAirport.location, 
                          lat: parseFloat(e.target.value) 
                        } 
                      })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={newAirport.location.lng}
                      onChange={(e) => setNewAirport({ 
                        ...newAirport, 
                        location: { 
                          ...newAirport.location, 
                          lng: parseFloat(e.target.value) 
                        } 
                      })}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="open_time">Opening Time</Label>
                      <Input
                        id="open_time"
                        type="time"
                        value={newAirport.operation_hours.open}
                        onChange={(e) => setNewAirport({ 
                          ...newAirport, 
                          operation_hours: { 
                            ...newAirport.operation_hours, 
                            open: e.target.value 
                          } 
                        })}
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="close_time">Closing Time</Label>
                      <Input
                        id="close_time"
                        type="time"
                        value={newAirport.operation_hours.close}
                        onChange={(e) => setNewAirport({ 
                          ...newAirport, 
                          operation_hours: { 
                            ...newAirport.operation_hours, 
                            close: e.target.value 
                          } 
                        })}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={createAirport} 
                disabled={isLoading || !newAirport.name || !newAirport.iata_code}
                className="ml-auto"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Add Airport
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Manage Airports Tab */}
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Airport Nodes</CardTitle>
              <CardDescription>
                View and manage your airport nodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {airports.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Airport Name</TableHead>
                        <TableHead>IATA Code</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Operation Hours</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {airports.map((airport) => (
                        <TableRow key={airport.id}>
                          <TableCell className="font-medium">{airport.name}</TableCell>
                          <TableCell>{airport.iata_code}</TableCell>
                          <TableCell>{airport.capacity} tons/day</TableCell>
                          <TableCell>
                            {airport.operation_hours.open} - {airport.operation_hours.close}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteAirport(airport.id)}
                              disabled={isLoading}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No airport nodes added yet.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => document.querySelector('[data-value="search"]')?.click()}
                  >
                    Search for Airports
                  </Button>
                </div>
              )}
              
              {currentNetwork && airports.length > 0 && (
                <div className="border rounded-md mt-6 h-[300px] overflow-hidden">
                  <NetworkMap 
                    network={currentNetwork}
                    airportNodes={airports}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
