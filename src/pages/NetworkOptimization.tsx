
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EnterpriseNetworkCalculators from "@/components/network-optimization/EnterpriseNetworkCalculators";

const NetworkOptimization = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Enterprise Network Optimization Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <EnterpriseNetworkCalculators />
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkOptimization;
