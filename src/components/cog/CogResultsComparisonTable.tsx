
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Result {
  latitude: number;
  longitude: number;
  efficiencyScore?: number;
  algorithm: string;
}

interface Props {
  cogResults: { [key: string]: Result };
}

const getBestForDescription = (key: string) => {
  if (key === "weighted") return "Simple demand weighting";
  if (key === "geometric") return "Minimizing travel distance";
  if (key === "economic") return "Cost optimization";
  if (key === "manhattan") return "Grid-based logistics";
  if (key === "multiCriteria") return "Multiple objectives";
  if (key === "riskAdjusted") return "Risk management";
  if (key.includes("Season")) return "Seasonal planning";
  return "";
};

export const CogResultsComparisonTable: React.FC<Props> = ({ cogResults }) => {
  if (!Object.keys(cogResults).length) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>COG Methods Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-2 text-left">Method</th>
                <th className="border border-gray-300 p-2 text-left">Latitude</th>
                <th className="border border-gray-300 p-2 text-left">Longitude</th>
                <th className="border border-gray-300 p-2 text-left">Efficiency</th>
                <th className="border border-gray-300 p-2 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cogResults).map(([key, result]) => (
                <tr key={key}>
                  <td className="border border-gray-300 p-2 font-semibold">{result.algorithm}</td>
                  <td className="border border-gray-300 p-2">{result.latitude.toFixed(4)}</td>
                  <td className="border border-gray-300 p-2">{result.longitude.toFixed(4)}</td>
                  <td className="border border-gray-300 p-2">
                    <Badge variant="outline">{result.efficiencyScore}%</Badge>
                  </td>
                  <td className="border border-gray-300 p-2 text-sm">
                    {getBestForDescription(key)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CogResultsComparisonTable;
