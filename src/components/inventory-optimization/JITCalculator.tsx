import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateJITPolicy } from './InventoryOptimizationUtils';

export const JITCalculator: React.FC = () => {
  const [dailyDemand, setDailyDemand] = useState(250);
  const [leadTime, setLeadTime] = useState(3);
  const [bufferDays, setBufferDays] = useState(1);
  const [unitCost, setUnitCost] = useState(100);

  const item = {
    id: 'jit-temp',
    name: 'Generic SKU',
    sku: 'GEN-001',
    unitCost,
    demandRate: dailyDemand,
    holdingCostRate: 0.25,
    orderingCost: 500,
    leadTime,
  } as any;

  const jit = calculateJITPolicy(item, { bufferDays });

  return (
    <Card>
      <CardHeader>
        <CardTitle>JIT Policy Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Daily Demand (units)</Label>
            <Input type="number" value={dailyDemand} onChange={(e) => setDailyDemand(Number(e.target.value))} />
          </div>
          <div>
            <Label>Lead Time (days)</Label>
            <Input type="number" value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value))} />
          </div>
          <div>
            <Label>Buffer Days</Label>
            <Input type="number" value={bufferDays} onChange={(e) => setBufferDays(Number(e.target.value))} />
          </div>
          <div>
            <Label>Unit Cost (KES)</Label>
            <Input type="number" value={unitCost} onChange={(e) => setUnitCost(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="p-3 rounded border">
            <div className="text-sm text-muted-foreground">Reorder Point</div>
            <div className="text-2xl font-semibold">{jit.reorderPoint} units</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-sm text-muted-foreground">Delivery Interval</div>
            <div className="text-2xl font-semibold">{jit.deliveryIntervalDays} days</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-sm text-muted-foreground">JIT Order Quantity</div>
            <div className="text-2xl font-semibold">{jit.jitOrderQuantity} units</div>
          </div>
          <div className="p-3 rounded border">
            <div className="text-sm text-muted-foreground">Buffer</div>
            <div className="text-2xl font-semibold">{jit.bufferDays} day(s)</div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-2">
          Guidance: JIT minimizes on-hand inventory by matching delivery cadence to consumption. Keep supplier reliability and lead-time variability in mind when setting buffer days.
        </div>
      </CardContent>
    </Card>
  );
};
