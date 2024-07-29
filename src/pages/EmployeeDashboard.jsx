import WidgetForEmployee from "../components/WidgetForEmployee";
import GraphForManager from "../components/GraphForManager";
import IncomeVsOutcomeChart from "../components/ui/IncomeVsOutcomeChart";

const EmployeeDashboard = () => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        <WidgetForEmployee type="payroll-expense" />
        <WidgetForEmployee type="pending-payroll" />
        <WidgetForEmployee type="bonus" />
        <GraphForManager />
        <IncomeVsOutcomeChart />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
