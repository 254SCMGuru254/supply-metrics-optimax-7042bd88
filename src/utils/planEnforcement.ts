
import { supabase } from '@/integrations/supabase/client';

export const trackFeatureUsage = async (
  userId: string,
  featureType: string,
  incrementBy: number = 1
) => {
  try {
    // Get current usage
    const { data: currentUsage } = await supabase
      .from('usage_tracking')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('feature_type', featureType)
      .single();

    if (currentUsage) {
      // Update existing record
      await supabase
        .from('usage_tracking')
        .update({ usage_count: currentUsage.usage_count + incrementBy })
        .eq('user_id', userId)
        .eq('feature_type', featureType);
    } else {
      // Create new record
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          feature_type: featureType,
          usage_count: incrementBy
        });
    }
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

export const checkAndEnforceLimit = async (
  userId: string,
  featureType: string,
  requiredUsage: number = 1
): Promise<{ allowed: boolean; currentUsage: number; limit: number }> => {
  try {
    const { data, error } = await supabase.rpc('check_feature_access', {
      feature_name: featureType,
      current_usage: requiredUsage
    });

    if (error) {
      console.error('Error checking feature access:', error);
      return { allowed: false, currentUsage: 0, limit: 0 };
    }

    const result = data[0];
    return {
      allowed: result?.has_access || false,
      currentUsage: result?.current_usage_count || 0,
      limit: result?.usage_limit || 0
    };
  } catch (error) {
    console.error('Error enforcing limit:', error);
    return { allowed: false, currentUsage: 0, limit: 0 };
  }
};
