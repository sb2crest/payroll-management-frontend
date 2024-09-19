import { Outlet, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/auth-context";
import { useEffect } from "react";

function Layout() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const { companyID } = useParams();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(`/login/${companyID}`);
    }
  }, [loading, isAuthenticated]);

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
