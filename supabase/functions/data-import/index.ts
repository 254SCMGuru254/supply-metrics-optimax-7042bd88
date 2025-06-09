
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportRequest {
  projectId: string
  fileName: string
  fileType: 'csv' | 'excel' | 'json'
  data: any[]
  dataType: 'nodes' | 'routes' | 'inventory'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { projectId, fileName, fileType, data, dataType }: ImportRequest = await req.json()

    // Create import record
    const { data: importRecord } = await supabaseClient
      .from('data_imports')
      .insert({
        project_id: projectId,
        file_name: fileName,
        file_type: fileType,
        file_size_bytes: JSON.stringify(data).length,
        status: 'processing'
      })
      .select()
      .single()

    let importedCount = 0
    const errors: string[] = []

    try {
      switch (dataType) {
        case 'nodes':
          importedCount = await importNodes(supabaseClient, projectId, data, errors)
          break
        case 'routes':
          importedCount = await importRoutes(supabaseClient, projectId, data, errors)
          break
        case 'inventory':
          importedCount = await importInventory(supabaseClient, projectId, data, errors)
          break
        default:
          throw new Error(`Unknown data type: ${dataType}`)
      }

      // Update import record
      await supabaseClient
        .from('data_imports')
        .update({
          status: errors.length > 0 ? 'completed' : 'completed',
          records_imported: importedCount,
          error_details: errors.length > 0 ? { errors } : null
        })
        .eq('id', importRecord?.id)

      return new Response(
        JSON.stringify({
          success: true,
          importedCount,
          errors,
          importId: importRecord?.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (error) {
      // Update import record with error
      await supabaseClient
        .from('data_imports')
        .update({
          status: 'failed',
          error_details: { error: error.message }
        })
        .eq('id', importRecord?.id)

      throw error
    }

  } catch (error) {
    console.error('Import error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function importNodes(supabaseClient: any, projectId: string, data: any[], errors: string[]) {
  let imported = 0

  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.name || !row.latitude || !row.longitude) {
        errors.push(`Row ${index + 1}: Missing required fields (name, latitude, longitude)`)
        continue
      }

      const nodeData = {
        project_id: projectId,
        name: row.name,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        node_type: row.node_type || 'customer',
        capacity: row.capacity ? parseFloat(row.capacity) : 0,
        demand: row.demand ? parseFloat(row.demand) : 0,
        fixed_cost: row.fixed_cost ? parseFloat(row.fixed_cost) : 0,
        variable_cost: row.variable_cost ? parseFloat(row.variable_cost) : 0,
        service_level: row.service_level ? parseFloat(row.service_level) : 95,
        properties: row.properties ? JSON.parse(row.properties) : {}
      }

      await supabaseClient
        .from('supply_nodes')
        .insert(nodeData)

      imported++
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`)
    }
  }

  return imported
}

async function importRoutes(supabaseClient: any, projectId: string, data: any[], errors: string[]) {
  let imported = 0

  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.origin_id || !row.destination_id) {
        errors.push(`Row ${index + 1}: Missing required fields (origin_id, destination_id)`)
        continue
      }

      const routeData = {
        project_id: projectId,
        origin_id: row.origin_id,
        destination_id: row.destination_id,
        distance: row.distance ? parseFloat(row.distance) : 0,
        cost_per_unit: row.cost_per_unit ? parseFloat(row.cost_per_unit) : 0,
        transit_time: row.transit_time ? parseFloat(row.transit_time) : 0,
        capacity: row.capacity ? parseFloat(row.capacity) : null,
        route_type: row.route_type || 'road',
        properties: row.properties ? JSON.parse(row.properties) : {}
      }

      await supabaseClient
        .from('supply_routes')
        .insert(routeData)

      imported++
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`)
    }
  }

  return imported
}

async function importInventory(supabaseClient: any, projectId: string, data: any[], errors: string[]) {
  let imported = 0

  for (const [index, row] of data.entries()) {
    try {
      // Validate required fields
      if (!row.sku || !row.unit_cost) {
        errors.push(`Row ${index + 1}: Missing required fields (sku, unit_cost)`)
        continue
      }

      const inventoryData = {
        project_id: projectId,
        sku: row.sku,
        description: row.description || '',
        unit_cost: parseFloat(row.unit_cost),
        holding_cost_rate: row.holding_cost_rate ? parseFloat(row.holding_cost_rate) : 0.25,
        ordering_cost: row.ordering_cost ? parseFloat(row.ordering_cost) : 100,
        lead_time_days: row.lead_time_days ? parseInt(row.lead_time_days) : 7,
        demand_rate: row.demand_rate ? parseFloat(row.demand_rate) : 0,
        safety_stock: row.safety_stock ? parseFloat(row.safety_stock) : 0,
        reorder_point: row.reorder_point ? parseFloat(row.reorder_point) : 0,
        abc_classification: row.abc_classification || 'C',
        node_id: row.node_id || null
      }

      await supabaseClient
        .from('inventory_items')
        .insert(inventoryData)

      imported++
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error.message}`)
    }
  }

  return imported
}
