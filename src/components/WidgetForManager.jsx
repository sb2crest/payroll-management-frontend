import React from "react";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { MdMoreTime } from "react-icons/md";
import { LuClipboardCheck } from "react-icons/lu";
import { IoIosArrowUp } from "react-icons/io";

const WidgetForManager = ({ type }) => {
  let data;

  //temporary
  const amount = 50000;
  const diff = 20;

  switch (type) {
    case "payroll":
      data = {
        title: "Payroll Summary",
        isMoney: true,
        link: "See Comparison Report",
        icon: (
          <FaMoneyCheckAlt
            className="p-1 mt-10 w-9 h-9"
            style={{ color: "#AB85F0" }}
          />
        ),
      };
      break;
    case "employeeHours":
      data = {
        title: "Employee Hours",
        isMoney: false,
        link: "View Departmental Breakdown",
        icon: (
          <MdMoreTime
            className="p-1 mt-10 w-9 h-9"
            style={{ color: "#AB85F0" }}
          />
        ),
      };
      break;
    case "cost":
      // eslint-disable-next-line no-unused-vars
      data = {
        title: "Cost Distribution",
        isMoney: true,
        link: "See Departmental Allocation",
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
          {amount} {data.isMoney ? "$" : "Hours"}
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

export default WidgetForManager;
