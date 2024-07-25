import WidgetForManager from "../components/WidgetForManager";
import GraphForManager from "../components/GraphForManager";
import IncomeVsOutcomeChart from "../components/ui/IncomeVsOutcomeChart";

function Dashboard() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        <WidgetForManager type="payroll" />
        <WidgetForManager type="employeeHours" />
        <WidgetForManager type="cost" />
        <GraphForManager />
        <IncomeVsOutcomeChart />
      </div>
    </div>
  );
}

export default Dashboard;
