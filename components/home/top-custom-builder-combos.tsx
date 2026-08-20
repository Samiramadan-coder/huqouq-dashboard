import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { Card, CardContent } from "../ui/card";

const orders = [
  {
    title: "Peony",
    total: 40,
    percent: 20,
  },
  {
    title: "Lavender",
    total: 30,
    percent: 70,
  },
  {
    title: "Baby's Breath",
    total: 20,
    percent: 35,
  },
  {
    title: "Tulip (Pink)",
    total: 15,
    percent: 45,
  },
  {
    title: "Gold Ribbon",
    total: 10,
    percent: 80,
  },
];

export default function TopCustomBuilderCombos() {
  return (
    <Card className="p-0 h-full">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            Top Custom Builder Combos
          </p>
          <p className="text-xs text-muted-foreground">
            Most-picked flower combinations this month
          </p>
        </div>

        {orders.map((order, index) => (
          <div
            key={index}
            className={cn("p-4", {
              "border-b border-border": index !== orders.length - 1,
            })}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-xs grid place-content-center rounded-full bg-primary text-white">
                  {index + 1}
                </div>
                <p className="font-semibold">{order.title}</p>
              </div>

              <div className="text-xs text-muted-foreground">
                {order.total} orders
              </div>
            </div>

            <Progress value={order.percent} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
