import { useAuth } from '../context/auth-context';
import Dashboard from '../pages/Dashboard';
import EmployeeDashboard from '../pages/EmployeeDashboard'; 

const MainDashboard = () => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in to view the dashboard.</div>;
  }

  return (
    <div>
      {role === 'manager' ? <Dashboard /> : <EmployeeDashboard />}
    </div>
  );
};

export default MainDashboard;
