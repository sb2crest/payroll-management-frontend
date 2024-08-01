import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "../context/theme-context";
import { motion } from "framer-motion";
import {
  handleApproved,
  handleReject as rejectTimesheet,
} from "../helpers/theme-api";
import { useAuth } from "../context/auth-context";

const Timesheet = () => {
  const { ID } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const today = new Date();

    const start = new Date();

    start.setDate(today.getDate() - 30);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(start));
    setEndDate(formatDate(today));

    console.log("Date:", startDate + " to " + endDate);
  }, [startDate, endDate]);

  const fetchTimeSheetData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterData?startDate=${startDate}&endDate=${endDate}&managerUniqueId=MG7745484B8E`
      );
      console.log("Fetched Data:", res.data);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw new Error("Failed to fetch data");
    }
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [filteredDataWithDate, setFilteredDataWithDate] = useState([]);

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    searchWithDate();
  };

  const searchWithDate = async () => {
    console.log("From: " + fromDate);
    console.log("To: " + toDate);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterData?startDate=2024-06-01&endDate=2024-06-15&managerUniqueId=MG7745484B8E`
      );
      const data = res.data;
      setFilteredDataWithDate(data);
      setFiltered(true);
      console.log("Filtered Data:", data);
      return data;
    } catch (error) {
      console.error("Failed to search with date", error);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["timeSheetData", ID],
    queryFn: () => fetchTimeSheetData(ID),
  });

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  const { colors } = useTheme();

  const handleApprove = async (weeklySubmissionId) => {
    console.log(weeklySubmissionId);
    await handleApproved(weeklySubmissionId);
    refetch();
  };

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [weeklySubmissionId, setWeeklySubmissionId] = useState(null);

  const handleReject = async () => {
    if (weeklySubmissionId === null) {
      console.error("No submission ID available");
      return;
    }
    console.log(`Rejecting submission ID: ${weeklySubmissionId}`);
    console.log(`Reason for rejection: ${reason}`);
    await rejectTimesheet(weeklySubmissionId, reason);
    refetch();
    setOpen(false);
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Data in useEffect:", data);
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

  // eslint-disable-next-line no-unused-vars
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  // eslint-disable-next-line no-unused-vars
  const handlePageChange = (page) => {
    if (page >= 0 && page < Math.ceil(filteredData.length / pageSize)) {
      setCurrentPage(page);
    }
  };

  // eslint-disable-next-line no-unused-vars
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
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleReject();
            }}
          >
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
                Cancel
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
      <div className="bg-white p-5 mt-6 rounded shadow-md relative border-[1px]">
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
            <p className="pt-0 pb-2 px-5 text-gray-400 italic">
              Search by start and end date
            </p>
            <div className="flex">
              <div
                className="relative max-w-[180px] border-[1px] rounded-lg overflow-hidden ml-5 mr-5"
                style={{ borderColor: colors.accent }}
              >
                <input
                  type="text"
                  className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                  placeholder="YYYY-MM-DD"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div
                className="relative max-w-[180px] border-[1px] rounded-lg overflow-hidden"
                style={{ borderColor: colors.accent }}
              >
                <input
                  type="text"
                  className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                  placeholder="YYYY-MM-DD"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <button
                className="cursor-pointer ml-6 bg-slate-500 px-6 text-white"
                onClick={handleSearchButtonClick}
              >
                Search
              </button>
            </div>
            <table
              className="my-auto border-2 border-white bg-[#eee] w-full rounded mt-5 overflow-hidden "
              style={{ background: colors.globalBackgroundColor }}
            >
              <thead className="border-b-2 border-b-white">
                <tr>
                  <th
                    className="border-2 border-white p-2 text-[12px] font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Employee ID
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    First Name
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Last Name
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    TimeSheet ID
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Week Begin
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Week Close
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Default Hours
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] whitespace-nowrap font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Total Hours
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Overtime
                  </th>
                  <th
                    className="border-2 border-white p-2 text-[12px] font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Approval
                  </th>
                </tr>
              </thead>
              {filtered ? (
                <tbody>
                  {filteredDataWithDate.length > 0 ? (
                    filteredDataWithDate.flatMap((item) =>
                      item.timeSheetList && item.timeSheetList.length > 0
                        ? item.timeSheetList.map((timeSheet) => (
                            <tr
                              key={`${item.employeeUniqueId}-${timeSheet.timeSheetId}`}
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
                                {timeSheet.timeSheetId}
                              </td>
                              <td className="border-2 border-white p-2 text-[12px]">
                                {timeSheet.fromDate}
                              </td>
                              <td className="border-2 border-white p-2 text-[12px]">
                                {timeSheet.toDate}
                              </td>
                              <td className="border-2 border-white p-2 text-sm">
                                {timeSheet.assignedDefaultHours}
                              </td>
                              <td className="border-2 border-white p-2 text-sm">
                                {timeSheet.totalWorkedHours}
                              </td>
                              <td className="border-2 border-white p-2 text-sm">
                                {timeSheet.overTimeWorkedHours}
                              </td>
                              <td className=" p-4 text-sm flex justify-center items-center">
                                {timeSheet.status === "APPROVED" && (
                                  <span className="font-medium">APPROVED</span>
                                )}
                                {timeSheet.status === "REJECTED" && (
                                  <span className="font-medium">REJECTED</span>
                                )}
                                {timeSheet.status === "PENDING" && (
                                  <>
                                    <button
                                      className=" text-green-500 rounded text-sm underline"
                                      onClick={() =>
                                        handleApprove(timeSheet.timeSheetId)
                                      }
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="text-red-600 ml-2 underline"
                                      onClick={() => {
                                        setWeeklySubmissionId(
                                          timeSheet.timeSheetId
                                        );
                                        setOpen(true);
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))
                        : null
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="11"
                        className="border-2 border-white p-2 text-sm text-center"
                      >
                        No timesheet data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              ) : (
                <>
                  <tbody>
                    {currentPageData.length > 0 ? (
                      currentPageData.flatMap((item) =>
                        item.timeSheetList && item.timeSheetList.length > 0
                          ? item.timeSheetList.map((timeSheet) => (
                              <tr
                                key={`${item.employeeUniqueId}-${timeSheet.timeSheetId}`}
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
                                  {timeSheet.timeSheetId}
                                </td>
                                <td className="border-2 border-white p-2 text-[12px]">
                                  {timeSheet.fromDate}
                                </td>
                                <td className="border-2 border-white p-2 text-[12px]">
                                  {timeSheet.toDate}
                                </td>
                                <td className="border-2 border-white p-2 text-sm">
                                  {timeSheet.assignedDefaultHours}
                                </td>
                                <td className="border-2 border-white p-2 text-sm">
                                  {timeSheet.totalWorkedHours}
                                </td>
                                <td className="border-2 border-white p-2 text-sm">
                                  {timeSheet.overTimeWorkedHours}
                                </td>
                                <td className=" p-4 text-sm flex justify-center items-center">
                                  {timeSheet.status === "APPROVED" && (
                                    <span className="font-medium">
                                      APPROVED
                                    </span>
                                  )}
                                  {timeSheet.status === "REJECTED" && (
                                    <span className="font-medium">
                                      REJECTED
                                    </span>
                                  )}
                                  {timeSheet.status === "PENDING" && (
                                    <>
                                      <button
                                        className=" text-green-500 rounded text-sm underline"
                                        onClick={() =>
                                          handleApprove(timeSheet.timeSheetId)
                                        }
                                      >
                                        Approve
                                      </button>
                                      <button
                                        className="text-red-600 ml-2 underline"
                                        onClick={() => {
                                          setWeeklySubmissionId(
                                            timeSheet.timeSheetId
                                          );
                                          setOpen(true);
                                        }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))
                          : null
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="11"
                          className="border-2 border-white p-2 text-sm text-center"
                        >
                          No timesheet data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </>
              )}
            </table>
            {/* <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Previous
              </button>
              <span className="mx-4">
                Page {currentPage + 1} of {pages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pages - 1}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                Next
              </button>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="ml-4 p-2 rounded-lg"
              >
                {[2, 5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Timesheet;
