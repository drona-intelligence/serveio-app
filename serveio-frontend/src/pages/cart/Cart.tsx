import { useAppSelector } from "@/App/hooks/hooks";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "@/App/apis/cartApi";
import { useGetMenuItemByIdQuery } from "@/App/apis/menuItemsApi";
import { useCreateOrderMutation } from "@/App/apis/orderApi";

import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  ChefHat,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type CartItemResponse = {
  id: string;
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  description?: string | null;
  imageUrl?: string | null;
};

const CartItemImage = ({
  itemId,
  imageUrl,
  name,
}: {
  itemId: string;
  imageUrl?: string | null;
  name: string;
}) => {
  const { data } = useGetMenuItemByIdQuery(itemId, {
    skip: Boolean(imageUrl),
  });

  const resolvedImageUrl = imageUrl?.trim()
    ? imageUrl
    : data?.data?.imageUrl?.trim()
    ? data.data.imageUrl
    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";

  return (
    <img
      src={resolvedImageUrl}
      alt={name}
      className="w-full md:w-28 h-28 object-cover rounded-lg"
    />
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const {
    data: cartResponse,
    isLoading,
    error,
    refetch,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: true,
  });

  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  const cartItems: CartItemResponse[] = cartResponse?.data?.items ?? [];

  const total = cartItems.reduce<number>(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
      };

      const result = await createOrder(orderData).unwrap();

      toast.success("Order placed successfully! 🎉", {
        description: `Order #${result.orderId || result.id}`,
      });

      await Promise.all(
        cartItems.map((item: CartItemResponse) => removeFromCart(item.id).unwrap()),
      );
      await refetch();

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast.error("Failed to place order", {
        description: error.data?.message || "Please try again later",
      });
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      await updateCartItem({ itemId, quantity }).unwrap();
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity.");
    }
  };

  const handleRemove = async (itemId: string, name: string) => {
    try {
      await removeFromCart(itemId).unwrap();
      toast.success("Item removed from cart", { description: name });
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item: CartItemResponse) => removeFromCart(item.id).unwrap()),
      );
      toast.success("Cart cleared 🧹");
      await refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear cart.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />

        <h1 className="text-2xl font-bold">Please log in to view your cart</h1>
        <p className="text-muted-foreground mt-2">
          Cart items are saved in your account and available after login.
        </p>

        <Button
          className="mt-6"
          onClick={() => navigate("/login")}
        >
          Log in
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Trash2 className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Unable to load cart</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Please try again later or refresh the page.
              </p>
            </div>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />

        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">
          Add delicious items from the menu to start your order.
        </p>

        <Link to="/menu" className="mt-6">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

        <Button variant="outline" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
              <CartItemImage
                itemId={item.itemId}
                imageUrl={item.imageUrl}
                name={item.name}
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <Badge variant="secondary">Rs. {item.price}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description ?? ""}
                </p>

                <p className="text-sm font-medium text-green-600">
                  Subtotal: Rs. {item.price * item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <span className="font-semibold w-6 text-center">
                  {item.quantity}
                </span>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(item.id, item.name)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <ChefHat className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>Rs. {total}</span>
          </div>

          <Separator />

          <Button
            className="w-full text-lg py-6 bg-green-500"
            onClick={handleCheckout}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
