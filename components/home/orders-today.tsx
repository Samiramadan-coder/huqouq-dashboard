import { ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import TrendLineIcon from "../icons/trend-line-icon";

export default function OrdersToday() {
  return (
    <Card>
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Orders Today
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              18
            </p>
          </div>
          <div className="w-9 h-9 bg-secondary/20 rounded-md grid place-content-center">
            <ShoppingBag className="size-4 text-secondary" />
          </div>
        </header>

        <section className="flex items-center justify-between gap-4 mt-5">
          <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-4" /> +5 vs yesterday
          </p>

          <TrendLineIcon color="var(--secondary)" />
        </section>
      </CardContent>
    </Card>
  );
}
