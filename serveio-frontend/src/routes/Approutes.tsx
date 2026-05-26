import RootLayout from "@/layouts/RootLayout";
import Cart from "@/pages/cart/Cart";
import Categories from "@/pages/categories/Categories";
import Landing from "@/pages/landing/Landing";
import Login from "@/pages/login/Login";
import Menu from "@/pages/menu/Menu";
import MenuItems from "@/pages/menuitems/MenuItems";
import NotFound from "@/pages/notfound/Notfound";
import Profile from "@/pages/profile/Profile";
import Updateprofile from "@/pages/profile/Updateprofile";
import Register from "@/pages/register/Register";
import Dashboard from "@/pages/admin/Dashboard";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export const Approutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <Landing /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <NotFound /> },

        {
          element: <RootLayout />,
          children: [
            { path: "menu", element: <Menu /> },
            { path: "menu/:menuid/categories", element: <Categories /> },
            {
              path: "menu/:menuid/categories/:categoryid/items",
              element: <MenuItems />,
            },
            { path: "profile", element: <Profile /> },
            { path: "profile/edit", element: <Updateprofile /> },
            { path: "cart", element: <Cart /> },
            { path: "*", element: <NotFound /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
