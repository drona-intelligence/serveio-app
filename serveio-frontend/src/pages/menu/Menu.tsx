import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2, UtensilsCrossed, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useGetAllMenusQuery } from "@/App/apis/menuApi";
import type { Menu as MenuType } from "@/types/types";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Menu = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllMenusQuery();

  useEffect(() => {
    if (isError) {
      const message =
        error && "status" in error
          ? `Server error ${(error as { status: number }).status}`
          : "Failed to load menus";
      toast.error(message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading menus…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-destructive">
          Could not load menus. Please try again.
        </p>
      </div>
    );
  }

  const menus: MenuType[] = data?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Our Menus</h1>

      {menus.length === 0 ? (
        <p className="text-sm text-muted-foreground">No menus available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map((menu) => (
            <Card
              key={menu.id}
              onClick={() => navigate(`/menu/${menu.id}/categories`)}
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      menu.status === "active"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-900 text-white border-gray-900"
                    }`}
                  >
                    {menu.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{menu.name}</CardTitle>
                {menu.description && (
                  <CardDescription className="line-clamp-2">
                    {menu.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{menu.categories.length} categories</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
