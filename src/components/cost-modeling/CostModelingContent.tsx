
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Store,
  Truck,
  BarChart4,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const CostModelingContent = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tco");
  const [fleetModel, setFleetModel] = useState("owned");
  const [calculateLoading, setCalculateLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSecondaryResults, setShowSecondaryResults] = useState(false);

  // TCO inputs
  const [tcoInputs, setTcoInputs] = useState({
    fleetSize: 10,
    vehicleLifespan: 5,
    vehicleCost: 50000,
    maintenanceCost: 5000,
    fuelCost: 1.2,
    driverSalary: 30000,
    annualDistance: 50000,
    insuranceCost: 3000,
    depreciation: 20,
    outsourceCostPerKm: 1.8,
  });

  // Per-tonne costing inputs
  const [tonneInputs, setTonneInputs] = useState({
    averageTonnage: 15,
    fuelConsumption: 0.35, // liters per km
    laborCostPerHour: 15,
    tollsPerTrip: 25,
    maintenancePerKm: 0.15,
    averageTripDistance: 350,
    averageTripTime: 8,
  });

  // Scenario analysis inputs
  const [baseScenario, setBaseScenario] = useState({
    fuelPrice: 1.2,
    driverWage: 15,
    maintenanceCost: 0.15,
    tonnage: 15,
    distance: 350,
  });

  const [scenarios, setScenarios] = useState([
    { name: "Fuel Price +50%", fuelPrice: 1.8, costImpact: 0 },
    { name: "Driver Wages +20%", driverWage: 18, costImpact: 0 },
    { name: "Maintenance +30%", maintenanceCost: 0.195, costImpact: 0 },
    { name: "Combined Impact", combined: true, costImpact: 0 },
  ]);

  const calculateTCO = () => {
    setCalculateLoading(true);

    // Simulate calculation time
    setTimeout(() => {
      setShowResults(true);
      setCalculateLoading(false);
      
      toast({
        title: "TCO Analysis Complete",
        description: "Total cost of ownership calculation finished successfully.",
      });
    }, 1500);
  };

  const calculatePerTonneCost = () => {
    setCalculateLoading(true);

    // Simulate calculation time
    setTimeout(() => {
      setShowResults(true);
      setCalculateLoading(false);
      
      toast({
        title: "Per-Tonne Analysis Complete",
        description: "Cost per tonne calculation finished successfully.",
      });
    }, 1500);
  };

  const runScenarioAnalysis = () => {
    setCalculateLoading(true);

    // Simulate calculation time
    setTimeout(() => {
      const updatedScenarios = [...scenarios];
      
      // Calculate impact (simplified demo calculations)
      updatedScenarios[0].costImpact = 18.2; // Fuel impact
      updatedScenarios[1].costImpact = 8.7;  // Driver wage impact
      updatedScenarios[2].costImpact = 6.5;  // Maintenance impact
      updatedScenarios[3].costImpact = 33.4; // Combined impact
      
      setScenarios(updatedScenarios);
      setShowResults(true);
      setCalculateLoading(false);
      
      toast({
        title: "Scenario Analysis Complete",
        description: "What-if scenario analysis finished successfully.",
      });
    }, 2000);
  };

  // Cost calculations
  const ownedFleetAnnualCost =
    tcoInputs.fleetSize * tcoInputs.vehicleCost * (tcoInputs.depreciation / 100) +
    tcoInputs.fleetSize * tcoInputs.maintenanceCost +
    tcoInputs.fleetSize * tcoInputs.annualDistance * tcoInputs.fuelCost * 0.35 / 100 +
    tcoInputs.fleetSize * tcoInputs.driverSalary +
    tcoInputs.fleetSize * tcoInputs.insuranceCost;
  
  const outsourcedFleetAnnualCost =
    tcoInputs.fleetSize * tcoInputs.annualDistance * tcoInputs.outsourceCostPerKm;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Cost Modeling</h1>
          <p className="text-muted-foreground mb-6">
            Analyze transportation costs across different scenarios and models.
          </p>
        </div>
        <div className="flex justify-end items-center">
          <Select value={fleetModel} onValueChange={setFleetModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fleet Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owned">Owned Fleet</SelectItem>
              <SelectItem value="outsourced">Outsourced Fleet</SelectItem>
              <SelectItem value="hybrid">Hybrid Model</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="tco" className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            <span>TCO Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="pertonne" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            <span>Per-Tonne Costing</span>
          </TabsTrigger>
          <TabsTrigger value="scenario" className="flex items-center">
            <BarChart4 className="h-4 w-4 mr-2" />
            <span>Scenario Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tco">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Total Cost of Ownership Analysis
            </h2>
            <p className="text-muted-foreground mb-6">
              Compare the costs of owning versus outsourcing your transportation fleet.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fleetSize">Fleet Size (vehicles)</Label>
                  <Input
                    id="fleetSize"
                    type="number"
                    value={tcoInputs.fleetSize}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        fleetSize: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleCost">Vehicle Cost (USD)</Label>
                  <Input
                    id="vehicleCost"
                    type="number"
                    value={tcoInputs.vehicleCost}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        vehicleCost: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleLifespan">
                    Vehicle Lifespan (years)
                  </Label>
                  <Input
                    id="vehicleLifespan"
                    type="number"
                    value={tcoInputs.vehicleLifespan}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        vehicleLifespan: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenanceCost">
                    Annual Maintenance per Vehicle (USD)
                  </Label>
                  <Input
                    id="maintenanceCost"
                    type="number"
                    value={tcoInputs.maintenanceCost}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        maintenanceCost: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="annualDistance">
                    Annual Distance per Vehicle (km)
                  </Label>
                  <Input
                    id="annualDistance"
                    type="number"
                    value={tcoInputs.annualDistance}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        annualDistance: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelCost">Fuel Cost (USD per liter)</Label>
                  <Input
                    id="fuelCost"
                    type="number"
                    step="0.01"
                    value={tcoInputs.fuelCost}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        fuelCost: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverSalary">
                    Annual Driver Salary (USD)
                  </Label>
                  <Input
                    id="driverSalary"
                    type="number"
                    value={tcoInputs.driverSalary}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        driverSalary: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceCost">
                    Annual Insurance per Vehicle (USD)
                  </Label>
                  <Input
                    id="insuranceCost"
                    type="number"
                    value={tcoInputs.insuranceCost}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        insuranceCost: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="depreciation">
                    Annual Depreciation Rate (%)
                  </Label>
                  <Input
                    id="depreciation"
                    type="number"
                    value={tcoInputs.depreciation}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        depreciation: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outsourceCostPerKm">
                    Outsourced Cost per km (USD)
                  </Label>
                  <Input
                    id="outsourceCostPerKm"
                    type="number"
                    step="0.01"
                    value={tcoInputs.outsourceCostPerKm}
                    onChange={(e) =>
                      setTcoInputs({
                        ...tcoInputs,
                        outsourceCostPerKm: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={calculateTCO}
                disabled={calculateLoading}
              >
                {calculateLoading ? "Calculating..." : "Calculate TCO"}
              </Button>
            </div>

            {showResults && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold">TCO Results</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Owned Fleet</h4>
                    <div className="text-2xl font-bold">${ownedFleetAnnualCost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Annual cost
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>Cost per vehicle:</div>
                      <div>${(ownedFleetAnnualCost / tcoInputs.fleetSize).toLocaleString()}</div>
                      <div>Cost per km:</div>
                      <div>
                        ${(ownedFleetAnnualCost / (tcoInputs.fleetSize * tcoInputs.annualDistance)).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Outsourced Fleet</h4>
                    <div className="text-2xl font-bold">${outsourcedFleetAnnualCost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      Annual cost
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>Cost per vehicle:</div>
                      <div>
                        ${(outsourcedFleetAnnualCost / tcoInputs.fleetSize).toLocaleString()}
                      </div>
                      <div>Cost per km:</div>
                      <div>${tcoInputs.outsourceCostPerKm.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Recommendation</h4>
                    <div className="text-sm font-medium">
                      {ownedFleetAnnualCost < outsourcedFleetAnnualCost ? "Own" : "Outsource"}
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    {ownedFleetAnnualCost < outsourcedFleetAnnualCost ? (
                      <>
                        Owning your fleet could save approximately $
                        {(outsourcedFleetAnnualCost - ownedFleetAnnualCost).toLocaleString()}{" "}
                        annually compared to outsourcing.
                      </>
                    ) : (
                      <>
                        Outsourcing your fleet could save approximately $
                        {(ownedFleetAnnualCost - outsourcedFleetAnnualCost).toLocaleString()}{" "}
                        annually compared to ownership.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="pertonne">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Per-Tonne Cost Analysis
            </h2>
            <p className="text-muted-foreground mb-6">
              Break down transportation costs by tonne for detailed analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="averageTonnage">Average Load (tonnes)</Label>
                  <Input
                    id="averageTonnage"
                    type="number"
                    value={tonneInputs.averageTonnage}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        averageTonnage: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelConsumption">
                    Fuel Consumption (liters/km)
                  </Label>
                  <Input
                    id="fuelConsumption"
                    type="number"
                    step="0.01"
                    value={tonneInputs.fuelConsumption}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        fuelConsumption: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageTripDistance">
                    Average Trip Distance (km)
                  </Label>
                  <Input
                    id="averageTripDistance"
                    type="number"
                    value={tonneInputs.averageTripDistance}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        averageTripDistance: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenancePerKm">
                    Maintenance Cost per km (USD)
                  </Label>
                  <Input
                    id="maintenancePerKm"
                    type="number"
                    step="0.01"
                    value={tonneInputs.maintenancePerKm}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        maintenancePerKm: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="laborCostPerHour">
                    Labor Cost per Hour (USD)
                  </Label>
                  <Input
                    id="laborCostPerHour"
                    type="number"
                    step="0.01"
                    value={tonneInputs.laborCostPerHour}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        laborCostPerHour: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageTripTime">
                    Average Trip Time (hours)
                  </Label>
                  <Input
                    id="averageTripTime"
                    type="number"
                    step="0.5"
                    value={tonneInputs.averageTripTime}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        averageTripTime: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tollsPerTrip">Tolls per Trip (USD)</Label>
                  <Input
                    id="tollsPerTrip"
                    type="number"
                    step="0.01"
                    value={tonneInputs.tollsPerTrip}
                    onChange={(e) =>
                      setTonneInputs({
                        ...tonneInputs,
                        tollsPerTrip: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={calculatePerTonneCost}
                disabled={calculateLoading}
              >
                {calculateLoading ? "Calculating..." : "Calculate Per-Tonne Cost"}
              </Button>
            </div>

            {showResults && (
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-semibold">Per-Tonne Cost Results</h3>

                <div className="bg-card border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <div className="text-2xl font-bold">
                      ${((
                        (tonneInputs.fuelConsumption *
                          tcoInputs.fuelCost *
                          tonneInputs.averageTripDistance +
                          tonneInputs.laborCostPerHour * tonneInputs.averageTripTime +
                          tonneInputs.tollsPerTrip +
                          tonneInputs.averageTripDistance * tonneInputs.maintenancePerKm) /
                        tonneInputs.averageTonnage
                      ).toFixed(2))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cost per tonne
                    </div>
                  </div>

                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowSecondaryResults(!showSecondaryResults)}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Cost Breakdown</h4>
                      {showSecondaryResults ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>

                  {showSecondaryResults && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">
                            Cost Distribution
                          </h5>
                          <div className="h-8 bg-muted rounded-lg flex overflow-hidden">
                            <div
                              className="bg-blue-500 h-full"
                              style={{
                                width: "45%",
                              }}
                            ></div>
                            <div
                              className="bg-green-500 h-full"
                              style={{
                                width: "25%",
                              }}
                            ></div>
                            <div
                              className="bg-amber-500 h-full"
                              style={{
                                width: "20%",
                              }}
                            ></div>
                            <div
                              className="bg-red-500 h-full"
                              style={{
                                width: "10%",
                              }}
                            ></div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span>Fuel: 45%</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span>Labor: 25%</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                              <span>Maintenance: 20%</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              <span>Tolls: 10%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">
                              Cost per km
                            </h5>
                            <div className="text-xl font-semibold">
                              $
                              {(
                                (tonneInputs.fuelConsumption * tcoInputs.fuelCost +
                                  tonneInputs.maintenancePerKm +
                                  tonneInputs.laborCostPerHour / 60) *
                                tonneInputs.averageTonnage
                              ).toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">
                              Cost per hour
                            </h5>
                            <div className="text-xl font-semibold">
                              $
                              {(
                                tonneInputs.laborCostPerHour +
                                ((tonneInputs.fuelConsumption * tcoInputs.fuelCost +
                                  tonneInputs.maintenancePerKm) *
                                  60)
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Efficiency Metrics</h4>
                    <div className="text-sm font-medium">
                      {tonneInputs.averageTonnage > 10 ? "Good" : "Needs Improvement"}
                    </div>
                  </div>

                  <div className="mt-2 text-sm">
                    {tonneInputs.averageTonnage > 10 ? (
                      <>
                        Your per-tonne costs are optimized. Consider increasing
                        fleet utilization to further reduce costs.
                      </>
                    ) : (
                      <>
                        Your per-tonne costs are high. Consider increasing load
                        factor or optimizing routes to improve efficiency.
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="scenario">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              "What-if" Scenario Analysis
            </h2>
            <p className="text-muted-foreground mb-6">
              Model cost impacts from changes in fuel prices, wages, and other
              variables.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Base Scenario</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseFuelPrice">
                      Fuel Price (USD/liter)
                    </Label>
                    <Input
                      id="baseFuelPrice"
                      type="number"
                      step="0.01"
                      value={baseScenario.fuelPrice}
                      onChange={(e) =>
                        setBaseScenario({
                          ...baseScenario,
                          fuelPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="baseDriverWage">
                      Driver Wage (USD/hour)
                    </Label>
                    <Input
                      id="baseDriverWage"
                      type="number"
                      step="0.01"
                      value={baseScenario.driverWage}
                      onChange={(e) =>
                        setBaseScenario({
                          ...baseScenario,
                          driverWage: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="baseMaintenanceCost">
                      Maintenance (USD/km)
                    </Label>
                    <Input
                      id="baseMaintenanceCost"
                      type="number"
                      step="0.01"
                      value={baseScenario.maintenanceCost}
                      onChange={(e) =>
                        setBaseScenario({
                          ...baseScenario,
                          maintenanceCost: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="baseTonnage">Load (tonnes)</Label>
                    <Input
                      id="baseTonnage"
                      type="number"
                      value={baseScenario.tonnage}
                      onChange={(e) =>
                        setBaseScenario({
                          ...baseScenario,
                          tonnage: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="baseDistance">Trip Distance (km)</Label>
                    <Input
                      id="baseDistance"
                      type="number"
                      value={baseScenario.distance}
                      onChange={(e) =>
                        setBaseScenario({
                          ...baseScenario,
                          distance: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Scenario Comparison</h3>
                <p className="text-muted-foreground mb-6">
                  See how different scenarios affect your transportation costs.
                </p>

                <div className="flex justify-end mb-4">
                  <Button
                    onClick={runScenarioAnalysis}
                    disabled={calculateLoading}
                  >
                    {calculateLoading ? "Analyzing..." : "Run Analysis"}
                  </Button>
                </div>

                {showResults && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      {scenarios.map((scenario, index) => (
                        <div 
                          key={index}
                          className="border rounded-lg p-4 bg-card"
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{scenario.name}</h4>
                            <span 
                              className={
                                scenario.costImpact <= 10
                                  ? "text-green-600 dark:text-green-400 font-medium"
                                  : scenario.costImpact <= 20
                                  ? "text-amber-600 dark:text-amber-400 font-medium"
                                  : "text-red-600 dark:text-red-400 font-medium"
                              }
                            >
                              +{scenario.costImpact}%
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className={
                                  scenario.costImpact <= 10
                                    ? "bg-green-600 h-2.5 rounded-full"
                                    : scenario.costImpact <= 20
                                    ? "bg-amber-600 h-2.5 rounded-full"
                                    : "bg-red-600 h-2.5 rounded-full"
                                }
                                style={{
                                  width: `${Math.min(
                                    Math.max(scenario.costImpact * 2, 5),
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 bg-muted p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                        <h4 className="font-medium">Risk Assessment</h4>
                      </div>

                      <p className="text-sm">
                        Combined scenario presents the highest cost risk (33.4%
                        increase). Consider implementing cost mitigation
                        strategies such as fuel hedging and driver efficiency
                        programs.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
