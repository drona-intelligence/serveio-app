import { useNavigate } from "react-router-dom";
import { Home, Menu, ShoppingCart, User } from "lucide-react";

import { useAppSelector } from "@/App/hooks/hooks";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const navigate = useNavigate();

  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navlinks = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={20} />,
    },

    {
      name: "Cart",
      path: "/cart",
      icon: (
        <div className="relative">
          <ShoppingCart size={20} />

          {/* BADGE */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {cartCount}
            </span>
          )}
        </div>
      ),
    },

    {
      name: "Profile",
      path: "/profile",
      icon: <User size={20} />,
    },
  ];

  return (
    <nav className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between rounded-xl border-2 border-gray-300 bg-white px-6">
      {/* LOGO */}
      <div
        className="cursor-pointer text-2xl font-bold text-red-500"
        onClick={() => navigate("/")}
      >
        Serveio
      </div>

      {/* DESKTOP NAV */}
      <div className="hidden gap-6 md:flex">
        {navlinks.map((nav) => (
          <div
            key={nav.path}
            onClick={() => navigate(nav.path)}
            className="flex cursor-pointer items-center gap-2 font-medium text-gray-700 transition hover:text-red-600"
          >
            {nav.icon}
            {nav.name}
          </div>
        ))}
      </div>

      {/* MOBILE NAV */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader className="border-b pb-6 text-left">
              <SheetTitle className="text-2xl font-bold text-red-500">
                Serveio
              </SheetTitle>

              <SheetDescription>
                Discover great food, fast and fresh.
              </SheetDescription>
            </SheetHeader>

            {/* NAV LINKS */}
            <nav className="flex flex-col gap-2 py-6">
              {navlinks.map((nav) => (
                <div
                  key={nav.path}
                  onClick={() => navigate(nav.path)}
                  className="flex cursor-pointer items-center gap-4 rounded-lg px-4 py-3 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <span className="relative">{nav.icon}</span>

                  <span className="text-base font-medium">{nav.name}</span>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
