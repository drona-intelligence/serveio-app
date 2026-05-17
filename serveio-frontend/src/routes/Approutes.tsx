import { createBrowserRouter, RouterProvider } from "react-router";
import Landing from "../pages/landing/Landing";
import Menu from "@/pages/menu/Menu";

export const Approutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        { index: true, element: <Landing></Landing> },
        { path: "/menu", element: <Menu></Menu> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};
