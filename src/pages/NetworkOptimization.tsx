import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import NetworkCalculators from "@/components/network-optimization/NetworkCalculators";

const NetworkOptimization = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-2xl border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <CardTitle className="text-2xl font-bold">Network Optimization Suite</CardTitle>
          <CardDescription>
            Use advanced algorithms to find the optimal structure for your supply chain network.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <NetworkCalculators />
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkOptimization;
