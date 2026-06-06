import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, XCircle, ChefHat, Bell, Loader2, RefreshCw } from "lucide-react";
import { useGetAdminOrdersQuery, useUpdateOrderMutation } from "@/App/apis/orderApi";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  id: string;
  userId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

const OrdersTab = () => {
  const { data: orders, isLoading, error, refetch } = useGetAdminOrdersQuery(undefined);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4" />;
      case "PREPARING":
        return <ChefHat className="h-4 w-4" />;
      case "READY":
        return <Bell className="h-4 w-4" />;
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PREPARING":
        return "bg-purple-100 text-purple-800";
      case "READY":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrder({
        orderId,
        data: { status: newStatus },
      }).unwrap();
      toast.success("Order status updated");
      refetch();
    } catch (error: any) {
      toast.error("Failed to update order status", {
        description: error.data?.message || "Please try again",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-muted-foreground">Failed to load orders</p>
        <Button onClick={() => refetch()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const ordersList = (orders as Order[]) || [];
  const pendingCount = ordersList.filter((o) => o.status === "PENDING").length;
  const preparingCount = ordersList.filter((o) => o.status === "PREPARING").length;

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
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {pendingCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {pendingCount} Pending
            </Badge>
          )}
          {preparingCount > 0 && (
            <Badge className="text-sm bg-purple-600">
              {preparingCount} Preparing
            </Badge>
          )}
        </div>
      </div>

      {ordersList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ordersList.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(0, 8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      User ID: {order.userId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items Summary */}
                <div className="space-y-2">
                  {order.items?.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-muted-foreground">
                        Nrs {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* Total and Actions */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold text-green-600">
                      Nrs {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">⏳ Pending</SelectItem>
                        <SelectItem value="CONFIRMED">✅ Confirmed</SelectItem>
                        <SelectItem value="PREPARING">👨‍🍳 Preparing</SelectItem>
                        <SelectItem value="READY">🔔 Ready</SelectItem>
                        <SelectItem value="COMPLETED">🎉 Completed</SelectItem>
                        <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
