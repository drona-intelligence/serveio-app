import { useAppDispatch, useAppSelector } from "@/App/hooks/hooks";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/App/slices/cartslice";

import { toast } from "sonner";

import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  ChefHat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // EMPTY STATE
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
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

        <Button
          variant="outline"
          onClick={() => {
            dispatch(clearCart());
            toast.success("Cart cleared 🧹");
          }}
        >
          Clear Cart
        </Button>
      </div>

      {/* CART ITEMS */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 md:items-center">
              {/* IMAGE */}
              <img
                src={
                  item.imageUrl ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                }
                className="w-full md:w-28 h-28 object-cover rounded-lg"
              />

              {/* INFO */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{item.name}</h2>

                  <Badge variant="secondary">Rs. {item.price}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <p className="text-sm font-medium text-green-600">
                  Subtotal: Rs. {item.price * item.quantity}
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    dispatch(decreaseQuantity(item.id));
                    toast.info("Quantity decreased", {
                      description: item.name,
                    });
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <span className="font-semibold w-6 text-center">
                  {item.quantity}
                </span>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    dispatch(increaseQuantity(item.id));
                    toast.success("Quantity increased", {
                      description: item.name,
                    });
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* DELETE */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  dispatch(removeFromCart(item.id));
                  toast.error("Item removed from cart", {
                    description: item.name,
                  });
                }}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SUMMARY CARD */}
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

          <Button className="w-full text-lg py-6 bg-green-500">
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
