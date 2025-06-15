
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get PayPal configuration from Supabase secrets
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const starterPlanId = Deno.env.get('P-9AE64506NG041543SNBHQ6RY')
    const businessPlanId = Deno.env.get('P-81M148047K685451FNBHRAJQ')
    const enterprisePlanId = Deno.env.get('P-27P56345UX5890405NBHRB2Y')

    if (!paypalClientId || !starterPlanId || !businessPlanId || !enterprisePlanId) {
      throw new Error('Missing PayPal configuration')
    }

    const config = {
      clientId: paypalClientId,
      planIds: {
        starter: starterPlanId,
        business: businessPlanId,
        enterprise: enterprisePlanId
      }
    }

    return new Response(
      JSON.stringify(config),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
