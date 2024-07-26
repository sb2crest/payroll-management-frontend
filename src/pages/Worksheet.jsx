import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useTheme } from "../context/theme-context";

const Worksheet = () => {
  const [submitHours, setSubmitHours] = useState(false);
  const { colors } = useTheme();
  const [modifyHours, setModifyHours] = useState(false);
  const [overTime, setOverTime] = useState(0);
  const [totalHours, setTotalHours] = useState(45);

  const [data, setData] = useState([
    {
      status: "DRAFT",
      employeeId: "EMP001",
      firstName: "John",
      lastName: "Doe",
      startDate: "2024-05-01",
      endDate: "2024-05-05",
      defaultHours: 160,
      overtimeHours: 0,
      totalHours: 0,
    },
  ]);

  // Define colors for different statuses
  const statusColors = {
    DRAFT: "orange",
    PENDING: "gold",
    APPROVED: "green",
    REJECTED: "red",
  };

  // Function to handle over time input change
  const handleOverTimeChange = (event) => {
    const newOverTime = parseFloat(event.target.value) || 0; // Parse the input as a number
    setOverTime(newOverTime);
    setTotalHours(45 + newOverTime); // Update total hours
  };

  return (
    <>
      {submitHours ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Edit Hours</h3>
                </div>
                {/*body*/}
                <div className="p-4">
                  <div className="flex">
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Status
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        DRAFT
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        WorkSheet ID
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        PAYBR2345679
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Start Date
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        2024-05-01
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        End Date
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        2024-05-05
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Default Hours
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        45 Hours
                      </span>
                    </div>
                  </div>
                </div>
                <div className="">
                  <div>
                    <button
                      className="ml-4 mb-2 text-[#AB85F0] font-semibold px-2 rounded text-sm"
                      onClick={() => setModifyHours(true)}
                    >
                      Modify Hours +
                    </button>
                    {modifyHours && (
                      <>
                        <div className="grid grid-cols-2 gap-6 pl-6 pr-6 pb-2">
                          <div className="flex flex-col">
                            <label className="text-sm mb-1 text-[#9d9d9dee] font-medium ">
                              Over Time
                            </label>
                            <input
                              className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                              value={overTime}
                              onChange={handleOverTimeChange}
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm mb-1 text-[#9d9d9dee] font-medium ">
                              Total Hours
                            </label>
                            <input
                              className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                              value={`${totalHours} Hours`}
                              readOnly
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-between p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-white background-transparent rounded px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 bg-[#AB85F0]"
                    type="button"
                    onClick={() => {
                      setSubmitHours(false);
                      setModifyHours(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="text-white background-transparent rounded px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 bg-[#AB85F0]"
                    type="button"
                    onClick={() => setSubmitHours(false)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        <>
          <div className="m-6">
            <div className="bg-white p-10 mt-6 rounded-lg shadow-md relative">
              <div
                className="relative max-w-[400px] border-[1px] rounded-lg overflow-hidden"
                style={{ borderColor: colors.accent }}
              >
                <button className="absolute top-1/2 left-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg">
                  <CiSearch />
                </button>
                <input
                  type="text"
                  className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                  placeholder="Search by date"
                />
              </div>
              <table
                className="my-auto border-2 border-white w-full rounded mt-5 overflow-hidden"
                style={{ background: "#eee" }}
              >
                <thead className="border-b-2 border-b-white">
                  <tr>
                    <th
                      className="border-2 border-white p-2 text-sm font-bold"
                      style={{ color: colors.secondary }}
                    >
                      Status
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      WorkSheet ID
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      First Name
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Last Name
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Start Date
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      End Date
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Default Hours
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Overtime Hours
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Total Hours
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td
                        className="border-2 border-white p-2 text-sm underline cursor-pointer"
                        style={{ color: statusColors[row.status] || "black" }}
                        onClick={() => setSubmitHours(true)}
                      >
                        {row.status}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.employeeId}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.firstName}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.lastName}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.startDate}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.endDate}
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.defaultHours} Hours
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.overtimeHours} Hours
                      </td>
                      <td className="border-2 border-white p-2 text-sm">
                        {row.totalHours} Hours
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex sm:flex-row flex-col w-full mt-8 items-center gap-2 text-xs">
                <div className="sm:mr-auto sm:mb-0 mb-2">
                  <span className="mr-2">Items per page</span>
                  <select className="border p-1 rounded w-16 border-gray-200">
                    {[2, 4, 6, 8].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button>
                    <span className="w-5 h-5">{"<<"}</span>
                  </button>
                  <button>
                    <span className="w-5 h-5">{"<"}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <input className="border p-1 rounded w-10" />
                    of 1
                  </span>
                  <button>
                    <span className="w-5 h-5">{">"}</span>
                  </button>
                  <button>
                    <span className="w-5 h-5">{">>"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Worksheet;
