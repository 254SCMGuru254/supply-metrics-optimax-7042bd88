
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, TruckIcon, CoinsIcon, GaugeIcon, ScaleIcon } from "lucide-react";

export type FleetManagementProps = {
  onSubmit?: (data: FleetData) => void;
};

export type FleetData = {
  ownershipModel: "owned" | "outsourced" | "mixed";
  vehicleCount: number;
  fuelCost: number;
  driverWages: number;
  maintenanceCost: number;
  depreciationRate: number;
  tonnageCapacity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  speedLimit: number;
  complianceAlerts: {
    tonnageRestrictions: boolean;
    emissionsStandards: boolean;
    driverHours: boolean;
    safetyInspections: boolean;
  };
};

export const FleetManagementContent = ({ onSubmit }: FleetManagementProps) => {
  const [fleetData, setFleetData] = useState<FleetData>({
    ownershipModel: "owned",
    vehicleCount: 10,
    fuelCost: 4.50,
    driverWages: 25,
    maintenanceCost: 0.15,
    depreciationRate: 15,
    tonnageCapacity: 24,
    dimensions: {
      length: 53,
      width: 8.5,
      height: 13.5,
    },
    speedLimit: 65,
    complianceAlerts: {
      tonnageRestrictions: true,
      emissionsStandards: true,
      driverHours: true,
      safetyInspections: true,
    },
  });

  const [calculatedCosts, setCalculatedCosts] = useState({
    fuelCostPerMile: 0,
    laborCostPerMile: 0,
    maintenanceCostPerMile: 0,
    depreciationCostPerMile: 0,
    totalCostPerMile: 0,
    totalAnnualCost: 0,
  });

  const handleInputChange = (field: keyof FleetData, value: any) => {
    setFleetData({
      ...fleetData,
      [field]: value,
    });
  };

  const handleComplianceChange = (field: keyof FleetData["complianceAlerts"], value: boolean) => {
    setFleetData({
      ...fleetData,
      complianceAlerts: {
        ...fleetData.complianceAlerts,
        [field]: value,
      },
    });
  };

  const handleDimensionChange = (field: keyof FleetData["dimensions"], value: number) => {
    setFleetData({
      ...fleetData,
      dimensions: {
        ...fleetData.dimensions,
        [field]: value,
      },
    });
  };

  const calculateCosts = () => {
    // This is a simplified cost calculation
    const milesPerGallon = 6.5; // Average for heavy trucks
    const annualMiles = 100000; // Assumption
    
    const fuelCostPerMile = fleetData.fuelCost / milesPerGallon;
    const laborCostPerMile = fleetData.driverWages / 50; // Assuming 50 miles per hour
    const maintenanceCostPerMile = fleetData.maintenanceCost;
    const depreciationCostPerMile = (fleetData.depreciationRate / 100 * 150000) / annualMiles; // Assuming $150k truck value
    
    const totalCostPerMile = fuelCostPerMile + laborCostPerMile + maintenanceCostPerMile + depreciationCostPerMile;
    const totalAnnualCost = totalCostPerMile * annualMiles * fleetData.vehicleCount;
    
    setCalculatedCosts({
      fuelCostPerMile,
      laborCostPerMile,
      maintenanceCostPerMile,
      depreciationCostPerMile,
      totalCostPerMile,
      totalAnnualCost,
    });
  };

  const handleSubmit = () => {
    calculateCosts();
    if (onSubmit) {
      onSubmit(fleetData);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ownership" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="ownership">Ownership Model</TabsTrigger>
          <TabsTrigger value="cost">Cost Calculator</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Constraints</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="ownership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TruckIcon className="h-5 w-5" />
                Ownership Model
              </CardTitle>
              <CardDescription>
                Select whether your fleet is owned by your company, outsourced to third parties, or a mixed model.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={fleetData.ownershipModel === "owned" ? "default" : "outline"}
                  className="flex-col h-20"
                  onClick={() => handleInputChange("ownershipModel", "owned")}
                >
                  <span>Owned</span>
                  <span className="text-xs text-muted-foreground mt-1">Company Assets</span>
                </Button>
                <Button
                  variant={fleetData.ownershipModel === "outsourced" ? "default" : "outline"}
                  className="flex-col h-20"
                  onClick={() => handleInputChange("ownershipModel", "outsourced")}
                >
                  <span>Outsourced</span>
                  <span className="text-xs text-muted-foreground mt-1">Third Party</span>
                </Button>
                <Button
                  variant={fleetData.ownershipModel === "mixed" ? "default" : "outline"}
                  className="flex-col h-20"
                  onClick={() => handleInputChange("ownershipModel", "mixed")}
                >
                  <span>Mixed</span>
                  <span className="text-xs text-muted-foreground mt-1">Hybrid Approach</span>
                </Button>
              </div>

              <div>
                <Label htmlFor="vehicleCount">Vehicle Count</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="vehicleCount" 
                    min={1} 
                    max={100} 
                    step={1} 
                    value={[fleetData.vehicleCount]}
                    onValueChange={(value) => handleInputChange("vehicleCount", value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-right">{fleetData.vehicleCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CoinsIcon className="h-5 w-5" />
                Cost Calculator
              </CardTitle>
              <CardDescription>
                Calculate operating costs for your fleet based on various factors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuelCost">Fuel Cost ($ per gallon)</Label>
                  <Input
                    id="fuelCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={fleetData.fuelCost}
                    onChange={(e) => handleInputChange("fuelCost", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="driverWages">Driver Wages ($ per hour)</Label>
                  <Input
                    id="driverWages"
                    type="number"
                    step="0.01"
                    min="0"
                    value={fleetData.driverWages}
                    onChange={(e) => handleInputChange("driverWages", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maintenanceCost">Maintenance Cost ($ per mile)</Label>
                  <Input
                    id="maintenanceCost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={fleetData.maintenanceCost}
                    onChange={(e) => handleInputChange("maintenanceCost", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="depreciationRate">Depreciation Rate (% per year)</Label>
                  <Input
                    id="depreciationRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={fleetData.depreciationRate}
                    onChange={(e) => handleInputChange("depreciationRate", parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={calculateCosts} className="w-full">Calculate Costs</Button>
              
              {calculatedCosts.totalCostPerMile > 0 && (
                <Card className="mt-4 bg-muted">
                  <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel Cost</p>
                        <p className="text-lg font-semibold">${calculatedCosts.fuelCostPerMile.toFixed(2)}/mile</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Labor Cost</p>
                        <p className="text-lg font-semibold">${calculatedCosts.laborCostPerMile.toFixed(2)}/mile</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maintenance</p>
                        <p className="text-lg font-semibold">${calculatedCosts.maintenanceCostPerMile.toFixed(2)}/mile</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Depreciation</p>
                        <p className="text-lg font-semibold">${calculatedCosts.depreciationCostPerMile.toFixed(2)}/mile</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Per Mile</p>
                        <p className="text-lg font-semibold">${calculatedCosts.totalCostPerMile.toFixed(2)}/mile</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Fleet Cost</p>
                        <p className="text-lg font-semibold">${calculatedCosts.totalAnnualCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScaleIcon className="h-5 w-5" />
                Capacity Constraints
              </CardTitle>
              <CardDescription>
                Configure dimensions, weight limits, and speed parameters for your fleet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tonnageCapacity">Tonnage Capacity</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="tonnageCapacity" 
                    min={1} 
                    max={50} 
                    step={0.5} 
                    value={[fleetData.tonnageCapacity]}
                    onValueChange={(value) => handleInputChange("tonnageCapacity", value[0])}
                    className="flex-1"
                  />
                  <span className="w-16 text-right">{fleetData.tonnageCapacity} tons</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="length">Length (ft)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={fleetData.dimensions.length}
                    onChange={(e) => handleDimensionChange("length", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="width">Width (ft)</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={fleetData.dimensions.width}
                    onChange={(e) => handleDimensionChange("width", parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (ft)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={fleetData.dimensions.height}
                    onChange={(e) => handleDimensionChange("height", parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="speedLimit">Speed Limit (mph)</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="speedLimit" 
                    min={45} 
                    max={75} 
                    step={1} 
                    value={[fleetData.speedLimit]}
                    onValueChange={(value) => handleInputChange("speedLimit", value[0])}
                    className="flex-1"
                  />
                  <span className="w-16 text-right">{fleetData.speedLimit} mph</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Compliance Alerts
              </CardTitle>
              <CardDescription>
                Configure which compliance alerts to monitor for your fleet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="tonnageRestrictions"
                  checked={fleetData.complianceAlerts.tonnageRestrictions}
                  onCheckedChange={(checked) => handleComplianceChange("tonnageRestrictions", checked)}
                />
                <Label htmlFor="tonnageRestrictions">Tonnage Restrictions per Corridor</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="emissionsStandards"
                  checked={fleetData.complianceAlerts.emissionsStandards}
                  onCheckedChange={(checked) => handleComplianceChange("emissionsStandards", checked)}
                />
                <Label htmlFor="emissionsStandards">Emissions Standards</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="driverHours"
                  checked={fleetData.complianceAlerts.driverHours}
                  onCheckedChange={(checked) => handleComplianceChange("driverHours", checked)}
                />
                <Label htmlFor="driverHours">Driver Hours of Service</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="safetyInspections"
                  checked={fleetData.complianceAlerts.safetyInspections}
                  onCheckedChange={(checked) => handleComplianceChange("safetyInspections", checked)}
                />
                <Label htmlFor="safetyInspections">Safety Inspections</Label>
              </div>

              {fleetData.complianceAlerts.tonnageRestrictions && (
                <Alert>
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Tonnage Restriction Alert</AlertTitle>
                  <AlertDescription>
                    Your fleet's tonnage capacity of {fleetData.tonnageCapacity} tons may exceed limits on certain corridors.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSubmit} className="w-full">
        Save Fleet Management Configuration
      </Button>
    </div>
  );
};
