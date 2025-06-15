
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface MetricsCardsProps {
  activeOptimizations: number;
  totalOptimizations: number;
  averageTime: number;
  totalErrors: number;
}

export const MetricsCards = ({ 
  activeOptimizations, 
  totalOptimizations, 
  averageTime, 
  totalErrors 
}: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Activity className="h-6 w-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{activeOptimizations}</div>
          <div className="text-sm text-gray-500">Active Optimizations</div>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold">{totalOptimizations}</div>
          <div className="text-sm text-gray-500">Total Completed</div>
        </CardContent>
      </Card>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <Clock className="h-6 w-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold">
            {averageTime ? (averageTime / 1000).toFixed(1) : 0}s
          </div>
          <div className="text-sm text-gray-500">Avg Response Time</div>
        </CardContent>
      </Card>
      
      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="flex flex-col items-center justify-center p-4">
          <AlertTriangle className="h-6 w-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold">{totalErrors}</div>
          <div className="text-sm text-gray-500">Total Errors</div>
        </CardContent>
      </Card>
    </div>
  );
};
