import { useGetAllOrdersQuery } from "@/App/apis/orderApi";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  Bell,
  Loader2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

const Orders = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetAllOrdersQuery(undefined);

  const normalizedOrders: Order[] = Array.isArray(orders)
    ? orders
    : (orders?.data ?? []);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "PREPARING":
        return <ChefHat className="w-5 h-5 text-purple-500" />;
      case "READY":
        return <Bell className="w-5 h-5 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PREPARING":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "READY":
        return "bg-green-100 text-green-800 border-green-300";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "CONFIRMED":
        return "✅";
      case "PREPARING":
        return "👨‍🍳";
      case "READY":
        return "🔔";
      case "COMPLETED":
        return "🎉";
      case "CANCELLED":
        return "❌";
      default:
        return "📋";
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const isUnauthorized = !!error && (error as any).status === 401;

  if (error) {
    if (isUnauthorized) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <Card className="max-w-md">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <XCircle className="h-12 w-12 text-red-500" />
              <div className="text-center">
                <h2 className="text-xl font-semibold">Login required</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  You must be logged in to view your orders and create new ones.
                </p>
              </div>
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <XCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Failed to load orders</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Please try again later or contact support if the problem
                persists.
              </p>
            </div>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (normalizedOrders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Package className="mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          When you place orders, they'll appear here.
        </p>
        <Button
          className="mt-6"
          onClick={() => (window.location.href = "/menu")}
        >
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {normalizedOrders.map((order: Order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`border ${getStatusColor(order.status)}`}
                >
                  {getStatusEmoji(order.status)} {order.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Order Items Summary */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                  Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-2">
                  {order.items
                    ?.slice(0, 2)
                    .map((item: OrderItem, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Nrs {item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          Nrs {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-muted-foreground text-center">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  Nrs {order.totalAmount?.toFixed(2) || "0.00"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewDetails(order)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedOrder && getStatusIcon(selectedOrder.status)}
              Order #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Placed{" "}
              {selectedOrder &&
                formatDistanceToNow(new Date(selectedOrder.createdAt), {
                  addSuffix: true,
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge
                  variant="outline"
                  className={`border ${getStatusColor(selectedOrder.status)}`}
                >
                  {getStatusEmoji(selectedOrder.status)} {selectedOrder.status}
                </Badge>
              </div>

              {/* All Items */}
              <div className="space-y-3">
                <h3 className="font-semibold">Order Items</h3>
                {selectedOrder.items?.map((item: OrderItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Nrs {item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold">
                      Nrs {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Nrs {selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Nrs 0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>Nrs 0.00</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      Nrs {selectedOrder.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Order placed:</span>
                  <span>
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated:</span>
                  <span>
                    {new Date(selectedOrder.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
