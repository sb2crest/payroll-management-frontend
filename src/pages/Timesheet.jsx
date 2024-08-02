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
        `http://localhost:8080/api/payrollEmployee/filterData?startDate=${fromDate}&endDate=${toDate}&managerUniqueId=${ID}`
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
    queryFn: () => fetchTimeSheetData(startDate, endDate),
  });

  // eslint-disable-next-line no-unused-vars
  const [filteredData, setFilteredData] = useState([]);

  const { colors } = useTheme();

  const [checkedData, setCheckedData] = useState([]);
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

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  // eslint-disable-next-line no-unused-vars
  const updateStatus = (status) => {
    console.log("Updating status to:", status);
    console.log("Selected rows:", selectedRows);
    console.log("Checked data before update:", checkedData);

    if (!checkedData.length || !selectedRows.length) {
      console.warn("No data or rows selected to update.");
      return;
    }

    const updatedData = checkedData.map((item) => {
      const updatedTimeSheetList = item.timeSheetList.map((timeSheet) =>
        selectedRows.some(
          (selectedRow) => selectedRow.timeSheetId === timeSheet.timeSheetId
        )
          ? { ...timeSheet, status } // Update status for selected rows
          : timeSheet
      );

      return {
        ...item,
        timeSheetList: updatedTimeSheetList,
      };
    });

    console.log("Updated data:", updatedData);

    // Update the state with the new data
    setCheckedData(updatedData);
    setSelectedRows([]); // Clear selected rows after update
  };

  /* API Integration for Approval */
  const handleApprove = async (e) => {
    e.preventDefault();

    if (!selectedRows.length) {
      console.warn("No rows selected to approve.");
      return;
    }

    const submissions = selectedRows.map((row) => ({
      weeklySubmissionId: row.timeSheetId,
      message: "Report Approvedddd",
      reportStatus: "APPROVED",
    }));

    console.log("submissions before", submissions);

    try {
      const res = await handleApproved(submissions);
      await refetch();
      console.log("submissions after", res);
    } catch (error) {
      console.error("Error approving timesheets:", error);
    } finally {
      setSelectedRows([]);
    }
  };

  const handleApproveForFilterData = async (e) => {
    e.preventDefault();

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
      setFilteredDataWithDate((prevData) =>
        prevData.map((item) =>
          item.timeSheetList.map((timeSheet) =>
            selectedRows.some(
              (row) => row.timeSheetId === timeSheet.timeSheetId
            )
              ? { ...timeSheet, status: "APPROVED" }
              : timeSheet
          )
        )
      );
      await refetch();
    } catch (error) {
      console.error("Error approving timesheets:", error);
    } finally {
      setSelectedRows([]);
    }
  };

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
      await rejectTimesheet(submissions);
      await refetch();
    } catch (error) {
      console.error("Error rejecting timesheets:", error);
    } finally {
      setSelectedRows([]);
      setOpen(false);
      setReason("");
    }
  };

  const handleRejectionFormSubmitForData = async () => {
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
      await rejectTimesheet(submissions);

      // Update local state with rejected status
      setFilteredDataWithDate((prevData) =>
        prevData.map((item) => ({
          ...item,
          timeSheetList: item.timeSheetList.map((timeSheet) =>
            selectedRows.some(
              (row) => row.timeSheetId === timeSheet.timeSheetId
            )
              ? { ...timeSheet, status: "REJECTED" }
              : timeSheet
          ),
        }))
      );

      // Refetch data to sync with server
      await refetch();
    } catch (error) {
      console.error("Error rejecting timesheets:", error);
    } finally {
      setSelectedRows([]);
      setOpen(false);
      setReason("");
    }
  };

  const submitDefault = async (e) => {
    e.preventDefault();
    if (filteredData) {
      await handleRejectionFormSubmitForData();
    } else {
      await handleRejectionFormSubmit();
    }
  };

  const handleRejectionButtonClick = () => {
    setOpen(true); // Open the form
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
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
                className="cursor-pointer ml-6 rounded px-6 text-white"
                onClick={handleSearchButtonClick}
                style={{ backgroundColor: colors.primary }}
              >
                Search
              </button>
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
                      First Name
                    </th>
                    <th className="p-2 text-[12px] whitespace-nowrap uppercase">
                      Last Name
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
                {filtered ? (
                  <tbody>
                    {filteredDataWithDate.length > 0 ? (
                      filteredDataWithDate.flatMap((item) =>
                        item.timeSheetList && item.timeSheetList.length > 0
                          ? item.timeSheetList
                              .reverse()
                              .map((timeSheet, index) => (
                                <tr
                                  key={`${item.employeeUniqueId}-${timeSheet.timeSheetId}`}
                                  style={{
                                    background:
                                      index % 2 === 0
                                        ? ""
                                        : `rgba(${hexToRgb(
                                            colors.primary
                                          )}, 0.1)`,
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
                                    {item.firstName}
                                  </td>
                                  <td
                                    className="p-2 text-sm"
                                    style={{ textAlign: "center" }}
                                  >
                                    {item.lastName}
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
                                  <td className=" p-4 text-sm flex justify-center items-center">
                                    {timeSheet.status === "APPROVED" && (
                                      <span className="font-medium text-green-500">
                                        APPROVED
                                      </span>
                                    )}
                                    {timeSheet.status === "REJECTED" && (
                                      <span className="font-medium text-red-600">
                                        REJECTED
                                      </span>
                                    )}
                                    {timeSheet.status === "PENDING" && (
                                      <>
                                        <span className="font-medium text-orange-500">
                                          PENDING
                                        </span>
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
                      {data.length > 0 ? (
                        data.flatMap((item) =>
                          item.timeSheetList && item.timeSheetList.length > 0
                            ? item.timeSheetList.reverse().map((timeSheet) => (
                                <tr
                                  key={`${item.employeeUniqueId}-${timeSheet.timeSheetId}`}
                                  style={{
                                    background:
                                      item.timeSheetList.indexOf(timeSheet) %
                                        2 ===
                                      0
                                        ? ""
                                        : `rgba(${hexToRgb(
                                            colors.primary
                                          )}, 0.1)`,
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
                                    {item.firstName}
                                  </td>
                                  <td
                                    className="p-2 text-sm"
                                    style={{ textAlign: "center" }}
                                  >
                                    {item.lastName}
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
                  </>
                )}
              </table>
            </div>
            <div className="p-4 bg-white flex justify-end items-center">
              <button
                onClick={
                  filteredData
                    ? () => {
                        handleApproveForFilterData;
                      }
                    : () => {
                        handleApprove;
                      }
                }
                className="px-4 py-2 bg-green-500 text-white rounded mr-4"
              >
                Approve
              </button>
              <button
                onClick={handleRejectionButtonClick}
                className="px-4 py-2 bg-red-500 text-white rounded"
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
