import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <div className="sticky top-4 z-50 px-4">
        <Navbar />
      </div>
      <main className="pt-4">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
