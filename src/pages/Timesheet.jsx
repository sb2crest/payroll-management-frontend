/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
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
import { GrPrevious } from "react-icons/gr";
import { GrNext } from "react-icons/gr";

const Timesheet = () => {
  /* destructuring for ID and theme */
  const { ID } = useAuth();
  const { colors } = useTheme();

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
      console.log("isfilteractivated:", isFilterActive);
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
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchWithID, setSearchWithID] = useState("");
  const [searchWithName, setSearchWithName] = useState("");
  const [reportStatus, setReportStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const listAllEmployees = async () => {
    if (
      searchWithName.trim().length < 3 ||
      /[^a-zA-Z0-9\s]/.test(searchWithName)
    ) {
      setFilteredEmployees([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://payroll.seabed2crest.com/api/payrollEmployee/filterEmployeesByName?managerUniqueId=${ID}&employeeName=${searchWithName}`
      );
      const data = res.data;
      setFilteredEmployees(data);
      console.log("feching employee list:", data);
    } catch (e) {
      console.error("Error fetching employees:", e);
    }
  };

  useEffect(() => {
    listAllEmployees();
  }, [searchWithName]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchTermLongEnough, setIsSearchTermLongEnough] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleFocus = () => {
    if (searchWithName.length < 3) {
      setIsTooltipVisible(true);
    }
  };

  const handleBlur = () => {
    setIsTooltipVisible(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchWithName(value);
    if (value.trim().length >= 3) {
      setIsSearchTermLongEnough(true);
      setShowDropdown(true);
    } else {
      setIsSearchTermLongEnough(false);
      setShowDropdown(false);
    }
  };

  const handleSelect = (name) => {
    setSearchWithName(name);
    setShowDropdown(false);
  };

  const handleChangeWithTooltip = (event) => {
    handleChange(event);
    if (event.target.value.length >= 3) {
      setIsTooltipVisible(false);
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(
      regex,
      (match) => `<span class="bg-yellow-200">${match}</span>`
    );
  };

  const handleReportStatusChange = (status) => {
    if (reportStatus.includes(status)) {
      setReportStatus((prevStatus) => prevStatus.filter((s) => s !== status));
      if (selectedStatus === status) {
        setSelectedStatus(null);
      }
    } else {
      setReportStatus((prevStatus) => [...prevStatus, status]);
      setSelectedStatus(status);
    }
  };

  const getButtonStyle = (status) => {
    const defaultStyle = {
      backgroundColor: "#eeeeee",
      color: "gray",
    };

    // Define the styles for each status
    const statusStyles = {
      APPROVED: {
        backgroundColor: "#90EE90",
        color: "#008000",
      },
      REJECTED: {
        backgroundColor: "#FAA0A0",
        color: "#FF0000",
      },
      PENDING: {
        backgroundColor: "#FAD5A5",
        color: "#FFA500",
      },
    };

    const isSelected = reportStatus.includes(status);

    return isSelected ? statusStyles[status] : defaultStyle;
  };

  const [hasNextPage, setHasNextPage] = useState(true);

  const filterDataBasedOnCriteria = async (currentPage, rowsPerPage) => {
    try {
      console.log("calling filterDataBasedOnCriteria");
      const payload = {
        managerUniqueId: ID || null,
        employeeUniqueId: searchWithID || null,
        employeeName: searchWithName || null,
        reportStatus: reportStatus,
        startDate: fromDate || null,
        endDate: toDate || null,
        pageNumber: currentPage,
        pageSize: rowsPerPage,
      };
      const res = await axios.post(
        `https://payroll.seabed2crest.com/api/payrollEmployee/filterDataBasedOnCriteria`,
        payload
      );
      const data = res.data;
      setFilteredData(data.content);
      setTotalPages(data.totalPages);
      setHasNextPage(data.content.length === rowsPerPage);
      setIsFilterActive(true);
    } catch (e) {
      if (isFilterActive) {
        toast.error("No match found");
      }
      console.error("Error filtering data:", e);
      setHasNextPage(false);
    }
  };

  const handleFilter = async () => {
    if (
      fromDate ||
      toDate ||
      searchWithID ||
      searchWithName ||
      reportStatus.length > 0
    ) {
      await filterDataBasedOnCriteria(currentPage, rowsPerPage);
      setIsFilterActive(true);
    } else {
      resetFilters();
      setIsFilterActive(false);
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setSearchWithID("");
    setSearchWithName("");
    setReportStatus([]);
    setIsFilterActive(false);
    setFilteredData([]);
  };

  /* pagination */
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(0);
  };

  const handleCurrentPageChange = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : prevPage - 1
    );
  };

  /* time sheet data */
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchTimeSheetData = async (
    startDate,
    endDate,
    currentPage,
    rowsPerPage
  ) => {
    const request = {
      managerUniqueId: ID,
      startDate: "2024-06-01",
      endDate: "2024-09-30",
      pageNumber: currentPage,
      size: rowsPerPage,
    };
    try {
      console.log("calling ");
      const res = await axios.post(
        "https://payroll.seabed2crest.com/api/payrollEmployee/filterData",
        request
      );
      const data = res.data.content;
      setTotalPages(res.data.totalPages);
      return {
        data,
        hasNextPage: res.data.content.length === rowsPerPage,
      };
    } catch (error) {
      console.error("Failed to fetch data", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "timeSheetData",
      ID,
      startDate,
      endDate,
      currentPage,
      rowsPerPage,
      isFilterActive,
      ...reportStatus,
    ],
    queryFn: async () => {
      if (isFilterActive) {
        return filteredData;
      } else {
        const { data, hasNextPage } = await fetchTimeSheetData(
          startDate,
          endDate,
          currentPage,
          rowsPerPage
        );
        setHasNextPage(hasNextPage);
        return data;
      }
    },
    keepPreviousData: true,
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

  const sortBySubmittedTimestamp = (data) => {
    return data.sort(
      (a, b) => new Date(b.submittedTimestamp) - new Date(a.submittedTimestamp)
    );
  };

  const dataToRender = isFilterActive
    ? sortBySubmittedTimestamp(filteredData)
    : sortedRecords;

  useEffect(() => {
    if (isFilterActive) {
      filterDataBasedOnCriteria(currentPage, rowsPerPage);
    }
  }, [currentPage, rowsPerPage, isFilterActive]);

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
      <div className="p-6">
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
            <div className="flex items-center gap-10">
              <div className="flex gap-4">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border border-gray-300 outline-none text-[14px] rounded p-1 cursor-pointer date-input"
                />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border border-gray-300 outline-none text-[14px] rounded p-1 cursor-pointer date-input"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search by employee ID"
                  value={searchWithID}
                  onChange={(e) => setSearchWithID(e.target.value)}
                  className="outline-none border border-gray-300 text-[14px] rounded p-1 "
                />
              </div>
              <div>
                <input
                  type="text"
                  value={searchWithName}
                  onChange={handleChangeWithTooltip}
                  className="border border-gray-300 outline-none text-[14px] rounded p-1"
                  placeholder="Search by employee name"
                  onFocus={handleFocus} // Show tooltip when input is focused
                  onBlur={handleBlur}
                />
                {isTooltipVisible && searchWithName.length < 3 && (
                  <div className="absolute text-gray-500 italic text-xs p-1">
                    Please enter three characters
                  </div>
                )}
                {showDropdown && (
                  <div className="absolute border border-gray-300 bg-white shadow-lg mt-1 w-[170px] max-h-60 overflow-auto">
                    {isSearchTermLongEnough && filteredEmployees.length > 0 ? (
                      filteredEmployees.map((name, index) => (
                        <div
                          key={index}
                          className="p-2 cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSelect(name)}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(name, searchWithName),
                          }}
                        />
                      ))
                    ) : isSearchTermLongEnough ? (
                      <div className="p-2">No results found</div>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="flex gap-5">
                <button
                  style={{ color: colors.primary }}
                  className="bg-white font-normal py-1 px-8 rounded shadow focus:outline-none"
                  onClick={handleFilter}
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
            <div className="flex flex-col gap-2">
              <span className="text-[12px] pt-2 italic">Report status</span>
              <div className="flex gap-5">
                <button
                  style={getButtonStyle("APPROVED")}
                  className="text-sm py-1 px-5 rounded-2xl shadow focus:outline-none"
                  onClick={() => handleReportStatusChange("APPROVED")}
                >
                  APPROVED
                </button>
                <button
                  style={getButtonStyle("REJECTED")}
                  className="text-sm py-1 px-5 rounded-2xl shadow focus:outline-none"
                  onClick={() => handleReportStatusChange("REJECTED")}
                >
                  REJECTED
                </button>
                <button
                  style={getButtonStyle("PENDING")}
                  className="text-sm py-1 px-5 rounded-2xl shadow focus:outline-none"
                  onClick={() => handleReportStatusChange("PENDING")}
                >
                  PENDING
                </button>
              </div>
            </div>
            <div>
              <table className="my-auto w-full rounded mt-5   ">
                <thead
                  className="text-white"
                  style={{ background: colors.primary }}
                >
                  <tr>
                    <th className="border-none p-2 text-sm font-bold"></th>
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
                    dataToRender.map((timeSheet) => (
                      <tr
                        key={timeSheet.timeSheetId}
                        style={{
                          background:
                            dataToRender.indexOf(timeSheet) % 2 === 0
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
                            className="ml-1 p-2"
                            style={{
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
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.employeeUniqueId}
                        </td>
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.firstName} {timeSheet.lastName}
                        </td>
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.timeSheetId}
                        </td>
                        <td
                          className="text-[12px]"
                          style={{ textAlign: "center" }}
                        >
                          {timeSheet.startDate}
                        </td>
                        <td
                          className="text-[12px]"
                          style={{ textAlign: "center" }}
                        >
                          {timeSheet.endDate}
                        </td>
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.assignedDefaultHours}
                        </td>
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.totalWorkedHours}
                        </td>
                        <td className="text-sm" style={{ textAlign: "center" }}>
                          {timeSheet.overTimeWorkedHours}
                        </td>
                        <td
                          className="p-2 text-sm flex justify-center items-center"
                          style={{ textAlign: "center" }}
                        >
                          {timeSheet.status === "APPROVED" && (
                            <span className="font-sm text-sm text-green-600">
                              APPROVED
                            </span>
                          )}
                          {timeSheet.status === "REJECTED" && (
                            <span className="font-sm text-sm text-red-500">
                              REJECTED
                            </span>
                          )}
                          {timeSheet.status === "PENDING" && (
                            <span className="font-sm text-sm text-orange-400">
                              PENDING
                            </span>
                          )}
                          {timeSheet.status === "DRAFT" && (
                            <span className="font-sm text-sm text-blue-700">
                              DRAFT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
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
            <div className="flex justify-between flex-row-reverse">
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
              <div className="flex items-center gap-60">
                <div>
                  <span className="text-sm text-gray-400 p-2">
                    Rows Per Page
                  </span>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="outline-none py-2 px-5"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div className="flex gap-6">
                  <button
                    className="cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurrentPageChange("previous");
                    }}
                    disabled={currentPage === 0}
                  >
                    <GrPrevious className="text-gray-500 text-sm" />
                    <GrPrevious className="text-gray-500 text-sm" />
                  </button>
                  <span>
                    <span className="text-sm">Page</span> {currentPage + 1} of{" "}
                    {totalPages}
                  </span>
                  <button
                    className="cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCurrentPageChange("next");
                    }}
                    disabled={!hasNextPage}
                  >
                    <GrNext className="text-gray-500 text-sm" />{" "}
                    <GrNext className="text-gray-500 text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Timesheet;
