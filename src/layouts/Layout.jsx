import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Layout() {
  return (
    <div className="flex w-full bg-[#F5F5F5]">
      <div>
        <Sidebar />
      </div>
      <div className="flex-1">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
