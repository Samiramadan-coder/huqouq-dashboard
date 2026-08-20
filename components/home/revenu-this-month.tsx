"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

const data = [
  { date: "3 Jun", revenue: 2200 },
  { date: "4 Jun", revenue: 2450 },
  { date: "5 Jun", revenue: 2300 },
  { date: "6 Jun", revenue: 2100 },
  { date: "7 Jun", revenue: 2600 },
  { date: "8 Jun", revenue: 2500 },
  { date: "9 Jun", revenue: 3000 },
  { date: "10 Jun", revenue: 3150 },
  { date: "11 Jun", revenue: 2750 },
  { date: "12 Jun", revenue: 3350 },
  { date: "13 Jun", revenue: 2850 },
  { date: "14 Jun", revenue: 3650 },
  { date: "15 Jun", revenue: 3400 },
  { date: "16 Jun", revenue: 3000 },
  { date: "17 Jun", revenue: 3850 },
  { date: "18 Jun", revenue: 4000 },
  { date: "19 Jun", revenue: 3600 },
  { date: "20 Jun", revenue: 4650 },
  { date: "21 Jun", revenue: 4200 },
  { date: "22 Jun", revenue: 3350 },
  { date: "23 Jun", revenue: 4850 },
  { date: "24 Jun", revenue: 4450 },
  { date: "25 Jun", revenue: 4750 },
  { date: "26 Jun", revenue: 4200 },
  { date: "27 Jun", revenue: 5000 },
  { date: "28 Jun", revenue: 4600 },
  { date: "29 Jun", revenue: 4000 },
  { date: "30 Jun", revenue: 5050 },
  { date: "1 Jul", revenue: 4700 },
  { date: "2 Jul", revenue: 5200 },
  { date: "3 Jul", revenue: 3400 },
];

export default function RevenueThisMonth() {
  return (
    <Card className="h-full">
      <CardContent>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              REVENUE THIS MONTH
            </p>

            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              AED 102k
            </h3>
          </div>

          <Badge className="text-primary bg-primary/10 h-7 w-25">
            Last 30 days
          </Badge>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 4,
                right: 4,
                left: -18,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#cbb682" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#cbb682" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#eee9e2"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                ticks={["3 Jun", "10 Jun", "17 Jun", "24 Jun", "1 Jul"]}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{
                  fontSize: 11,
                  fill: "#7f746d",
                }}
              />

              <YAxis
                domain={[0, 6000]}
                ticks={[0, 2000, 3000, 4000, 5000, 6000]}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${Number(value) / 1000}k`}
                tick={{
                  fontSize: 11,
                  fill: "#7f746d",
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbb682",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #eee9e2",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `AED ${Number(value).toLocaleString()}`,
                  "Revenue",
                ]}
                labelStyle={{
                  color: "#111",
                  marginBottom: 4,
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#cbb682"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#cbb682",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
