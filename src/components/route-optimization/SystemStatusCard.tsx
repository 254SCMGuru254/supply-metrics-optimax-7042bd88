
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

interface SystemStatusCardProps {
  healthStatus: 'healthy' | 'warning' | 'critical' | 'unknown';
}

export const SystemStatusCard = ({ healthStatus }: SystemStatusCardProps) => {
  const healthColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Production System Status
          <Badge className={`${healthColors[healthStatus]} text-white`}>
            {healthStatus.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
