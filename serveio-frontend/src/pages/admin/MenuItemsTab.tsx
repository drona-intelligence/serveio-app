import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { menuItemSchema, type MenuItemFormData } from "@/schemas/admin.schemas";
import {
  useGetAllMenusQuery,
  useGetCategoriesForMenuQuery,
  useGetMenuItemsForCategoryQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} from "@/App/apis/adminApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { MenuItem } from "@/types/types";

const MenuItemsTab = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const { data: menusData } = useGetAllMenusQuery();
  const { data: categoriesData } = useGetCategoriesForMenuQuery(selectedMenuId, {
    skip: !selectedMenuId,
  });
  const { data: itemsData, isLoading } = useGetMenuItemsForCategoryQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      isAvailable: true,
      imageUrl: "",
      displayOrder: 0,
    },
  });

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      form.reset({
        name: item.name,
        description: item.description || "",
        price: item.price,
        isAvailable: item.isAvailable,
        imageUrl: item.imageUrl || "",
        displayOrder: item.displayOrder,
      });
    } else {
      setEditingItem(null);
      form.reset({
        name: "",
        description: "",
        price: 0,
        isAvailable: true,
        imageUrl: "",
        displayOrder: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: MenuItemFormData) => {
    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem.id, data }).unwrap();
        toast.success("Menu item updated successfully");
      } else {
        if (!selectedCategoryId) {
          toast.error("Please select a category first");
          return;
        }
        await createMenuItem({ categoryId: selectedCategoryId, data }).unwrap();
        toast.success("Menu item created successfully");
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      form.reset();
    } catch (error: any) {
      const errorMessage = error?.data?.error || error?.error || "Failed to save menu item";
      toast.error(errorMessage);
      console.error("Failed to save menu item:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id).unwrap();
        toast.success("Menu item deleted successfully");
      } catch (error: any) {
        const errorMessage = error?.data?.error || error?.error || "Failed to delete menu item";
        toast.error(errorMessage);
        console.error("Failed to delete menu item:", error);
      }
    }
  };

  const menus = menusData?.data || [];
  const categories = categoriesData?.data || [];
  const items = itemsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-4 flex-1">
          <Select
            value={selectedMenuId}
            onValueChange={(value) => {
              setSelectedMenuId(value);
              setSelectedCategoryId("");
            }}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select a menu" />
            </SelectTrigger>
            <SelectContent>
              {menus.map((menu) => (
                <SelectItem key={menu.id} value={menu.id}>
                  {menu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCategoryId}
            onValueChange={setSelectedCategoryId}
            disabled={!selectedMenuId}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-green-600 hover:bg-green-700"
              disabled={!selectedCategoryId}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Menu Item" : "Create New Menu Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem 
                  ? "Update the menu item details below." 
                  : "Fill in the details to create a new menu item."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Item description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="displayOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isAvailable"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Is this item currently available for ordering?
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {!selectedCategoryId ? (
        <div className="text-center py-12 text-muted-foreground">
          Please select a menu and category to view and manage items
        </div>
      ) : isLoading ? (
        <div className="text-center py-12">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No items found. Create your first menu item!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{item.name}</span>
                  <Badge variant={item.isAvailable ? "default" : "secondary"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-sm text-muted-foreground mb-2">
                  {item.description || "No description"}
                </p>
                <p className="text-lg font-bold text-green-600 mb-2">
                  ₹{item.price.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Display Order: {item.displayOrder}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItemsTab;
