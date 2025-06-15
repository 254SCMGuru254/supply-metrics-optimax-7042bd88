
import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LockIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanGuardProps {
  children: React.ReactNode;
  requiredPlan: 'starter' | 'business' | 'enterprise';
  feature: string;
  fallback?: React.ReactNode;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({
  children,
  requiredPlan,
  feature,
  fallback
}) => {
  const { subscription, checkFeatureAccess, loading } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('starter');

  useEffect(() => {
    const checkAccess = async () => {
      const result = await checkFeatureAccess(feature);
      setHasAccess(result.hasAccess);
      setCurrentPlan(result.currentPlan);
    };

    if (!loading) {
      checkAccess();
    }
  }, [checkFeatureAccess, feature, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const planHierarchy = ['starter', 'business', 'enterprise'];
  const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
  const currentPlanIndex = planHierarchy.indexOf(currentPlan);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <LockIcon className="h-8 w-8 text-orange-500" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Premium Feature
          <Badge variant="outline">{requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}+ Required</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800">Access Restricted</span>
          </div>
          <p className="text-sm text-orange-700">
            This feature requires a {requiredPlan} plan or higher. 
            You're currently on the {currentPlan} plan.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-muted-foreground">
            Upgrade your plan to unlock advanced supply chain optimization features and increase your usage limits.
          </p>
          
          <div className="flex gap-2 justify-center">
            <Link to="/pricing">
              <Button className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>✓ Instant activation after payment</p>
          <p>✓ Secure PayPal billing</p>
          <p>✓ Cancel anytime</p>
        </div>
      </CardContent>
    </Card>
  );
};
