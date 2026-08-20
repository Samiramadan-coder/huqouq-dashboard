import { Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import TrendLineIcon from "../icons/trend-line-icon";
import { Badge } from "../ui/badge";

export default function PendingOrders() {
  return (
    <Card>
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Pending Orders
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              4
            </p>
          </div>
          <div className="w-9 h-9 bg-red-500/20 rounded-md grid place-content-center">
            <Clock className="size-4 text-red-500" />
          </div>
        </header>

        <section className="flex items-center justify-between gap-4 mt-5">
          <Badge className="h-7 w-30" variant="destructive">
            Needs attention
          </Badge>

          <TrendLineIcon color="var(--color-red-500)" />
        </section>
      </CardContent>
    </Card>
  );
}
