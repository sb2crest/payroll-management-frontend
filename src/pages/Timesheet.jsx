import Input from "../components/ui/Input";
import Search from "../components/ui/Search";
import Typebutton from "../components/ui/Typebutton";
import { IoFilterSharp } from "react-icons/io5";

const Timesheet = () => {
  return (
    <div className="m-6">
      <div className="p-2">
        <Search placeholder={"Search by ID or name"} />
      </div>
      <div className="p-2">
        Bottom
      </div>
    </div>
  );
};

export default Timesheet;
