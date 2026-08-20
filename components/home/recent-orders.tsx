import { ArrowRight, TabletSmartphone, GlobeCheck } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const orders = [
  {
    order: "ORD-001",
    customer: "John Doe",
    items: "Rosa Bouquet × 1",
    total: "150",
    status: "Pending",
    ch: "mobile",
  },
  {
    order: "ORD-002",
    customer: "Jane Smith",
    items: "Rosa Bouquet × 1",
    total: "100",
    status: "Processing",
    ch: "web",
  },
  {
    order: "ORD-003",
    customer: "Michael Johnson",
    items: "Rosa Bouquet × 1",
    total: "250",
    status: "Delivered",
    ch: "mobile",
  },
  {
    order: "ORD-004",
    customer: "Emily Davis",
    items: "Rosa Bouquet × 1",
    total: "50",
    status: "Delivered",
    ch: "web",
  },
];

export default function RecentOrders() {
  return (
    <Card className="p-0 h-full">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Recent Orders</p>

          <Link href="/orders">
            <Button
              variant="ghost"
              className="text-xs hover:bg-transparent hover:text-primary text-primary"
            >
              View all
              <ArrowRight />
            </Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 text-muted-foreground uppercase text-xs">
                Order
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Customer
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Items
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Total
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                CH
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="py-4 ps-6 text-xs">
                  {order.order}
                </TableCell>
                <TableCell className="text-sm">{order.customer}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.items}
                </TableCell>
                <TableCell className="text-sm">AED {order.total}</TableCell>
                <TableCell className="text-sm">
                  <Badge
                    className={
                      order.status === "Pending"
                        ? "bg-red-100 text-red-600"
                        : order.status === "Processing"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary/20 text-secondary"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {order.ch === "web" ? (
                    <GlobeCheck className="size-4 text-muted-foreground" />
                  ) : (
                    <TabletSmartphone className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
