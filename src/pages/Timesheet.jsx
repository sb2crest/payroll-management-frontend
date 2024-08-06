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
import { CiSearch } from "react-icons/ci";
import { BsCalendar2Date } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa6";
import { GrStatusInfo } from "react-icons/gr";
import { SiNamecheap } from "react-icons/si";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

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

  /* search with date */
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filtered, setFiltered] = useState(false);
  const [filteredDataWithDate, setFilteredDataWithDate] = useState([]);

  const searchWithDate = async () => {
    console.log("From: " + fromDate);
    console.log("To: " + toDate);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterData?startDate=${fromDate}&endDate=${toDate}&managerUniqueId=${ID}`
      );
      const data = res.data;
      setFilteredDataWithDate(data);
      setFiltered(true);
      console.log("Filtered Data:", data);
      return data;
    } catch (error) {
      toast.error("No Match Found", { id: "filter" });
      console.error("Failed to search with date", error);
    }
  };

  const handleSearchButtonClick = (e) => {
    e.preventDefault();
    searchWithDate();
  };

  /* search with id */
  const [searchWithID, setSearchWithID] = useState("");
  const [dataFilteredWithID, setDataFilteredWithID] = useState([]);
  const [filteredDataWithID, setFilteredDataWithID] = useState(false);

  const filterWithId = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterEmployeesByUniqueId?managerUniqueId=${ID}&employeeUniqueId=${searchWithID}`
      );
      const data = res.data;
      setDataFilteredWithID(data);
      setFilteredDataWithID(true);
      setFiltered(false);
    } catch (error) {
      toast.error("No Match Found", { id: "filter" });
      console.error("Failed to filter with id", error);
    }
  };

  /* search with name */
  const [searchWithName, setSearchWithName] = useState("");
  const [dataFilteredWithName, setDataFilteredWithName] = useState([]);
  const [filteredDataWithName, setFilteredDataWithName] = useState(false);

  const filterWithName = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterEmployeesByFullName?managerUniqueId=${ID}&employeeName=${searchWithName}`
      );
      const data = res.data;
      setResponse(data);
      console.log("Filtered data with name:", data);
      setDataFilteredWithName(data);
      setFilteredDataWithName(true);
    } catch (error) {
      toast.error("No Match Found", { id: "filter" });
      console.error("Failed to filter with name", error);
    }
  };

  /* search with report status */
  const [reportStatus, setReportStatus] = useState("");
  const [dataFilteredByReportStatus, setDataFilteredByReportStatus] = useState(
    []
  );
  const [filteredDataByReportStatus, setFilteredDataByReportStatus] =
    useState(false);

  const filterByReportStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/payrollEmployee/filterEmployeeByReportStatus?managerUniqueId=${ID}&reportStatus=${reportStatus}`
      );
      const data = res.data;
      setDataFilteredByReportStatus(data);
      setFilteredDataByReportStatus(true);
      console.log("Filtered with status:", data);
    } catch (error) {
      toast.error("No Match Found", { id: "filter" });
      console.error("Failed to filter with report status", error);
    }
  };

  /* sort timesheet */
  const [response, setResponse] = useState([]);

  const sortTimeSheets = (response) => {
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

  const dataToRender =
    filteredDataWithDate.length > 0
      ? filteredDataWithDate
      : dataFilteredWithID.length > 0
      ? dataFilteredWithID
      : dataFilteredWithName.length > 0
      ? dataFilteredWithName
      : dataFilteredByReportStatus.length > 0
      ? dataFilteredByReportStatus
      : sortedRecords;

  /* selecting multiple records */
  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (timeSheet) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.some(
        (row) => row.timeSheetId === timeSheet.timeSheetId
      );
      console.log("Before update:", prevSelected); // Debug log
      const newSelectedRows = isSelected
        ? prevSelected.filter(
            (row) => row.timeSheetId !== timeSheet.timeSheetId
          )
        : [...prevSelected, timeSheet];
      console.log("After update:", newSelectedRows); // Debug log
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

      if (filteredDataWithID) {
        filterWithId();
      }
      if (filtered) {
        searchWithDate();
      }
      if (filteredDataWithName) {
        await filterWithName();
      }

      if (filteredDataByReportStatus) {
        await filterByReportStatus();
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
      if (filteredDataWithID) {
        filterWithId();
      }
      if (filtered) {
        searchWithDate();
      }
      if (filteredDataWithName) {
        filteredDataWithName();
      }
      console.log("submittedTimestamp:", res.submittedTimestamp);
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState(null);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  const renderFilterContent = () => {
    switch (selectedFilter) {
      case "date":
        return (
          <div className="flex items-center">
            <div className="border-b border-gray-300">
              <input
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border-none border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
                placeholder="Start Date"
              />
            </div>
            <span className="mx-4 text-gray-500"></span>
            <div className="border-b border-gray-300">
              <input
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border-none border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none"
                placeholder="End Date"
              />
            </div>
            <button className="px-5" onClick={handleSearchButtonClick}>
              <CiSearch className="text-lg" />
            </button>
          </div>
        );
      case "employeeID":
        return (
          <div
            className="relative max-w-[220px] border-[1px] rounded-lg overflow-hidden"
            style={{ borderColor: colors.accent }}
          >
            <input
              type="text"
              className="py-2 text-sm outline-none pl-5 bg-white w-full"
              placeholder="Search by Employee ID"
              value={searchWithID}
              onChange={(e) => setSearchWithID(e.target.value)}
            />
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg"
              onClick={(e) => {
                e.preventDefault();
                filterWithId();
              }}
            >
              <CiSearch />
            </button>
          </div>
        );
      case "employeeName":
        return (
          <div
            className="relative max-w-[220px] border-[1px] rounded-lg overflow-hidden"
            style={{ borderColor: colors.accent }}
          >
            <input
              type="text"
              className="py-2 text-sm outline-none pl-5 bg-white w-full"
              placeholder="Search by Employee Name"
              value={searchWithName}
              onChange={(e) => setSearchWithName(e.target.value)}
            />
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg"
              onClick={(e) => {
                e.preventDefault();
                filterWithName();
              }}
            >
              <CiSearch />
            </button>
          </div>
        );
      case "reportStatus":
        return (
          <div
            className="relative max-w-[220px] border-[1px] rounded-lg overflow-hidden"
            style={{ borderColor: colors.accent }}
          >
            <input
              type="text"
              className="py-2 text-sm outline-none pl-5 bg-white w-full"
              placeholder="Search by Report Status"
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
            />
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg"
              onClick={(e) => {
                e.preventDefault();
                filterByReportStatus();
              }}
            >
              <CiSearch />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

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
            {/* <div className="flex">
              <div>
                <p className="pt-0 pb-2 px-5 text-gray-400 text-[14px]">
                  Search by start and end date
                </p>
                <div className="flex">
                  <div className="relative max-w-[180px] border-[1px] rounded overflow-hidden ml-5 mr-5">
                    <input
                      type="text"
                      className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                      placeholder="YYYY-MM-DD"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="relative max-w-[180px] border-[1px] rounded overflow-hidden">
                    <input
                      type="text"
                      className="py-2 text-sm outline-none pl-10 pr-4 bg-white w-full"
                      placeholder="YYYY-MM-DD"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                  <button
                    className="cursor-pointer ml-6  px-6 text-white"
                    onClick={handleSearchButtonClick}
                    style={{ backgroundColor: colors.primary }}
                  >
                    Search
                  </button>
                </div>
              </div>
              <div className="border-[1px] rounded overflow-hidden mt-8 ml-5 flex">
                <input
                  type="text"
                  className="text-sm outline-none bg-white px-2 py-2"
                  placeholder="Search by employee ID"
                  style={{ fontSize: "13px" }}
                  value={searchWithID}
                  onChange={(e) => setSearchWithID(e.target.value)}
                />
                <button
                  className="relative right-2"
                  onClick={(e) => {
                    e.preventDefault();
                    filterWithId();
                  }}
                >
                  <CiSearch />
                </button>
              </div>
              <div className="border-[1px] rounded overflow-hidden mt-8 ml-5 flex">
                <input
                  type="text"
                  className="text-sm outline-none bg-white py-2 pl-3"
                  placeholder="Search by name"
                  style={{ fontSize: "13px" }}
                  value={searchWithName}
                  onChange={(e) => setSearchWithName(e.target.value)}
                />
                <button
                  className="relative right-1"
                  onClick={(e) => {
                    e.preventDefault();
                    filterWithName();
                  }}
                >
                  <CiSearch />
                </button>
              </div>
            </div> */}
            <div>
              {selectedFilter === null ? (
                <>
                  <button
                    style={{ color: colors.primary }}
                    className="bg-white font-normal py-2 px-10 rounded-2xl shadow focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    Add Filter +
                  </button>
                  {isDropdownOpen && (
                    <div
                      className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p
                        className="px-4 py-2 hover:bg-gray-100 text-gray-400 hover:text-black text-sm hover:font-medium flex items-center cursor-pointer"
                        onClick={() => handleFilterClick("date")}
                      >
                        <span>
                          <BsCalendar2Date className="text-gray-400" />
                        </span>
                        <span className="px-3">Date</span>
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-400 hover:text-black hover:font-medium flex items-center cursor-pointer"
                        onClick={() => handleFilterClick("employeeID")}
                      >
                        <span>
                          <FaRegAddressCard className="text-gray-400" />
                        </span>
                        <span className="px-3">Employee ID</span>
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-400 hover:text-black hover:font-medium flex items-center cursor-pointer"
                        onClick={() => handleFilterClick("employeeName")}
                      >
                        <span>
                          <SiNamecheap className="text-gray-400" />
                        </span>
                        <span className="px-3">Employee Name</span>
                      </p>
                      <p
                        className="px-4 py-2 hover:bg-gray-100 text-sm text-gray-400 hover:text-black hover:font-medium flex items-center cursor-pointer"
                        onClick={() => handleFilterClick("reportStatus")}
                      >
                        <span>
                          <GrStatusInfo className="text-gray-400" />
                        </span>
                        <span className="px-3">Report Status</span>
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {renderFilterContent()}
                  <p
                    className="text-sm font-thin underline cursor-pointer pt-2"
                    style={{ color: colors.primary }}
                    onClick={() => {
                      setSelectedFilter(null);
                      setFromDate("");
                      setToDate("");
                      setSearchWithID("");
                      setSearchWithName("");
                    }}
                  >
                    Close above filter
                  </p>
                </>
              )}
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
