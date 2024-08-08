/* eslint-disable no-unused-vars */
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
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import "./custom.css";

const Timesheet = () => {
  /* destructuring for ID and theme */
  const { ID } = useAuth();
  const { colors } = useTheme();

  /* time sheet data */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getDateData = async () => {
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
  };

  useEffect(() => {
    getDateData();
  }, []);

  const fetchTimeSheetData = async (date1, date2) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterData?startDate=${date1}&endDate=${date2}&managerUniqueId=${ID}`
      );
      const data = res.data;
      console.log("Data:", data);
      return data;
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw new Error("Failed to fetch data");
    }
  };

  // eslint-disable-next-line no-unused-vars
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["timeSheetData", ID],
    queryFn: () => fetchTimeSheetData(startDate, endDate),
  });

  /* sort timesheet */
  const sortTimeSheets = (response) => {
    if (!response || response.length === 0) {
      return response;
    }

    return response.map((record) => {
      if (record.timeSheetList) {
        return {
          ...record,
          timeSheetList: record.timeSheetList.sort((a, b) => {
            if (a.submittedTimestamp === null && b.submittedTimestamp !== null)
              return 1;
            if (a.submittedTimestamp !== null && b.submittedTimestamp === null)
              return -1;
            if (a.submittedTimestamp === null && b.submittedTimestamp === null)
              return 0;
            return (
              new Date(b.submittedTimestamp) - new Date(a.submittedTimestamp)
            );
          }),
        };
      }
      return record;
    });
  };

  const sortedRecords = sortTimeSheets(data);

  /* selecting multiple records */
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (timeSheet) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.some(
        (row) => row.timeSheetId === timeSheet.timeSheetId
      );
      const newSelectedRows = isSelected
        ? prevSelected.filter(
            (row) => row.timeSheetId !== timeSheet.timeSheetId
          )
        : [...prevSelected, timeSheet];
      return newSelectedRows;
    });
  };

  const isChecked = (timeSheetId) =>
    selectedRows.some((row) => row.timeSheetId === timeSheetId);

  /* rejection form */
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleRejectionButtonClick = () => {
    setOpen(true); // Open the form
  };

  /* approval */
  const handleApprove = async () => {
    if (!selectedRows.length) {
      console.warn("No rows selected to approve.");
      return;
    }

    const submissions = selectedRows.map((row) => ({
      weeklySubmissionId: row.timeSheetId,
      message: "Report Approvedddd",
      reportStatus: "APPROVED",
    }));

    try {
      const res = await handleApproved(submissions);
      if (isFilterActive) {
        filterDataBasedOnCriteria();
      }
      await refetch();
    } catch (error) {
      console.error("Error approving timesheets:", error);
    } finally {
      setSelectedRows([]);
    }
  };

  /* rejection */
  const handleRejectionFormSubmit = async () => {
    if (!selectedRows.length) {
      console.warn("No rows selected to reject.");
      return;
    }

    const submissions = selectedRows.map((row) => ({
      weeklySubmissionId: row.timeSheetId,
      message: reason,
      reportStatus: "REJECTED",
    }));

    try {
      const res = await rejectTimesheet(submissions);
      await refetch();
      if (isFilterActive) {
        filterDataBasedOnCriteria();
      }
    } catch (error) {
      console.error("Error rejecting timesheets:", error);
    } finally {
      setSelectedRows([]);
      setOpen(false);
      setReason("");
    }
  };

  /* form submission */
  const submitDefault = async (e) => {
    e.preventDefault();
    await handleRejectionFormSubmit();
  };

  /* style and functionality for buttons before and after selecting rows */
  const areButtonsDisabled = selectedRows.length === 0;

  /* style for table */
  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  /* filters */
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const listAllEmployees = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=${ID}`
      );
      const data = res.data;
      const employeeOptions = data.map((employee) => ({
        value: employee.employeeUniqueId,
        label: `${employee.firstName} ${employee.lastName}`,
      }));
      setEmployees(employeeOptions);
    } catch (e) {
      console.error("Error fetching employees:", e);
    }
  };

  useEffect(() => {
    listAllEmployees();
  }, []);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchWithID, setSearchWithID] = useState("");
  const [searchWithName, setSearchWithName] = useState("");
  const [reportStatus, setReportStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const filterDataBasedOnCriteria = async () => {
    try {
      const formattedReportStatus = Array.isArray(reportStatus)
        ? reportStatus.map((status) => status.toUpperCase())
        : typeof reportStatus === "string"
        ? [reportStatus.toUpperCase()]
        : [];

      console.log("Formatted Report Status:", formattedReportStatus);

      const payload = {
        managerUniqueId: ID || null,
        employeeUniqueId: searchWithID || null,
        employeeName: searchWithName || null,
        startDate: fromDate || null,
        endDate: toDate || null,
        reportStatus:
          formattedReportStatus.length > 0 ? formattedReportStatus : null,
      };
      console.log("payload:", payload);
      const res = await axios.post(
        `http://localhost:8080/api/payrollEmployee/filterDataBasedOnCriteria`,
        payload
      );
      const data = res.data;
      setFilteredData(data);
      console.log(data);
      setIsFilterActive(true);
    } catch (e) {
      toast.error("No match found");
      console.error("Error filtering data:", e);
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchWithID("");
    setSearchWithName("");
    setReportStatus("");
    setFilteredData([]);
    setSelectedEmployee("");
    setIsFilterActive(false);
  };

  const dataToRender = isFilterActive ? filteredData : sortedRecords;

  return (
    <>
      {" "}
      {open && (
        <motion.div
          initial={{ display: "none" }}
          animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="border-[1px] w-[500px] p-4 z-[999999] h-[300px] flex items-center flex-col gap-6 justify-center absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] bg-gray-100 rounded-lg shadow-md"
        >
          <form className="w-full" onSubmit={submitDefault}>
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
      <div className="m-3 p-4">
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
            <div className="flex items-center gap-5">
              <div className="flex gap-4">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 outline-none text-[12px] rounded p-1 cursor-pointer date-input"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 outline-none text-[12px] rounded p-1 cursor-pointer date-input"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search by employee ID"
                  value={searchWithID}
                  onChange={(e) => setSearchWithID(e.target.value)}
                  className="outline-none border border-gray-300 text-[12px] rounded p-1 "
                />
              </div>
              <div>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="outline-none border border-gray-300 text-[12px] rounded p-1 cursor-pointer"
                >
                  <option value="" disabled>
                    Select an employee
                  </option>
                  {employees.map((employee) => (
                    <option key={employee.value} value={employee.value}>
                      {employee.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search by report status"
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                  className="outline-none border border-gray-300 text-[12px] rounded p-1 "
                />
              </div>
              <div className="flex gap-5">
                <button
                  style={{ color: colors.primary }}
                  className="bg-white font-normal py-1 px-8 rounded shadow focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    filterDataBasedOnCriteria();
                  }}
                >
                  Filter
                </button>
                <button
                  style={{ color: colors.primary }}
                  className="bg-white font-normal py-1 px-8 rounded shadow focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault();
                    resetFilters();
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
            <div style={{ maxHeight: "280px", overflowY: "auto" }}>
              <table className="my-auto w-full rounded mt-5  ">
                <thead
                  className="text-white"
                  style={{ background: colors.primary }}
                >
                  <tr>
                    <th className="border-none p-2 text-sm font-bold">
                      <input type="checkbox" />
                    </th>
                    <th className="p-2 text-[12px] uppercase  whitespace-nowrap">
                      Employee ID
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Employee Name
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      TimeSheet ID
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Week Begin
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Week Close
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Default Hours
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Total Hours
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Overtime
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Approval
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataToRender.length > 0 ? (
                    dataToRender.flatMap((item) =>
                      item.timeSheetList && item.timeSheetList.length > 0
                        ? item.timeSheetList.map((timeSheet) => (
                            <tr
                              key={`${item.employeeUniqueId}-${timeSheet.timeSheetId}`}
                              style={{
                                background:
                                  item.timeSheetList.indexOf(timeSheet) % 2 ===
                                  0
                                    ? ""
                                    : `rgba(${hexToRgb(colors.primary)}, 0.1)`,
                              }}
                            >
                              <td className="text-sm">
                                <input
                                  type="checkbox"
                                  checked={isChecked(timeSheet.timeSheetId)}
                                  onChange={() => {
                                    if (timeSheet.status === "PENDING") {
                                      handleCheckboxChange(timeSheet);
                                    }
                                  }}
                                  className="ml-1"
                                  style={{
                                    height: "17px",
                                    width: "17px",
                                    backgroundColor:
                                      timeSheet.status === "PENDING"
                                        ? "initial"
                                        : "#d3d3d3",
                                    cursor:
                                      timeSheet.status === "PENDING"
                                        ? "pointer"
                                        : "not-allowed",
                                  }}
                                  disabled={timeSheet.status !== "PENDING"}
                                />
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {item.employeeUniqueId}
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {item.lastName} {item.firstName}
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.timeSheetId}
                              </td>
                              <td
                                className="p-2 text-[12px]"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.fromDate}
                              </td>
                              <td
                                className="p-2 text-[12px]"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.toDate}
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.assignedDefaultHours}
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.totalWorkedHours}
                              </td>
                              <td
                                className="p-2 text-sm"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.overTimeWorkedHours}
                              </td>
                              <td
                                className="p-4 text-sm flex justify-center items-center"
                                style={{ textAlign: "center" }}
                              >
                                {timeSheet.status === "APPROVED" && (
                                  <span className="font-medium text-green-600">
                                    APPROVED
                                  </span>
                                )}
                                {timeSheet.status === "REJECTED" && (
                                  <span className="font-medium text-red-500">
                                    REJECTED
                                  </span>
                                )}
                                {timeSheet.status === "PENDING" && (
                                  <span className="font-medium text-orange-400">
                                    PENDING
                                  </span>
                                )}
                                {timeSheet.status === "DRAFT" && (
                                  <span className="font-medium text-blue-700">
                                    DRAFT
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        : null
                    )
                  ) : (
                    <tr>
                      <td colSpan="11" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-white flex justify-end items-center">
              <button
                onClick={handleApprove}
                className={`px-4 py-2  mr-4 ${
                  areButtonsDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white"
                }`}
                disabled={areButtonsDisabled}
              >
                Approve
              </button>
              <button
                onClick={handleRejectionButtonClick}
                className={`px-4 py-2  ${
                  areButtonsDisabled
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
                disabled={areButtonsDisabled}
              >
                Reject
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Timesheet;
