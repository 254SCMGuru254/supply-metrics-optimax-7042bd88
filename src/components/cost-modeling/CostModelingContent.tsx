
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart4, 
  DollarSign, 
  Package, 
  Truck, 
  Warehouse, 
  AlertTriangle
} from "lucide-react";

export const CostModelingContent = () => {
  const [activeTab, setActiveTab] = useState("tco");
  const [isCalculating, setIsCalculating] = useState(false);
  const [costType, setCostType] = useState<"own" | "outsource">("own");
  const [assetType, setAssetType] = useState<"fleet" | "warehouse">("fleet");
  const { toast } = useToast();
  
  // TCO Inputs
  const [tcoInputs, setTcoInputs] = useState({
    assetCost: 100000,
    lifespan: 5,
    maintenanceCost: 8000,
    operatingCost: 25000,
    insuranceCost: 5000,
    taxesAndFees: 2000,
    disposalValue: 30000,
    outsourcingCost: 45000
  });
  
  // Per-Tonne Inputs
  const [perTonneInputs, setPerTonneInputs] = useState({
    tonnage: 500,
    fuelCostPerLiter: 1.2,
    fuelConsumption: 0.35, // liters per tonne-km
    distanceKm: 1000,
    laborCostPerHour: 15,
    avgSpeedKmh: 60,
    tollsPerTrip: 50,
    loadingUnloadingCost: 5 // per tonne
  });
  
  // Scenario Analysis Inputs
  const [scenarioInputs, setScenarioInputs] = useState({
    baselineFuelPrice: 1.2,
    scenarioFuelPrice: 1.8,
    baselineLaborRate: 15,
    scenarioLaborRate: 20,
    baselineVolume: 500,
    scenarioVolume: 400
  });

  // Results states
  const [tcoResults, setTcoResults] = useState<any>(null);
  const [perTonneResults, setPerTonneResults] = useState<any>(null);
  const [scenarioResults, setScenarioResults] = useState<any>(null);

  const handleTcoInputChange = (field: string, value: string | number) => {
    setTcoInputs({
      ...tcoInputs,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    });
  };

  const handlePerTonneInputChange = (field: string, value: string | number) => {
    setPerTonneInputs({
      ...perTonneInputs,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    });
  };

  const handleScenarioInputChange = (field: string, value: string | number) => {
    setScenarioInputs({
      ...scenarioInputs,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    });
  };

  const calculateTCO = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const {
        assetCost,
        lifespan,
        maintenanceCost,
        operatingCost,
        insuranceCost,
        taxesAndFees,
        disposalValue,
        outsourcingCost
      } = tcoInputs;
      
      // Calculate ownership costs
      const totalOwnershipCost = assetCost + 
        (maintenanceCost * lifespan) +
        (operatingCost * lifespan) +
        (insuranceCost * lifespan) +
        (taxesAndFees * lifespan) -
        disposalValue;
      
      const annualOwnershipCost = totalOwnershipCost / lifespan;
      
      // Calculate outsourcing costs
      const totalOutsourcingCost = outsourcingCost * lifespan;
      const annualOutsourcingCost = outsourcingCost;
      
      // Comparison
      const difference = totalOutsourcingCost - totalOwnershipCost;
      const annualDifference = annualOutsourcingCost - annualOwnershipCost;
      const betterOption = difference > 0 ? "own" : "outsource";
      const savingsPercentage = Math.abs((difference / Math.max(totalOwnershipCost, totalOutsourcingCost)) * 100);
      
      setTcoResults({
        totalOwnershipCost,
        annualOwnershipCost,
        totalOutsourcingCost,
        annualOutsourcingCost,
        difference,
        annualDifference,
        betterOption,
        savingsPercentage
      });
      
      setIsCalculating(false);
      
      toast({
        title: "TCO Analysis Complete",
        description: `${betterOption === 'own' ? 'Owning' : 'Outsourcing'} is more cost-effective by ${savingsPercentage.toFixed(1)}%`
      });
      
    }, 1500);
  };

  const calculatePerTonne = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const {
        tonnage,
        fuelCostPerLiter,
        fuelConsumption,
        distanceKm,
        laborCostPerHour,
        avgSpeedKmh,
        tollsPerTrip,
        loadingUnloadingCost
      } = perTonneInputs;
      
      // Calculate fuel cost
      const totalFuelConsumption = fuelConsumption * tonnage * distanceKm;
      const totalFuelCost = totalFuelConsumption * fuelCostPerLiter;
      const fuelCostPerTonne = totalFuelCost / tonnage;
      
      // Calculate labor cost
      const tripTimeHours = distanceKm / avgSpeedKmh;
      const totalLaborCost = tripTimeHours * laborCostPerHour;
      const laborCostPerTonne = totalLaborCost / tonnage;
      
      // Calculate tolls cost
      const tollsCostPerTonne = tollsPerTrip / tonnage;
      
      // Calculate loading/unloading cost
      // Already per tonne
      
      // Total costs
      const totalCostPerTonne = fuelCostPerTonne + laborCostPerTonne + tollsCostPerTonne + loadingUnloadingCost;
      const totalTripCost = totalCostPerTonne * tonnage;
      
      setPerTonneResults({
        fuelCostPerTonne,
        laborCostPerTonne,
        tollsCostPerTonne,
        loadingUnloadingCost,
        totalCostPerTonne,
        totalTripCost
      });
      
      setIsCalculating(false);
      
      toast({
        title: "Per-Tonne Analysis Complete",
        description: `Total cost per tonne: $${totalCostPerTonne.toFixed(2)}`
      });
      
    }, 1500);
  };

  const calculateScenarioAnalysis = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const {
        baselineFuelPrice,
        scenarioFuelPrice,
        baselineLaborRate,
        scenarioLaborRate,
        baselineVolume,
        scenarioVolume
      } = scenarioInputs;
      
      // Simplified model for demonstration
      const calculateCost = (fuelPrice: number, laborRate: number, volume: number) => {
        // Assume 100km distance, 0.3L fuel per tonne-km, 2 hours labor per trip
        const fuelCost = fuelPrice * 0.3 * 100 * volume;
        const laborCost = laborRate * 2;
        const fixedCost = 500; // Arbitrary fixed costs
        
        return {
          fuelCost,
          laborCost,
          fixedCost,
          totalCost: fuelCost + laborCost + fixedCost,
          perTonneCost: (fuelCost + laborCost + fixedCost) / volume
        };
      };
      
      const baselineCost = calculateCost(baselineFuelPrice, baselineLaborRate, baselineVolume);
      const scenarioCost = calculateCost(scenarioFuelPrice, scenarioLaborRate, scenarioVolume);
      
      // Calculate impacts
      const costIncrease = scenarioCost.totalCost - baselineCost.totalCost;
      const percentageIncrease = (costIncrease / baselineCost.totalCost) * 100;
      const perTonneIncrease = scenarioCost.perTonneCost - baselineCost.perTonneCost;
      
      setScenarioResults({
        baseline: baselineCost,
        scenario: scenarioCost,
        costIncrease,
        percentageIncrease,
        perTonneIncrease
      });
      
      setIsCalculating(false);
      
      toast({
        title: "Scenario Analysis Complete",
        description: `Cost impact: ${percentageIncrease >= 0 ? '+' : ''}${percentageIncrease.toFixed(1)}%`
      });
      
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-4 col-span-1 md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="tco" className="flex-1">TCO</TabsTrigger>
              <TabsTrigger value="tonne" className="flex-1">Per-Tonne</TabsTrigger>
              <TabsTrigger value="scenario" className="flex-1">Scenarios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tco" className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Total Cost of Ownership</h3>
                <Select 
                  value={assetType} 
                  onValueChange={(value) => setAssetType(value as "fleet" | "warehouse")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fleet">
                      <div className="flex items-center">
                        <Truck size={14} className="mr-2" />
                        <span>Fleet</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="warehouse">
                      <div className="flex items-center">
                        <Warehouse size={14} className="mr-2" />
                        <span>Warehouse</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="assetCost">
                    {assetType === "fleet" ? "Vehicle Purchase Cost" : "Facility Construction Cost"} ($)
                  </Label>
                  <Input
                    id="assetCost"
                    type="number"
                    value={tcoInputs.assetCost}
                    onChange={(e) => handleTcoInputChange("assetCost", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="lifespan">Asset Lifespan (years)</Label>
                  <Input
                    id="lifespan"
                    type="number"
                    value={tcoInputs.lifespan}
                    onChange={(e) => handleTcoInputChange("lifespan", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="maintenanceCost">Annual Maintenance Cost ($)</Label>
                  <Input
                    id="maintenanceCost"
                    type="number"
                    value={tcoInputs.maintenanceCost}
                    onChange={(e) => handleTcoInputChange("maintenanceCost", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="operatingCost">Annual Operating Cost ($)</Label>
                  <Input
                    id="operatingCost"
                    type="number"
                    value={tcoInputs.operatingCost}
                    onChange={(e) => handleTcoInputChange("operatingCost", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="insuranceCost">Annual Insurance Cost ($)</Label>
                  <Input
                    id="insuranceCost"
                    type="number"
                    value={tcoInputs.insuranceCost}
                    onChange={(e) => handleTcoInputChange("insuranceCost", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="taxesAndFees">Annual Taxes and Fees ($)</Label>
                  <Input
                    id="taxesAndFees"
                    type="number"
                    value={tcoInputs.taxesAndFees}
                    onChange={(e) => handleTcoInputChange("taxesAndFees", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="disposalValue">End-of-Life Disposal/Resale Value ($)</Label>
                  <Input
                    id="disposalValue"
                    type="number"
                    value={tcoInputs.disposalValue}
                    onChange={(e) => handleTcoInputChange("disposalValue", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="outsourcingCost">
                    Annual {assetType === "fleet" ? "3PL/Carrier" : "3PL/Warehouse"} Cost ($)
                  </Label>
                  <Input
                    id="outsourcingCost"
                    type="number"
                    value={tcoInputs.outsourcingCost}
                    onChange={(e) => handleTcoInputChange("outsourcingCost", e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={calculateTCO} 
                  className="w-full mt-2"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Calculate TCO"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="tonne" className="pt-4 space-y-4">
              <h3 className="font-medium">Per-Tonne Cost Breakdown</h3>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tonnage">Cargo Weight (tonnes)</Label>
                  <Input
                    id="tonnage"
                    type="number"
                    value={perTonneInputs.tonnage}
                    onChange={(e) => handlePerTonneInputChange("tonnage", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="distanceKm">Transport Distance (km)</Label>
                  <Input
                    id="distanceKm"
                    type="number"
                    value={perTonneInputs.distanceKm}
                    onChange={(e) => handlePerTonneInputChange("distanceKm", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fuelCostPerLiter">Fuel Cost ($ per liter)</Label>
                  <Input
                    id="fuelCostPerLiter"
                    type="number"
                    step="0.01"
                    value={perTonneInputs.fuelCostPerLiter}
                    onChange={(e) => handlePerTonneInputChange("fuelCostPerLiter", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="fuelConsumption">Fuel Consumption (liters per tonne-km)</Label>
                  <Input
                    id="fuelConsumption"
                    type="number"
                    step="0.01"
                    value={perTonneInputs.fuelConsumption}
                    onChange={(e) => handlePerTonneInputChange("fuelConsumption", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="laborCostPerHour">Labor Cost ($ per hour)</Label>
                  <Input
                    id="laborCostPerHour"
                    type="number"
                    step="0.01"
                    value={perTonneInputs.laborCostPerHour}
                    onChange={(e) => handlePerTonneInputChange("laborCostPerHour", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="avgSpeedKmh">Average Speed (km/h)</Label>
                  <Input
                    id="avgSpeedKmh"
                    type="number"
                    value={perTonneInputs.avgSpeedKmh}
                    onChange={(e) => handlePerTonneInputChange("avgSpeedKmh", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tollsPerTrip">Tolls Cost ($ per trip)</Label>
                  <Input
                    id="tollsPerTrip"
                    type="number"
                    step="0.01"
                    value={perTonneInputs.tollsPerTrip}
                    onChange={(e) => handlePerTonneInputChange("tollsPerTrip", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="loadingUnloadingCost">Loading/Unloading Cost ($ per tonne)</Label>
                  <Input
                    id="loadingUnloadingCost"
                    type="number"
                    step="0.01"
                    value={perTonneInputs.loadingUnloadingCost}
                    onChange={(e) => handlePerTonneInputChange("loadingUnloadingCost", e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={calculatePerTonne} 
                  className="w-full mt-2"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Calculate Per-Tonne Cost"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="scenario" className="pt-4 space-y-4">
              <h3 className="font-medium">What-If Scenario Analysis</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Baseline Scenario</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="baselineFuelPrice">Fuel Price ($ per liter)</Label>
                      <Input
                        id="baselineFuelPrice"
                        type="number"
                        step="0.01"
                        value={scenarioInputs.baselineFuelPrice}
                        onChange={(e) => handleScenarioInputChange("baselineFuelPrice", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="baselineLaborRate">Labor Rate ($ per hour)</Label>
                      <Input
                        id="baselineLaborRate"
                        type="number"
                        step="0.01"
                        value={scenarioInputs.baselineLaborRate}
                        onChange={(e) => handleScenarioInputChange("baselineLaborRate", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="baselineVolume">Cargo Volume (tonnes)</Label>
                      <Input
                        id="baselineVolume"
                        type="number"
                        value={scenarioInputs.baselineVolume}
                        onChange={(e) => handleScenarioInputChange("baselineVolume", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary/30 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Alternative Scenario</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="scenarioFuelPrice">
                        Fuel Price ($ per liter)
                      </Label>
                      <Input
                        id="scenarioFuelPrice"
                        type="number"
                        step="0.01"
                        value={scenarioInputs.scenarioFuelPrice}
                        onChange={(e) => handleScenarioInputChange("scenarioFuelPrice", e.target.value)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Change: {(((scenarioInputs.scenarioFuelPrice - scenarioInputs.baselineFuelPrice) / scenarioInputs.baselineFuelPrice) * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="scenarioLaborRate">
                        Labor Rate ($ per hour)
                      </Label>
                      <Input
                        id="scenarioLaborRate"
                        type="number"
                        step="0.01"
                        value={scenarioInputs.scenarioLaborRate}
                        onChange={(e) => handleScenarioInputChange("scenarioLaborRate", e.target.value)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Change: {(((scenarioInputs.scenarioLaborRate - scenarioInputs.baselineLaborRate) / scenarioInputs.baselineLaborRate) * 100).toFixed(1)}%
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="scenarioVolume">
                        Cargo Volume (tonnes)
                      </Label>
                      <Input
                        id="scenarioVolume"
                        type="number"
                        value={scenarioInputs.scenarioVolume}
                        onChange={(e) => handleScenarioInputChange("scenarioVolume", e.target.value)}
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        Change: {(((scenarioInputs.scenarioVolume - scenarioInputs.baselineVolume) / scenarioInputs.baselineVolume) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={calculateScenarioAnalysis} 
                  className="w-full mt-2"
                  disabled={isCalculating}
                >
                  {isCalculating ? "Analyzing..." : "Run Scenario Analysis"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        <Card className="p-4 col-span-1 md:col-span-3">
          <h3 className="font-medium mb-4">Results & Visualization</h3>
          
          {activeTab === "tco" && tcoResults && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {tcoResults.betterOption === "own" ? "Ownership" : "Outsourcing"}
                  </div>
                  <div className="text-sm text-muted-foreground">Recommended Option</div>
                  <div className="mt-2 text-xl">
                    {tcoResults.savingsPercentage.toFixed(1)}% cost advantage
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Total Ownership Cost:</div>
                    <div>${tcoResults.totalOwnershipCost.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Annual Ownership Cost:</div>
                    <div>${tcoResults.annualOwnershipCost.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Major Costs:</div>
                    <div>Asset + Maintenance</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Advantages:</div>
                    <div>Asset control, No markups</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Total Outsourcing Cost:</div>
                    <div>${tcoResults.totalOutsourcingCost.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Annual Outsourcing Cost:</div>
                    <div>${tcoResults.annualOutsourcingCost.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Major Costs:</div>
                    <div>Service fees, Contract costs</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Advantages:</div>
                    <div>Flexibility, Lower upfront cost</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Annual Cost Comparison</h4>
                <div className="h-10 bg-secondary/30 rounded-md overflow-hidden relative">
                  {tcoResults.annualOwnershipCost < tcoResults.annualOutsourcingCost ? (
                    <>
                      <div 
                        className="h-full bg-green-500 absolute left-0 top-0"
                        style={{ 
                          width: `${(tcoResults.annualOwnershipCost / tcoResults.annualOutsourcingCost) * 100}%` 
                        }}
                      ></div>
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                        Own: ${tcoResults.annualOwnershipCost.toLocaleString()}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                        Outsource: ${tcoResults.annualOutsourcingCost.toLocaleString()}
                      </div>
                    </>
                  ) : (
                    <>
                      <div 
                        className="h-full bg-green-500 absolute right-0 top-0"
                        style={{ 
                          width: `${(tcoResults.annualOutsourcingCost / tcoResults.annualOwnershipCost) * 100}%` 
                        }}
                      ></div>
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                        Own: ${tcoResults.annualOwnershipCost.toLocaleString()}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                        Outsource: ${tcoResults.annualOutsourcingCost.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "tonne" && perTonneResults && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold">${perTonneResults.totalCostPerTonne.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Cost per Tonne</div>
                </div>
                
                <div className="p-4 border rounded-md text-center">
                  <div className="text-2xl font-bold">${perTonneResults.totalTripCost.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Trip Cost</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Cost Breakdown (per tonne)</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Fuel Cost</span>
                      <span className="text-sm">${perTonneResults.fuelCostPerTonne.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${(perTonneResults.fuelCostPerTonne / perTonneResults.totalCostPerTonne) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Labor Cost</span>
                      <span className="text-sm">${perTonneResults.laborCostPerTonne.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${(perTonneResults.laborCostPerTonne / perTonneResults.totalCostPerTonne) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tolls</span>
                      <span className="text-sm">${perTonneResults.tollsCostPerTonne.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full">
                      <div 
                        className="h-full bg-yellow-500 rounded-full" 
                        style={{ width: `${(perTonneResults.tollsCostPerTonne / perTonneResults.totalCostPerTonne) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Loading/Unloading</span>
                      <span className="text-sm">${perTonneResults.loadingUnloadingCost.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-secondary/30 rounded-full">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${(perTonneResults.loadingUnloadingCost / perTonneResults.totalCostPerTonne) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Key Metrics</h4>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span className="text-sm">Cost per kilometer:</span>
                    <span>${(perTonneResults.totalTripCost / perTonneInputs.distanceKm).toFixed(2)}/km</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm">Cost per tonne-kilometer:</span>
                    <span>${(perTonneResults.totalCostPerTonne / perTonneInputs.distanceKm).toFixed(4)}/tonne-km</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm">Fuel efficiency:</span>
                    <span>{perTonneInputs.fuelConsumption.toFixed(2)} L/tonne-km</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm">Average speed:</span>
                    <span>{perTonneInputs.avgSpeedKmh} km/h</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === "scenario" && scenarioResults && (
            <div className="space-y-6">
              <div className="p-4 border rounded-md">
                <div className="flex items-center mb-2">
                  {scenarioResults.percentageIncrease > 10 ? (
                    <AlertTriangle size={18} className="text-red-500 mr-2" />
                  ) : scenarioResults.percentageIncrease < 0 ? (
                    <DollarSign size={18} className="text-green-500 mr-2" />
                  ) : (
                    <BarChart4 size={18} className="text-yellow-500 mr-2" />
                  )}
                  <h4 className="font-medium">Scenario Impact Analysis</h4>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {scenarioResults.percentageIncrease >= 0 ? '+' : ''}
                      {scenarioResults.percentageIncrease.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cost Impact</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${scenarioResults.baseline.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Baseline Cost</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ${scenarioResults.scenario.totalCost.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Scenario Cost</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h5 className="text-sm font-medium mb-2">Cost Change Visualization</h5>
                  <div className="h-10 bg-secondary/30 rounded-md overflow-hidden relative">
                    {scenarioResults.baseline.totalCost <= scenarioResults.scenario.totalCost ? (
                      <>
                        <div 
                          className="h-full bg-blue-500 absolute left-0 top-0"
                          style={{ 
                            width: `${(scenarioResults.baseline.totalCost / scenarioResults.scenario.totalCost) * 100}%` 
                          }}
                        ></div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                          Baseline
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                          Scenario
                        </div>
                      </>
                    ) : (
                      <>
                        <div 
                          className="h-full bg-green-500 absolute right-0 top-0"
                          style={{ 
                            width: `${(scenarioResults.scenario.totalCost / scenarioResults.baseline.totalCost) * 100}%` 
                          }}
                        ></div>
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                          Baseline
                        </div>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-sm font-medium">
                          Scenario
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Baseline Breakdown</h4>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Cost:</span>
                    <span>${scenarioResults.baseline.fuelCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Labor Cost:</span>
                    <span>${scenarioResults.baseline.laborCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Fixed Cost:</span>
                    <span>${scenarioResults.baseline.fixedCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Per-Tonne Cost:</span>
                    <span>${scenarioResults.baseline.perTonneCost.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Scenario Breakdown</h4>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Cost:</span>
                    <span>${scenarioResults.scenario.fuelCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Labor Cost:</span>
                    <span>${scenarioResults.scenario.laborCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Fixed Cost:</span>
                    <span>${scenarioResults.scenario.fixedCost.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Per-Tonne Cost:</span>
                    <span>${scenarioResults.scenario.perTonneCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle size={18} className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Scenario Analysis Insights</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                      {scenarioResults.percentageIncrease > 10
                        ? "This scenario significantly increases costs. Consider mitigation strategies or alternative suppliers."
                        : scenarioResults.percentageIncrease > 0
                        ? "This scenario has a moderate impact on costs. Review budget allocations to accommodate the changes."
                        : "This scenario reduces costs. Consider implementing these changes to improve financial performance."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Show placeholder when no results available */}
          {((activeTab === "tco" && !tcoResults) || 
            (activeTab === "tonne" && !perTonneResults) || 
            (activeTab === "scenario" && !scenarioResults)) && (
            <div className="flex flex-col items-center justify-center h-64">
              <Package size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Enter your parameters and calculate to see results
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
