import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CiSearch } from "react-icons/ci";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Function to fetch time sheet data
const fetchTimeSheetData = async (ID) => {
  const res = await axios.get(
    `http://localhost:8080/api/payrollEmployee/listOfTimeSheets?employeeUniqueId=${ID}`
  );
  return res.data.timeSheet;
};

// Function to update worked hours
const updateWorkHours = async (data) => {
  await axios.put(
    `http://localhost:8080/api/payrollManager/updateWeeklyWorkedHours`,
    data
  );
};

const Worksheet = () => {
  const { colors } = useTheme();
  const { ID } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query to fetch time sheet data
  const { data: timeSheet = [], status: queryStatus } = useQuery({
    queryKey: ["timeSheet", ID],
    queryFn: () => fetchTimeSheetData(ID),
  });

  // Mutation to update worked hours
  const mutation = useMutation({
    mutationFn: updateWorkHours,
    onSuccess: () => {
      // Invalidate the query to refetch data
      queryClient.invalidateQueries(["timeSheet", ID]);
      setSubmitHours(false);
    },
    onError: () => {
      // Handle error (optional)
    },
  });

  const [submitHours, setSubmitHours] = useState(false);
  const [modifyHours, setModifyHours] = useState(false);
  const [overTime, setOverTime] = useState(0);
  const [totalHours, setTotalHours] = useState(40);
  const [worksheetStatus, setWorksheetStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [defaultWorkingHours, setDefaultWorkingHours] = useState(0.0);
  const [timeSheetID, setTimeSheetID] = useState(0);

  // Function to handle over time input change
  const handleOverTimeChange = (event) => {
    const newOverTime = parseFloat(event.target.value) || 0;
    setOverTime(newOverTime);   
    setTotalHours(defaultWorkingHours + newOverTime);
  };

  // Handler for submitting hours
  const handleSubmitHours = () => {
    mutation.mutate({
      weeklySubmissionId: timeSheetID,
      startDate,
      endDate,
      assignedDefaultHours: defaultWorkingHours,
      totalWeeklyWorkedHours: totalHours,
      totalOvertimeWorkedHours: overTime,
    });
  };

  const handleRowClick = (sheet) => {
    navigate(`/table?timesheetId=${sheet.timeSheetId}&startDate=${sheet.fromDate}&endDate=${sheet.toDate}`);
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
                <div className="p-4">
                  <div className="flex">
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Status
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        {worksheetStatus}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        WorkSheet ID
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        {timeSheetID}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Start Date
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        {startDate}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        End Date
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        {endDate}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-[#9d9d9dee] font-medium">
                        Default Hours
                      </span>
                      <br />
                      <span className="text-md text-[#4D5664] font-normal">
                        {defaultWorkingHours}
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
                      <div className="grid grid-cols-2 gap-6 pl-6 pr-6 pb-2">
                        <form
                          className="flex flex-col"
                          onSubmit={(e) => e.preventDefault()}
                        >
                          <label className="text-sm mb-1 text-[#9d9d9dee] font-medium">
                            Over Time
                          </label>
                          <input
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            type="number"
                            value={overTime}
                            onChange={handleOverTimeChange}
                            step="0.01"
                          />
                        </form>
                        <div className="flex flex-col">
                          <label className="text-sm mb-1 text-[#9d9d9dee] font-medium">
                            Total Hours
                          </label>
                          <input
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                            type="text"
                            value={`${totalHours} Hours`}
                            readOnly
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                    onClick={handleSubmitHours}
                    disabled={mutation.isLoading}
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
                      Time Sheet ID
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
                      Total Hours
                    </th>
                    <th
                      className="border-2 border-white p-2 text-sm"
                      style={{ color: colors.secondary }}
                    >
                      Over Time
                    </th>
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
                    timeSheet.map((sheet) => (
                      <tr key={sheet.timeSheetId} onClick={() => handleRowClick(sheet)}>
                        <td
                          className="border-2 border-white p-2 text-sm underline cursor-pointer"
                          style={{ color: "black" }}
                          onClick={() => {
                            setSubmitHours(true);
                            setWorksheetStatus(sheet.status);
                            setStartDate(sheet.fromDate);
                            setEndDate(sheet.toDate);
                            setTimeSheetID(sheet.timeSheetId);
                            setDefaultWorkingHours(sheet.assignedDefaultHours);
                            setTotalHours(sheet.totalWorkedHours);
                            setOverTime(sheet.overTimeWorkedHours);
                          }}
                        >
                          {sheet.status}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.timeSheetId}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.fromDate}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.toDate}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.assignedDefaultHours}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.totalWorkedHours}
                        </td>
                        <td className="border-2 border-white p-2 text-sm">
                          {sheet.overTimeWorkedHours}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Pagination Component */}
              <div className="mt-4">{/* Implement pagination if needed */}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Worksheet;
