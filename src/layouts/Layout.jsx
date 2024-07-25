import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/theme-context";

function Layout() {
  const { theme } = useTheme();
  return (
    <div
      className="flex w-full "
      // style={{ background: theme.colors.globalBackgroundColor }}
    >
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
