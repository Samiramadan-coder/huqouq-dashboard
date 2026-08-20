import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const stocks = [
  {
    title: "Peony",
    category: "Flowers",
    stock: 3,
    type: "low",
  },
  {
    title: "Lavender",
    category: "Flowers",
    stock: 10,
    type: "normal",
  },
  {
    title: "Baby's Breath",
    category: "Filler",
    stock: 8,
    type: "normal",
  },
  {
    title: "Tulip (Pink)",
    category: "Flowers",
    stock: 11,
    type: "low",
  },
  {
    title: "Gold Ribbon",
    category: "Packaging",
    stock: 5,
    type: "normal",
  },
];

export default function LockStock() {
  return (
    <Card className="p-0 h-full">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-400" />
            <p className="text-sm font-semibold text-foreground">
              Low Stock Alerts
            </p>
          </div>

          <Badge variant="destructive" className="h-7 w-15">
            5 items
          </Badge>
        </div>

        {stocks.map((stock, index) => (
          <div
            key={index}
            className={cn("flex items-center justify-between gap-4 p-4", {
              "border-b border-border": index !== stocks.length - 1,
            })}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(`w-2 h-2 rounded-full`, {
                  "bg-red-400": stock.type === "low",
                  "bg-primary": stock.type === "normal",
                })}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {stock.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stock.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p
                className={cn("text-sm font-semibold tabular-nums", {
                  "text-red-400": stock.type === "low",
                  "text-primary": stock.type === "normal",
                })}
              >
                {stock.stock} left
              </p>

              <Button
                variant="ghost"
                className="bg-primary/20 hover:text-primary text-primary"
              >
                <RefreshCcw /> Restock
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
