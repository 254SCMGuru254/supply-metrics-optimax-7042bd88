import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import HeuristicCalculators from "@/components/heuristic/HeuristicCalculators";

const Heuristic = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="shadow-2xl border-teal-200">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6">
          <CardTitle className="text-2xl font-bold">Heuristic Optimization Suite</CardTitle>
          <CardDescription>
            Use heuristic models for rapid and effective supply chain problem-solving.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {projectId ? (
            <HeuristicCalculators projectId={projectId} />
          ) : (
            <p>Please select a project to continue.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Heuristic;
