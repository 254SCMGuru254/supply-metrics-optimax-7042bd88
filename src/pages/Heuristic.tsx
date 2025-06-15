
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import EnterpriseHeuristicCalculators from "@/components/heuristic/EnterpriseHeuristicCalculators";

const Heuristic = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Enterprise Heuristic Optimization Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <EnterpriseHeuristicCalculators />
        </CardContent>
      </Card>
    </div>
  );
};

export default Heuristic;
