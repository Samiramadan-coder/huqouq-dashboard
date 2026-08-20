"use client";

import { Globe, Smartphone } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  PieSectorShapeProps,
} from "recharts";

type DonutChartItem = {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

const data: DonutChartItem[] = [
  {
    label: "Mobile App",
    value: 62,
    color: "#cbb682",
    icon: <Smartphone size={12} />,
  },
  {
    label: "Website",
    value: 38,
    color: "#7f967b",
    icon: <Globe size={12} />,
  },
];

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as DonutChartItem;

  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={3} />
  );
}

export default function OrdersByChannel() {
  return (
    <Card>
      <CardContent>
        <div>
          <p className="uppercase text-muted-foreground text-sm">
            Orders by Channel
          </p>
          <p className="font-semibold text-foreground">548</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </div>

        <div className="w-full h-45 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="#ffffff"
                strokeWidth={3}
                shape={DonutSlice}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="flex items-center gap-1 text-sm text-foreground">
                  {item.icon && (
                    <span className="text-muted-foreground">{item.icon}</span>
                  )}

                  {item.label}
                </span>
              </div>

              <span
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
