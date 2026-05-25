import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

const OrdersTab = () => {
  // Placeholder data - will be replaced with real API calls later
  const orders = [
    {
      id: "ORD-001",
      customerName: "John Doe",
      items: 3,
      total: 45.99,
      status: "pending",
      time: "10 mins ago",
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      items: 2,
      total: 28.50,
      status: "preparing",
      time: "15 mins ago",
    },
    {
      id: "ORD-003",
      customerName: "Bob Johnson",
      items: 5,
      total: 67.25,
      status: "completed",
      time: "30 mins ago",
    },
    {
      id: "ORD-004",
      customerName: "Alice Brown",
      items: 1,
      total: 12.99,
      status: "cancelled",
      time: "1 hour ago",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <Package className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "pending":
        return "secondary";
      case "preparing":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            {orders.filter(o => o.status === "pending").length} Pending
          </Badge>
          <Badge className="text-sm bg-green-600">
            {orders.filter(o => o.status === "preparing").length} Preparing
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customerName}
                  </p>
                </div>
                <Badge 
                  variant={getStatusVariant(order.status)}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{order.items}</span> items
                  </p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ₹{order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8 text-muted-foreground border-t">
        <p className="text-sm">
          Full order management system coming soon
        </p>
      </div>
    </div>
  );
};

export default OrdersTab;
