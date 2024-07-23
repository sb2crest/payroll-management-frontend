import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Layout() {
  return (
    <div className="flex w-full bg-indigo-50/50">
      <div>
        <Sidebar />
      </div>
      <div>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
