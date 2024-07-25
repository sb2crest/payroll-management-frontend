import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "../context/theme-context";

const fetchTimeSheetData = async () => {
  try {
    const res = await axios.get(
      "/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=MG6D64C47B45"
    );
    console.log("Fetched Data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch data", error);
    throw new Error("Failed to fetch data");
  }
};

const Timesheet = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["timeSheetData"],
    queryFn: fetchTimeSheetData,
  });

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  const { theme } = useTheme();

  const handleApprove = (employeeUniqueId) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.employeeUniqueId === employeeUniqueId
          ? { ...item, approval: "approved" }
          : item
      )
    );
  };

  const handleReject = (employeeUniqueId) => {
    setFilteredData((prevData) =>
      prevData.map((item) =>
        item.employeeUniqueId === employeeUniqueId
          ? { ...item, approval: "rejected" }
          : item
      )
    );
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Data in useEffect:", data); // Debugging statement
      setFilteredData(
        data.filter((item) => {
          const employeeId = item.employeeUniqueId?.toLowerCase() || "";
          const firstName = item.firstName?.toLowerCase() || "";
          const lastName = item.lastName?.toLowerCase() || "";
          return (
            employeeId.includes(searchTerm.toLowerCase()) ||
            firstName.includes(searchTerm.toLowerCase()) ||
            lastName.includes(searchTerm.toLowerCase())
          );
        })
      );
    } else {
      console.error("Unexpected data format:", data);
      setFilteredData([]);
    }
  }, [searchTerm, data]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < Math.ceil(filteredData.length / pageSize)) {
      setCurrentPage(page);
    }
  };

  const pages = Math.ceil(filteredData.length / pageSize);
  const currentPageData = filteredData.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  return (
    <div className="m-6">
      <div className="bg-white p-10 mt-6 rounded-lg shadow-md relative">
        {isLoading ? (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            Loading...
          </div>
        ) : error ? (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            Error loading data
          </div>
        ) : (
          <>
            <div
              className="relative max-w-[400px] border-[1px] rounded-lg overflow-hidden"
              style={{ borderColor: theme.colors.accent }}
            >
              <button className="absolute top-1/2 left-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg">
                <CiSearch />
              </button>
              <input
                type="text"
                className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                placeholder="Search by name or id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <table
              className="my-auto border-2 border-white w-full rounded-lg mt-5 overflow-hidden"
              style={{ background: theme.colors.globalBackgroundColor }}
            >
              <thead className="border-b-2 border-b-white">
                <tr>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Employee Id
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    First Name
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Last Name
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Working Days
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Payment Mode
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Default Hours
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Overtime Hours
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Total Hours
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: theme.colors.secondary }}
                  >
                    Approval
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr
                    key={item.employeeUniqueId}
                    className="border-2 border-white"
                  >
                    <td className="border-2 border-white p-2 text-sm">
                      {item.employeeUniqueId}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.firstName}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.lastName}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.workingDays}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.paymentMode}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.assignedHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.overTimeWorkingHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.totalWorkingHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.approval === "approved" ? (
                        <span className="text-green-400">Approved</span>
                      ) : item.approval === "rejected" ? (
                        <span className="text-red-400">Rejected</span>
                      ) : (
                        <div className="flex">
                          <button
                            className="mr-2 p-1 bg-green-500 text-white text-sm rounded-md"
                            onClick={() => handleApprove(item.employeeUniqueId)}
                          >
                            Approve
                          </button>
                          <button
                            className="p-1 bg-red-500 text-white text-sm rounded-md"
                            onClick={() => handleReject(item.employeeUniqueId)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex sm:flex-row flex-col w-full mt-8 items-center gap-2 text-xs">
              <div className="sm:mr-auto sm:mb-0 mb-2">
                <span className="mr-2">Items per page</span>
                <select
                  className="border p-1 rounded w-16 border-gray-200"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {[2, 4, 6, 8].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  className={`${
                    currentPage === 0
                      ? "bg-gray-100"
                      : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
                  } rounded p-1`}
                  onClick={() => handlePageChange(0)}
                  disabled={currentPage === 0}
                >
                  <span className="w-5 h-5">{"<<"}</span>
                </button>
                <button
                  className={`${
                    currentPage === 0
                      ? "bg-gray-100"
                      : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
                  } rounded p-1`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <span className="w-5 h-5">{"<"}</span>
                </button>
                <span className="flex items-center gap-1">
                  <input
                    min={1}
                    max={pages}
                    type="number"
                    value={currentPage + 1}
                    onChange={(e) => {
                      const page = e.target.value
                        ? Number(e.target.value) - 1
                        : 0;
                      handlePageChange(page);
                    }}
                    className="border p-1 rounded w-10"
                  />
                  of {pages}
                </span>
                <button
                  className={`${
                    currentPage >= pages - 1
                      ? "bg-gray-100"
                      : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
                  } rounded p-1`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pages - 1}
                >
                  <span className="w-5 h-5">{">"}</span>
                </button>
                <button
                  className={`${
                    currentPage >= pages - 1
                      ? "bg-gray-100"
                      : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
                  } rounded p-1`}
                  onClick={() => handlePageChange(pages - 1)}
                  disabled={currentPage >= pages - 1}
                >
                  <span className="w-5 h-5">{">>"}</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Timesheet;
