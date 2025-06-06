import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NetworkMap, Node } from "@/components/NetworkMap";
import { Warehouse, Layers, Thermometer, MapPin } from "lucide-react";

export type WarehouseConfigProps = {
  onSubmit?: (data: WarehouseConfigData) => void;
};

export type WarehouseConfigData = {
  warehouseType: "storage" | "cross-docking" | "transhipment" | "value-added";
  automationLevel: "manual" | "semi-automated" | "fully-automated";
  coldChain: {
    enabled: boolean;
    temperatureRange: [number, number];
    energyCost: number;
    compliantStandards: string[];
  };
  location: {
    latitude: number;
    longitude: number;
    proximityScores: {
      highways: number;
      ports: number;
      demandHubs: number;
    };
  };
};

export const WarehouseConfigContent = ({ onSubmit }: WarehouseConfigProps) => {
  const [warehouseConfig, setWarehouseConfig] = useState<WarehouseConfigData>({
    warehouseType: "storage",
    automationLevel: "semi-automated",
    coldChain: {
      enabled: false,
      temperatureRange: [2, 8],
      energyCost: 2.5,
      compliantStandards: ["FDA"],
    },
    location: {
      latitude: 39.8283,
      longitude: -98.5795,
      proximityScores: {
        highways: 8,
        ports: 5,
        demandHubs: 7,
      },
    },
  });

  const [nodes, setNodes] = useState<Node[]>([]);

  const handleTypeChange = (value: "storage" | "cross-docking" | "transhipment" | "value-added") => {
    setWarehouseConfig({
      ...warehouseConfig,
      warehouseType: value,
    });
  };

  const handleAutomationChange = (value: "manual" | "semi-automated" | "fully-automated") => {
    setWarehouseConfig({
      ...warehouseConfig,
      automationLevel: value,
    });
  };

  const handleColdChainToggle = (enabled: boolean) => {
    setWarehouseConfig({
      ...warehouseConfig,
      coldChain: {
        ...warehouseConfig.coldChain,
        enabled,
      },
    });
  };

  const handleTemperatureChange = (values: number[]) => {
    setWarehouseConfig({
      ...warehouseConfig,
      coldChain: {
        ...warehouseConfig.coldChain,
        temperatureRange: [values[0], values[1]],
      },
    });
  };

  const handleEnergyCostChange = (value: number) => {
    setWarehouseConfig({
      ...warehouseConfig,
      coldChain: {
        ...warehouseConfig.coldChain,
        energyCost: value,
      },
    });
  };

  const handleStandardsChange = (value: string) => {
    let standards = [...warehouseConfig.coldChain.compliantStandards];
    
    if (standards.includes(value)) {
      standards = standards.filter(s => s !== value);
    } else {
      standards.push(value);
    }
    
    setWarehouseConfig({
      ...warehouseConfig,
      coldChain: {
        ...warehouseConfig.coldChain,
        compliantStandards: standards,
      },
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    // Update location and generate random proximity scores based on the selected location
    setWarehouseConfig({
      ...warehouseConfig,
      location: {
        latitude: lat,
        longitude: lng,
        proximityScores: {
          highways: Math.round(Math.random() * 5) + 5, // 5-10
          ports: Math.round(Math.random() * 10),      // 0-10
          demandHubs: Math.round(Math.random() * 5) + 3, // 3-8
        },
      },
    });
    
    // Add a warehouse node at this location
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "warehouse",
      name: "Proposed Warehouse",
      latitude: lat,
      longitude: lng,
      capacity: 50000,
    };
    
    setNodes([newNode]);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(warehouseConfig);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="type" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="type">Type Selection</TabsTrigger>
          <TabsTrigger value="automation">Automation Level</TabsTrigger>
          <TabsTrigger value="coldchain">Cold Chain Tools</TabsTrigger>
          <TabsTrigger value="location">Location Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="type" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Warehouse Type Selection
              </CardTitle>
              <CardDescription>
                Select the primary operational function of your warehouse facility.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={warehouseConfig.warehouseType}
                onValueChange={(value: "storage" | "cross-docking" | "transhipment" | "value-added") => handleTypeChange(value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="storage" id="storage" className="peer sr-only" />
                  <Label
                    htmlFor="storage"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Storage Warehouse</h3>
                      <p className="text-sm text-muted-foreground">
                        Long-term inventory storage with substantial racking systems
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="cross-docking" id="cross-docking" className="peer sr-only" />
                  <Label
                    htmlFor="cross-docking"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Cross-Docking Facility</h3>
                      <p className="text-sm text-muted-foreground">
                        Minimal storage with focus on rapid transfer between vehicles
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="transhipment" id="transhipment" className="peer sr-only" />
                  <Label
                    htmlFor="transhipment"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Transhipment Hub</h3>
                      <p className="text-sm text-muted-foreground">
                        Modal transfer point between different transportation methods
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="value-added" id="value-added" className="peer sr-only" />
                  <Label
                    htmlFor="value-added"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="font-semibold">Value-Added Services</h3>
                      <p className="text-sm text-muted-foreground">
                        Includes packaging, kitting, light assembly or customization
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Automation Level
              </CardTitle>
              <CardDescription>
                Select the level of automation for your warehouse operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={warehouseConfig.automationLevel}
                onValueChange={(value: "manual" | "semi-automated" | "fully-automated") => handleAutomationChange(value)}
                className="grid grid-cols-1 gap-4"
              >
                <div>
                  <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
                  <Label
                    htmlFor="manual"
                    className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">Manual Operation</h3>
                      <p className="text-sm text-muted-foreground">
                        Primarily human-operated with basic equipment like forklifts and pallet jacks.
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Investment Cost:</span> Low
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Labor Cost:</span> High
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="semi-automated" id="semi-automated" className="peer sr-only" />
                  <Label
                    htmlFor="semi-automated"
                    className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">Semi-Automated Operation</h3>
                      <p className="text-sm text-muted-foreground">
                        Mix of automated systems and manual labor. Includes conveyor systems, sorters, and WMS.
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Investment Cost:</span> Medium
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Labor Cost:</span> Medium
                      </p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="fully-automated" id="fully-automated" className="peer sr-only" />
                  <Label
                    htmlFor="fully-automated"
                    className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">Fully Automated Operation</h3>
                      <p className="text-sm text-muted-foreground">
                        Extensive automation including AS/RS systems, robotic picking, and AI-driven operations.
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Investment Cost:</span> High
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Labor Cost:</span> Low
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coldchain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Cold Chain Configuration
              </CardTitle>
              <CardDescription>
                Configure temperature-controlled storage requirements and compliance standards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="coldchain-enabled"
                  checked={warehouseConfig.coldChain.enabled}
                  onCheckedChange={handleColdChainToggle}
                />
                <Label htmlFor="coldchain-enabled">Enable Cold Chain Storage</Label>
              </div>
              
              {warehouseConfig.coldChain.enabled && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Temperature Range (°C)</Label>
                      <span className="text-sm">
                        {warehouseConfig.coldChain.temperatureRange[0]}°C to {warehouseConfig.coldChain.temperatureRange[1]}°C
                      </span>
                    </div>
                    <Slider 
                      min={-30} 
                      max={30} 
                      step={1} 
                      value={warehouseConfig.coldChain.temperatureRange}
                      onValueChange={handleTemperatureChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="energyCost">Energy Cost ($ per kWh)</Label>
                    <Input
                      id="energyCost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={warehouseConfig.coldChain.energyCost}
                      onChange={(e) => handleEnergyCostChange(parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label>Compliance Standards</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["FDA", "USDA", "FSMA", "EU GDP", "WHO", "HACCP"].map((standard) => (
                        <div key={standard} className="flex items-center space-x-2">
                          <Switch
                            id={`standard-${standard}`}
                            checked={warehouseConfig.coldChain.compliantStandards.includes(standard)}
                            onCheckedChange={() => handleStandardsChange(standard)}
                          />
                          <Label htmlFor={`standard-${standard}`}>{standard}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Analysis
              </CardTitle>
              <CardDescription>
                Evaluate warehouse locations based on proximity to key transportation and demand nodes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-[400px] border rounded-md overflow-hidden">
                <NetworkMap
                  nodes={nodes}
                  routes={[]}
                  onMapClick={handleLocationSelect}
                />
              </div>
              
              <p className="text-sm text-center text-muted-foreground">
                Click on the map to select a potential warehouse location
              </p>
              
              {nodes.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Proximity Scores (0-10)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Highways</p>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${warehouseConfig.location.proximityScores.highways * 10}%` }}
                          ></div>
                        </div>
                        <span>{warehouseConfig.location.proximityScores.highways}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ports</p>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${warehouseConfig.location.proximityScores.ports * 10}%` }}
                          ></div>
                        </div>
                        <span>{warehouseConfig.location.proximityScores.ports}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Demand Hubs</p>
                      <div className="flex items-center">
                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary rounded-full h-2" 
                            style={{ width: `${warehouseConfig.location.proximityScores.demandHubs * 10}%` }}
                          ></div>
                        </div>
                        <span>{warehouseConfig.location.proximityScores.demandHubs}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Coordinates</p>
                    <p>
                      Lat: {warehouseConfig.location.latitude.toFixed(4)}, 
                      Lng: {warehouseConfig.location.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSubmit} className="w-full">
        Save Warehouse Configuration
      </Button>
    </div>
  );
};
