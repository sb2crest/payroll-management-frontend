import { IoIosArrowUp } from "react-icons/io";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdMoreTime } from "react-icons/md";
import { LuClipboardCheck } from "react-icons/lu";

const WidgetForEmployee = ({ type }) => {
  let data;

  //temporary
  const amount = 5;
  const diff = 20;

  switch (type) {
    case "payroll-expense":
      data = {
        title: "Payroll Expense",
        isMoney: true,
        link: "View Detailed Report",
        icon: (
          <FaMoneyCheckAlt
            className="p-1 mt-10 w-9 h-9"
            style={{ color: "#AB85F0" }}
          />
        ),
      };
      break;
    case "pending-payroll":
      data = {
        title: "Pending Payroll",
        isMoney: false,
        link: "Review Pending Approvals",
        icon: (
          <MdMoreTime
            className="p-1 mt-10 w-9 h-9"
            style={{ color: "#AB85F0" }}
          />
        ),
      };
      break;
    case "bonus":
      // eslint-disable-next-line no-unused-vars
      data = {
        title: "Bonus Distribution",
        isMoney: true,
        link: "View all the Bonus Details",
        icon: (
          <LuClipboardCheck
            className="p-1 mt-10 w-9 h-9"
            style={{ color: "#AB85F0" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="bg-white shadow-lg rounded p-4 flex items-center justify-between">
      <div className="flex flex-col justify-between">
        <span className="text-[#b4b5b5] text-md pt-3">{data.title}</span>
        <span className="text-2xl font-normal pt-3">
          {amount} {data.isMoney ? "$" : "Requests"}
        </span>
        <span className="text-xs font-medium text-[#4D5664] border-b border-[#4D5664] pt-3 cursor-pointer">
          {data.link}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <div
          className={`flex items-center ${
            diff > 0 ? "text-[#AB85F0]" : "text-red-500"
          }`}
        >
          <IoIosArrowUp className="w-5 h-5 mr-1" />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default WidgetForEmployee;
