import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/App/store/store";
import { clearCredentials } from "@/App/slices/authslice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import MenusTab from "./MenusTab";
import CategoriesTab from "./CategoriesTab";
import MenuItemsTab from "./MenuItemsTab";
import OrdersTab from "./OrdersTab";
import NotificationsTab from "./NotificationsTab";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Check if user has ADMIN or OWNER role
    if (user && user.role !== "ADMIN" && user.role !== "OWNER") {
      navigate("/menu");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate("/login");
  };

  // Show nothing while checking authentication and role
  if (!isAuthenticated || !user || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || "Admin"} ({user?.role})
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="menus" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger 
              value="menus"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Menus
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value="items"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Menu Items
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menus">
            <MenusTab />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTab />
          </TabsContent>

          <TabsContent value="items">
            <MenuItemsTab />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
