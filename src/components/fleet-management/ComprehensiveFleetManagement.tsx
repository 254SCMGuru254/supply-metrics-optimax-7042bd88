
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Calendar, BarChart3, Calculator } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface FleetResult {
  success: boolean;
  result: any;
  recommendations: string[];
  formula: string;
}

interface Vehicle {
  id: string;
  type: string;
  capacity: number;
  currentLocation: string;
  status: 'available' | 'in-use' | 'maintenance';
  fuelEfficiency: number;
  maintenanceScore: number;
}

interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  priority: number;
  cargo: number;
}

export const ComprehensiveFleetManagement = () => {
  const [activeTab, setActiveTab] = useState("vehicle-assignment");
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [results, setResults] = useState<Record<string, FleetResult>>({});

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Sample vehicle and route data
  const sampleVehicles: Vehicle[] = [
    { id: "V001", type: "Truck", capacity: 5000, currentLocation: "Nairobi", status: "available", fuelEfficiency: 8.5, maintenanceScore: 85 },
    { id: "V002", type: "Van", capacity: 2000, currentLocation: "Mombasa", status: "available", fuelEfficiency: 12.0, maintenanceScore: 92 },
    { id: "V003", type: "Truck", capacity: 7000, currentLocation: "Kisumu", status: "in-use", fuelEfficiency: 7.2, maintenanceScore: 78 },
    { id: "V004", type: "Van", capacity: 1500, currentLocation: "Nakuru", status: "maintenance", fuelEfficiency: 13.5, maintenanceScore: 45 }
  ];

  const sampleRoutes: Route[] = [
    { id: "R001", origin: "Nairobi", destination: "Mombasa", distance: 480, duration: 8, priority: 3, cargo: 3000 },
    { id: "R002", origin: "Kisumu", destination: "Nairobi", distance: 350, duration: 6, priority: 2, cargo: 1800 },
    { id: "R003", origin: "Nakuru", destination: "Eldoret", distance: 160, duration: 3, priority: 1, cargo: 4500 }
  ];

  // Vehicle Assignment Optimization
  const calculateVehicleAssignment = () => {
    const vehicles = sampleVehicles.filter(v => v.status === 'available');
    const routes = sampleRoutes;
    
    const assignments: any[] = [];
    let totalCost = 0;
    let totalDistance = 0;
    let efficiencyScore = 0;
    
    // Simple assignment algorithm based on capacity, efficiency, and location
    routes.forEach(route => {
      const suitableVehicles = vehicles.filter(v => v.capacity >= route.cargo);
      
      if (suitableVehicles.length > 0) {
        // Score vehicles based on capacity utilization, fuel efficiency, and location match
        const scoredVehicles = suitableVehicles.map(vehicle => {
          const capacityUtilization = route.cargo / vehicle.capacity;
          const locationBonus = vehicle.currentLocation === route.origin ? 1.2 : 1.0;
          const efficiencyScore = vehicle.fuelEfficiency / 10; // Normalize
          const maintenanceBonus = vehicle.maintenanceScore / 100;
          
          const score = (capacityUtilization * 0.4 + efficiencyScore * 0.3 + maintenanceBonus * 0.3) * locationBonus;
          
          return { ...vehicle, assignmentScore: score };
        });
        
        scoredVehicles.sort((a, b) => b.assignmentScore - a.assignmentScore);
        const bestVehicle = scoredVehicles[0];
        
        const fuelCost = (route.distance / bestVehicle.fuelEfficiency) * 150; // 150 Ksh per liter
        const driverCost = route.duration * 500; // 500 Ksh per hour
        const routeCost = fuelCost + driverCost;
        
        assignments.push({
          vehicleId: bestVehicle.id,
          routeId: route.id,
          vehicle: bestVehicle,
          route: route,
          cost: routeCost,
          utilizationRate: (route.cargo / bestVehicle.capacity) * 100,
          fuelCost,
          driverCost
        });
        
        totalCost += routeCost;
        totalDistance += route.distance;
        efficiencyScore += (route.cargo / bestVehicle.capacity) * 100;
      }
    });
    
    const averageEfficiency = assignments.length > 0 ? efficiencyScore / assignments.length : 0;
    
    setResults(prev => ({
      ...prev,
      vehicleAssignment: {
        success: true,
        result: {
          assignments,
          totalCost,
          totalDistance,
          averageEfficiency,
          fuelEfficiency: totalDistance > 0 ? totalDistance / (totalCost * 0.6 / 150) : 0,
          assignedRoutes: assignments.length,
          unassignedRoutes: routes.length - assignments.length
        },
        recommendations: [
          `Successfully assigned ${assignments.length} out of ${routes.length} routes`,
          `Total operational cost: Ksh ${totalCost.toLocaleString()}`,
          `Average vehicle utilization: ${averageEfficiency.toFixed(1)}%`,
          averageEfficiency > 80 ? "Excellent fleet utilization" : averageEfficiency > 60 ? "Good utilization - room for improvement" : "Poor utilization - consider fleet optimization"
        ],
        formula: "Assignment Score = (Capacity Utilization × 0.4 + Fuel Efficiency × 0.3 + Maintenance Score × 0.3) × Location Bonus"
      }
    }));
  };

  // Maintenance Scheduling
  const calculateMaintenanceScheduling = () => {
    const vehicles = sampleVehicles;
    const maintenanceSchedule: any[] = [];
    let totalMaintenanceCost = 0;
    let preventiveActions = 0;
    
    vehicles.forEach(vehicle => {
      const maintenanceUrgency = 100 - vehicle.maintenanceScore;
      let priority = 'Low';
      let scheduledDays = 30;
      let estimatedCost = 15000; // Base maintenance cost
      
      if (maintenanceUrgency > 50) {
        priority = 'High';
        scheduledDays = 3;
        estimatedCost = 35000;
      } else if (maintenanceUrgency > 25) {
        priority = 'Medium';
        scheduledDays = 14;
        estimatedCost = 25000;
      }
      
      if (vehicle.status === 'maintenance') {
        priority = 'Critical';
        scheduledDays = 1;
        estimatedCost = 50000;
      }
      
      const maintenanceType = maintenanceUrgency > 40 ? 'Corrective' : 'Preventive';
      if (maintenanceType === 'Preventive') preventiveActions++;
      
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + scheduledDays);
      
      maintenanceSchedule.push({
        vehicleId: vehicle.id,
        vehicleType: vehicle.type,
        maintenanceScore: vehicle.maintenanceScore,
        priority,
        maintenanceType,
        scheduledDate: scheduledDate.toISOString().split('T')[0],
        estimatedCost,
        daysUntilMaintenance: scheduledDays,
        urgencyLevel: maintenanceUrgency
      });
      
      totalMaintenanceCost += estimatedCost;
    });
    
    // Sort by priority and urgency
    maintenanceSchedule.sort((a, b) => {
      const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    const averageMaintenanceScore = vehicles.reduce((sum, v) => sum + v.maintenanceScore, 0) / vehicles.length;
    const fleetHealth = averageMaintenanceScore > 80 ? 'Excellent' : averageMaintenanceScore > 60 ? 'Good' : 'Poor';
    
    setResults(prev => ({
      ...prev,
      maintenanceScheduling: {
        success: true,
        result: {
          schedule: maintenanceSchedule,
          totalMaintenanceCost,
          preventiveMaintenanceRatio: (preventiveActions / vehicles.length) * 100,
          averageMaintenanceScore,
          fleetHealth,
          criticalVehicles: maintenanceSchedule.filter(m => m.priority === 'Critical').length,
          monthlyMaintenanceBudget: totalMaintenanceCost / 3 // Quarterly to monthly
        },
        recommendations: [
          `Fleet health status: ${fleetHealth} (Average score: ${averageMaintenanceScore.toFixed(1)})`,
          `Total maintenance budget needed: Ksh ${totalMaintenanceCost.toLocaleString()}`,
          `Preventive maintenance ratio: ${((preventiveActions / vehicles.length) * 100).toFixed(1)}%`,
          preventiveActions / vehicles.length > 0.7 ? "Excellent preventive maintenance strategy" : "Consider increasing preventive maintenance"
        ],
        formula: "Maintenance Priority = f(100 - Maintenance Score, Current Status, Usage Pattern)"
      }
    }));
  };

  // Fleet Utilization Calculation
  const calculateFleetUtilization = () => {
    const { usedHours = "160", totalHours = "200" } = inputs;
    
    const used = Number(usedHours);
    const total = Number(totalHours);
    
    if (total <= 0 || used < 0) {
      setResults(prev => ({
        ...prev,
        utilization: {
          success: false,
          result: null,
          recommendations: ["Please provide valid positive values"],
          formula: "Utilization = (Used Hours / Total Available Hours) × 100%"
        }
      }));
      return;
    }
    
    const utilizationRate = (used / total) * 100;
    const idleHours = total - used;
    const idleRate = (idleHours / total) * 100;
    
    // Fleet performance metrics
    const vehicles = sampleVehicles;
    const activeVehicles = vehicles.filter(v => v.status === 'in-use').length;
    const availableVehicles = vehicles.filter(v => v.status === 'available').length;
    const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
    
    const fleetUtilization = (activeVehicles / vehicles.length) * 100;
    const averageFuelEfficiency = vehicles.reduce((sum, v) => sum + v.fuelEfficiency, 0) / vehicles.length;
    
    let performanceGrade = 'Poor';
    if (utilizationRate > 85) performanceGrade = 'Excellent';
    else if (utilizationRate > 70) performanceGrade = 'Good';
    else if (utilizationRate > 50) performanceGrade = 'Average';
    
    const potentialRevenueLoss = idleHours * 2500; // Estimated revenue per hour
    
    setResults(prev => ({
      ...prev,
      utilization: {
        success: true,
        result: {
          utilizationRate,
          idleHours,
          idleRate,
          fleetUtilization,
          activeVehicles,
          availableVehicles,
          maintenanceVehicles,
          averageFuelEfficiency,
          performanceGrade,
          potentialRevenueLoss,
          efficiency: utilizationRate > 80 ? 'High' : utilizationRate > 60 ? 'Medium' : 'Low'
        },
        recommendations: [
          `Fleet utilization rate: ${utilizationRate.toFixed(1)}% (${performanceGrade})`,
          `Idle time: ${idleHours} hours (${idleRate.toFixed(1)}% of total)`,
          `Potential revenue loss from idle time: Ksh ${potentialRevenueLoss.toLocaleString()}`,
          utilizationRate > 80 ? "Excellent utilization - maintain current operations" : 
          utilizationRate > 60 ? "Good utilization - consider optimization opportunities" : 
          "Low utilization - immediate optimization required"
        ],
        formula: "Utilization = (Used Hours / Total Available Hours) × 100%"
      }
    }));
  };

  const renderResultCard = (resultKey: string, title: string) => {
    const result = results[resultKey];
    if (!result) return null;

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {title} Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {result.success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-semibold text-green-800">Analysis Complete</p>
                <p className="text-sm text-green-600">Formula: {result.formula}</p>
              </div>
              
              {/* Key Metrics Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(result.result).slice(0, 6).map(([key, value]) => (
                  <div key={key} className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm text-blue-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {typeof value === 'number' ? 
                        (key.includes('Cost') || key.includes('Revenue') ? 
                          `Ksh ${value.toLocaleString()}` : 
                          key.includes('Rate') || key.includes('Efficiency') || key.includes('Utilization') ? 
                            `${value.toFixed(1)}%` : 
                            value.toLocaleString()
                        ) : 
                        String(value)
                      }
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Detailed Results for Vehicle Assignment */}
              {resultKey === 'vehicleAssignment' && result.result.assignments && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Vehicle Assignments:</h4>
                  {result.result.assignments.map((assignment: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{assignment.vehicle.type} {assignment.vehicleId}</p>
                          <p className="text-sm text-gray-600">
                            Route: {assignment.route.origin} → {assignment.route.destination}
                          </p>
                          <p className="text-sm">
                            Utilization: {assignment.utilizationRate.toFixed(1)}%
                          </p>
                        </div>
                        <Badge variant={assignment.utilizationRate > 80 ? "default" : "secondary"}>
                          Ksh {assignment.cost.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Maintenance Schedule Display */}
              {resultKey === 'maintenanceScheduling' && result.result.schedule && (
                <div className="space-y-3">
                  <h4 className="font-semibold">Maintenance Schedule:</h4>
                  {result.result.schedule.slice(0, 5).map((maintenance: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{maintenance.vehicleType} {maintenance.vehicleId}</p>
                          <p className="text-sm text-gray-600">
                            Type: {maintenance.maintenanceType} | Due: {maintenance.scheduledDate}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm">Health Score:</span>
                            <Progress value={maintenance.maintenanceScore} className="w-20 h-2" />
                            <span className="text-sm">{maintenance.maintenanceScore}%</span>
                          </div>
                        </div>
                        <Badge variant={maintenance.priority === 'Critical' ? "destructive" : 
                                      maintenance.priority === 'High' ? "default" : "secondary"}>
                          {maintenance.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <p className="font-semibold">Recommendations:</p>
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold text-red-800">Analysis Failed</p>
              <p className="text-sm text-red-600">Formula: {result.formula}</p>
              <div className="mt-2 space-y-1">
                {result.recommendations.map((rec, index) => (
                  <p key={index} className="text-sm text-red-700">• {rec}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Fleet Management & Optimization</h2>
          <p className="text-muted-foreground">Comprehensive fleet optimization and maintenance scheduling</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vehicle-assignment">Vehicle Assignment</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle-assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Assignment Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Optimizes assignment of available vehicles to routes based on capacity, fuel efficiency, location, and maintenance status.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Available Vehicles:</h4>
                  {sampleVehicles.filter(v => v.status === 'available').map(vehicle => (
                    <div key={vehicle.id} className="text-sm mb-1">
                      {vehicle.type} {vehicle.id} - {vehicle.capacity}kg capacity - {vehicle.currentLocation}
                    </div>
                  ))}
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Pending Routes:</h4>
                  {sampleRoutes.map(route => (
                    <div key={route.id} className="text-sm mb-1">
                      {route.origin} → {route.destination} - {route.cargo}kg - {route.distance}km
                    </div>
                  ))}
                </div>
              </div>
              
              <Button onClick={calculateVehicleAssignment} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Optimize Vehicle Assignment
              </Button>
              {renderResultCard('vehicleAssignment', 'Vehicle Assignment Optimization')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Scheduling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Creates optimal maintenance schedules based on vehicle condition, usage patterns, and operational requirements.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Fleet Status:</h4>
                  {sampleVehicles.map(vehicle => (
                    <div key={vehicle.id} className="flex justify-between text-sm mb-2">
                      <span>{vehicle.type} {vehicle.id}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={vehicle.maintenanceScore} className="w-16 h-2" />
                        <span>{vehicle.maintenanceScore}%</span>
                        <Badge variant={vehicle.status === 'maintenance' ? 'destructive' : 
                                      vehicle.status === 'in-use' ? 'default' : 'secondary'}>
                          {vehicle.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Maintenance Types:</h4>
                  <div className="space-y-2 text-sm">
                    <div>• <strong>Preventive:</strong> Scheduled regular maintenance</div>
                    <div>• <strong>Corrective:</strong> Repair-based maintenance</div>
                    <div>• <strong>Critical:</strong> Immediate attention required</div>
                  </div>
                </div>
              </div>
              
              <Button onClick={calculateMaintenanceScheduling} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Generate Maintenance Schedule
              </Button>
              {renderResultCard('maintenanceScheduling', 'Maintenance Scheduling')}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Utilization Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="usedHours">Used Hours (Monthly)</Label>
                  <Input
                    id="usedHours"
                    type="number"
                    value={inputs.usedHours || ""}
                    onChange={e => handleInputChange('usedHours', e.target.value)}
                    placeholder="160"
                  />
                </div>
                <div>
                  <Label htmlFor="totalHours">Total Available Hours (Monthly)</Label>
                  <Input
                    id="totalHours"
                    type="number"
                    value={inputs.totalHours || ""}
                    onChange={e => handleInputChange('totalHours', e.target.value)}
                    placeholder="200"
                  />
                </div>
              </div>
              
              <Button onClick={calculateFleetUtilization} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Calculate Fleet Utilization
              </Button>
              {renderResultCard('utilization', 'Fleet Utilization Analysis')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveFleetManagement;
