import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/auth-context";
import { useEffect } from "react";

function Layout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login/1");
    }
  }, [loading, isAuthenticated]);
  const { theme } = useTheme();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full">
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
