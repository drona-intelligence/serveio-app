import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMenuItemsForCategoryQuery } from "@/App/apis/menuItemsApi";
import { useAddToCartMutation } from "@/App/apis/cartApi";
import type { MenuItem } from "@/types/types";
import { useAppSelector } from "@/App/hooks/hooks";
import { toast } from "sonner";
const MenuItems = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [addToCart] = useAddToCartMutation();
  const { menuid, categoryid } = useParams();

  const { data, isLoading, error } = useGetMenuItemsForCategoryQuery(
    categoryid || "",
    { skip: !categoryid },
  );

  const items: MenuItem[] = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading items…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-destructive">
          Failed to load items. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>

        <Link to={`/menu/${menuid}/categories`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* CONTENT */}
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No items available for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-44 w-full overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <UtensilsCrossed className="w-8 h-8 opacity-30" />
                  </div>
                )}
              </div>

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-bold text-green-600">
                    रू {item.price}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      item.isAvailable
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <CardTitle className="text-lg mt-2">{item.name}</CardTitle>

                {item.description && (
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent>
                <Button
                  disabled={!item.isAvailable || !isAuthenticated}
                  className="w-full gap-2 bg-red-500 hover:bg-red-700"
                  size="sm"
                  onClick={async () => {
                    if (!isAuthenticated) {
                      toast.error("Please log in to add items to your cart.");
                      navigate("/login");
                      return;
                    }

                    try {
                      await addToCart({
                        itemId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                      }).unwrap();

                      toast.success("Item added", {
                        description: `${item.name} added to cart`,
                      });
                    } catch (err: any) {
                      toast.error(err?.data?.message || "Failed to add item to cart.");
                    }
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {item.isAvailable
                    ? isAuthenticated
                      ? "Add to Cart"
                      : "Login to add"
                    : "Unavailable"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItems;
