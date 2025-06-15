
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

    if (!paypalClientId) {
      throw new Error('Missing PayPal Client ID configuration')
    }

    const config = {
      clientId: paypalClientId,
      planIds: {
        starter: 'P-9AE64506NG041543SNBHQ6RY',
        business: 'P-81M148047K685451FNBHRAJQ',
        enterprise: 'P-27P56345UX5890405NBHRB2Y'
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
