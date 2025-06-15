
import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

interface UsageMeterProps {
  feature: string;
  label: string;
  currentUsage?: number;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  feature,
  label,
  currentUsage = 0
}) => {
  const { checkFeatureAccess, getPlanLimits, subscription } = useSubscription();
  const { user } = useAuth();
  const [usageData, setUsageData] = useState({
    hasAccess: true,
    currentPlan: 'starter',
    usageLimit: 0,
    usage: currentUsage
  });

  useEffect(() => {
    const fetchUsageData = async () => {
      if (!user) return;

      // Get current usage from database
      const { data: usageRecord } = await supabase
        .from('usage_tracking')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('feature_type', feature)
        .single();

      const actualUsage = usageRecord?.usage_count || currentUsage;

      // Check access and limits
      const accessResult = await checkFeatureAccess(feature, actualUsage);
      
      setUsageData({
        ...accessResult,
        usage: actualUsage
      });
    };

    fetchUsageData();
  }, [user, feature, currentUsage, checkFeatureAccess]);

  const { hasAccess, currentPlan, usageLimit, usage } = usageData;
  const planLimits = getPlanLimits(currentPlan);
  
  // Calculate usage percentage
  const usagePercentage = usageLimit === -1 ? 0 : Math.min((usage / usageLimit) * 100, 100);
  const isNearLimit = usagePercentage > 80;
  const isAtLimit = usagePercentage >= 100;

  // Get color based on usage
  const getProgressColor = () => {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{label}</span>
          <Badge variant={hasAccess ? "default" : "destructive"}>
            {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Usage</span>
          <span className="font-medium">
            {usage.toLocaleString()} / {usageLimit === -1 ? '∞' : usageLimit.toLocaleString()}
          </span>
        </div>

        {usageLimit !== -1 && (
          <div className="space-y-2">
            <Progress 
              value={usagePercentage} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {usagePercentage.toFixed(1)}% used
              </span>
              {isNearLimit && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Near limit</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isAtLimit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Limit Reached</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Upgrade your plan to continue using this feature.
            </p>
          </div>
        )}

        {usageLimit === -1 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Unlimited</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              No usage limits on your current plan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
