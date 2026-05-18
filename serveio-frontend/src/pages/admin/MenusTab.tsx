import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllMenusQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
} from "@/App/apis/adminApi";
import { menuSchema, type MenuFormData } from "@/schemas/admin.schemas";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MenusTab = () => {
  const { data, isLoading } = useGetAllMenusQuery();
  const [createMenu] = useCreateMenuMutation();
  const [updateMenu] = useUpdateMenuMutation();
  const [deleteMenu] = useDeleteMenuMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema) as any,
  });

  const onSubmit = async (data: MenuFormData) => {
    try {
      if (editingMenu) {
        await updateMenu({ id: editingMenu.id, data }).unwrap();
        toast.success("Menu updated successfully");
      } else {
        await createMenu(data).unwrap();
        toast.success("Menu created successfully");
      }
      setIsDialogOpen(false);
      reset();
      setEditingMenu(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (menu: any) => {
    setEditingMenu(menu);
    setValue("name", menu.name);
    setValue("description", menu.description || "");
    setValue("status", menu.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu?")) return;
    try {
      await deleteMenu(id).unwrap();
      toast.success("Menu deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Delete failed");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    reset();
    setEditingMenu(null);
  };

  if (isLoading) return <div>Loading...</div>;

  const menus = data?.data || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Menus</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingMenu(null)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? "Edit Menu" : "Create Menu"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("status", value as "active" | "inactive")
                  }
                  defaultValue="active"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menus.map((menu: any) => (
          <Card key={menu.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{menu.name}</CardTitle>
                  <CardDescription>{menu.description}</CardDescription>
                </div>
                <Badge
                  variant={menu.status === "active" ? "default" : "secondary"}
                >
                  {menu.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(menu)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(menu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MenusTab;
