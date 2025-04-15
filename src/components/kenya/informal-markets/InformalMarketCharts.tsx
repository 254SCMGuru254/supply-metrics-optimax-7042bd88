import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trafficData = [
  { time: "04:00", visitors: 1200 },
  { time: "06:00", visitors: 2800 },
  { time: "08:00", visitors: 3500 },
  { time: "10:00", visitors: 2900 },
  { time: "12:00", visitors: 2000 },
  { time: "14:00", visitors: 1800 },
  { time: "16:00", visitors: 2200 },
  { time: "18:00", visitors: 3000 },
  { time: "20:00", visitors: 2500 },
];

const revenueData = [
  { market: "Gikomba", revenue: 850000000 },
  { market: "Wakulima", revenue: 420000000 },
  { market: "Kongowea", revenue: 380000000 },
  { market: "Machakos", revenue: 290000000 },
  { market: "Eldoret", revenue: 270000000 },
];

export const MarketTrafficChart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hourly Market Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trafficData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarketRevenueChart = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Monthly Revenue by Market</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="market" />
              <YAxis
                tickFormatter={(value) => 
                  `${(value / 1000000).toFixed(0)}M`
                }
              />
              <Tooltip
                formatter={(value: number) => 
                  [`KES ${(value / 1000000).toFixed(1)}M`, "Revenue"]
                }
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue (KES)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};