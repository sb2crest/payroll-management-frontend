import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  createHours,
  getAllEmployeeData,
  getAllEmployees,
} from "../helpers/theme-api";
import { useQuery } from "@tanstack/react-query";

const TimesheetID = () => {
  const { uniqueId } = useParams();

  const fetchTimeSheetData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollManager/getNotificationsByUniqueId?uniqueId=${uniqueId}`
      );
      console.log("Fetched Data:", res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["timeSheetData"],
    queryFn: fetchTimeSheetData,
  });

  const [startDate, setStartDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hour, setHour] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalOvertimeWorkedHours, setTotalOvertimeWorkedHours] = useState(0);
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(true);

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
    <div className="m-6 ">
      {open && (
        <motion.div
          initial={{ display: "none" }}
          animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="border-[1px] w-[500px] p-4 z-[999999] h-[300px] flex items-center flex-col gap-6 justify-center absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] bg-gray-100 rounded-lg shadow-md"
        >
          <form onSubmit={handleReject} className="w-full">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              type="text"
              placeholder="Reason for rejection"
              className="outline-none p-2 border-[1px] border-black w-full rounded-lg"
            />
            <div className="flex items-center gap-4 w-full mt-4">
              <button
                onClick={() => setOpen(false)}
                className="p-2 bg-gray-400 rounded-lg w-full"
              >
                cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-red-500 w-full rounded-lg text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      )}
      <div className="bg-white p-10 mt-6 rounded-lg shadow-md relative border-[1px]">
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
              style={{ borderColor: colors.accent }}
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
              className="my-auto border-2 border-white bg-[#eee] w-full rounded-lg mt-5 overflow-hidden"
              style={{ background: colors.globalBackgroundColor }}
            >
              <thead className="border-b-2 border-b-white">
                <tr>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: colors.secondary }}
                  >
                    Employee Id
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: colors.secondary }}
                  >
                    Name
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
                    Payment Mode
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
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: colors.secondary }}
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
                      {` ${item.firstName} ${item.lastName}`}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.startDate}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.endDate}
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
                      {item.status === "APPROVED" ? (
                        <span className="text-green-400">Approved</span>
                      ) : item.status === "REJECTED" ? (
                        <span className="text-red-400">Rejected</span>
                      ) : item.status === "DRAFT" ? (
                        <span className="text-blue-400">Draft</span>
                      ) : item.status === "PENDING" ? (
                        <div className="flex">
                          <button
                            className="mr-2 p-1 bg-green-500 text-white text-sm rounded-md"
                            onClick={() =>
                              handleApprove(item.weeklySubmissionId)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="p-1 bg-red-500 text-white text-sm rounded-md"
                            onClick={() => handleOpen(item.weeklySubmissionId)}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            className="mr-2 p-1 bg-green-500 text-white text-sm rounded-md"
                            onClick={() =>
                              handleApprove(item.weeklySubmissionId)
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="p-1 bg-red-500 text-white text-sm rounded-md"
                            onClick={() =>
                              handleReject(item.weeklySubmissionId)
                            }
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
            {showButton && (
              <button
                className="p-2 px-4 mt-5 rounded-lg text-white"
                onClick={() => setShow(true)}
                style={{ background: colors.primary }}
              >
                Generate
              </button>
            )}
          </div>
          {show && (
            <div className="w-full mt-8 p-4 bg-gray-200 rounded-lg">
              <p className="text-sm font-semibold">UPDATE HOURS</p>
              <form onSubmit={handleUpdate}>
                <div className="flex items-center mt-5 gap-10 w-full">
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">First Name</p>
                    <input
                      value={firstName}
                      type="text"
                      className="p-2 border-[1px] rounded-lg"
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">Last Name</p>
                    <input
                      value={lastName}
                      type="text"
                      className="p-2 border-[1px] rounded-lg"
                      disabled
                    />
                  </div>
                </div>
                <div className="flex items-center mt-5 gap-10 w-full">
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">Start Date</p>
                    <input
                      value={startDate}
                      type="date"
                      className="p-2 border-[1px] rounded-lg"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">End Date</p>
                    <input
                      value={endDate}
                      type="date"
                      className="p-2 border-[1px] rounded-lg"
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">Total Worked Hours</p>
                    <input
                      value={totalHours}
                      type="number"
                      className="p-2 border-[1px] rounded-lg"
                      onChange={(e) => setTotalHours(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="p-2 px-4 mt-5 rounded-lg text-white"
                  style={{ background: colors.primary }}
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

export default TimesheetID;