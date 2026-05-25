import { useGetCategoriesForMenuQuery } from "@/App/apis/categoryApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader2, ChefHat, ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Categories = () => {
  const { menuid } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCategoriesForMenuQuery(
    menuid || "",
    { skip: !menuid },
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-2 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading categories…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-destructive">
          Failed to load categories. Please try again.
        </p>
      </div>
    );
  }

  const categories = data?.data ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>

        <Link to="/menu">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* CONTENT */}
      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No categories available for this menu.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() =>
                navigate(`/menu/${menuid}/categories/${category.id}/items`)
              }
              className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />

                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      category.status === "active"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-gray-100 text-gray-800 border-gray-300"
                    }`}
                  >
                    {category.status}
                  </Badge>
                </div>

                <CardTitle className="text-lg mt-2">{category.name}</CardTitle>

                {category.description && (
                  <CardDescription className="line-clamp-2">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent></CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
