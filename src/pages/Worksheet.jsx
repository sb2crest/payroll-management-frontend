import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const Worksheet = () => {
  const { colors } = useTheme();
  const { ID } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Function to fetch time sheet data
  const fetchTimeSheetData = async (ID) => {
    const res = await axios.get(
      `https://payroll.seabed2crest.com/api/payrollEmployee/listOfTimeSheets?employeeUniqueId=${ID}`
    );
    console.log("res:", res.data);
    return res.data.timeSheet;
  };

  // Function to update worked hours
  const updateWorkHours = async (data) => {
    await axios.put(
      `https://parroll.seabed2crest.com/api/payrollManager/updateWeeklyWorkedHours`,
      data
    );
  };

  // Query to fetch time sheet data
  const { data: timeSheet = [], status: queryStatus } = useQuery({
    queryKey: ["timeSheet", ID],
    queryFn: () => fetchTimeSheetData(ID),
  });

  // eslint-disable-next-line no-unused-vars
  const mutation = useMutation({
    mutationFn: updateWorkHours,
    onSuccess: () => {
      // Invalidate the query to refetch data
      queryClient.invalidateQueries(["timeSheet", ID]);
    },
    onError: () => {
      // Handle error (optional)
    },
  });

  const handleRowClick = (sheet) => {
    navigate(
      `/table?timesheetId=${sheet.timeSheetId}&startDate=${sheet.startDate}&endDate=${sheet.endDate}`
    );
  };

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "APPROVED":
        return "text-green-500";
      case "PENDING":
        return "text-orange-500";
      case "REJECTED":
        return "text-red-500";
      case "DRAFT":
        return "underline text-purple-500 cursor-pointer";
      default:
        return "";
    }
  };

  const [sortedTimeSheets, setSortedTimeSheets] = useState([]);

  useEffect(() => {
    if (timeSheet) {
      const sheetsWithTimestamp = timeSheet.filter(
        (sheet) => sheet.submittedTimestamp
      );
      const sheetsWithoutTimestamp = timeSheet.filter(
        (sheet) => !sheet.submittedTimestamp
      );

      const sortedSheets = [...sheetsWithTimestamp].sort(
        (a, b) =>
          new Date(b.submittedTimestamp) - new Date(a.submittedTimestamp)
      );

      setSortedTimeSheets([...sortedSheets, ...sheetsWithoutTimestamp]);
    }
  }, [timeSheet]);

  return (
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
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          <table className="my-auto w-full rounded-sm mt-5 overflow-hidden">
            <thead
              className="text-white"
              style={{ background: colors.primary }}
            >
              <tr>
                <th className="p-2 text-sm uppercase">Status</th>
                <th className="p-2 text-sm uppercase">Time Sheet ID</th>
                <th className="p-2 text-sm uppercase">Start Date</th>
                <th className="p-2 text-sm uppercase">End Date</th>
                <th className="p-2 text-sm uppercase">Default Hours</th>
                <th className="p-2 text-sm uppercase">Total Hours</th>
                <th className="p-2 text-sm uppercase">Over Time</th>
              </tr>
            </thead>
            <tbody>
              {queryStatus === "loading" ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : queryStatus === "error" ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Error fetching data
                  </td>
                </tr>
              ) : (
                sortedTimeSheets.map((sheet, index) => (
                  <tr
                    key={sheet.timeSheetId}
                    style={{
                      background:
                        index % 2 === 0
                          ? ""
                          : `rgba(${hexToRgb(colors.primary)}, 0.1)`,
                    }}
                  >
                    <td
                      className={`p-2 text-sm ${getStatusClasses(
                        sheet.status
                      )}`}
                      onClick={
                        sheet.status === "DRAFT"
                          ? () => handleRowClick(sheet)
                          : undefined
                      }
                    >
                      {sheet.status}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.timeSheetId}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.startDate}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.endDate}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.assignedDefaultHours}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.totalWorkedHours}
                    </td>
                    <td className="p-2 text-sm" style={{ textAlign: "center" }}>
                      {sheet.overTimeWorkedHours}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Worksheet;
