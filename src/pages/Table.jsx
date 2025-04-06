/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth-context";
import { useTheme } from "../context/theme-context";

dayjs.extend(isSameOrBefore);

const TimesheetTable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const timesheetId = queryParams.get("timesheetId");
  const startDate = queryParams.get("startDate");
  const endDate = queryParams.get("endDate");

  const [timesheet, setTimesheet] = useState({});
  const [dates, setDates] = useState([]);
  const [endDay, setEndDay] = useState(dayjs(endDate));

  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      const generatedDates = [];
      const newTimesheet = {};

      for (
        let date = start;
        date.isSameOrBefore(end);
        date = date.add(1, "day")
      ) {
        generatedDates.push(date.format("YYYY-MM-DD"));
        newTimesheet[date.format("YYYY-MM-DD")] = "";
      }

      setDates(generatedDates);
      setTimesheet(newTimesheet);
    }
  }, [startDate, endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTimesheet((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { submittedTimestamp, setSubmittedTimestamp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalWeeklyWorkedHours = Object.values(timesheet).reduce(
      (acc, hours) => acc + (parseFloat(hours) || 0),
      0
    );
    const payload = {
      weeklySubmissionId: parseInt(timesheetId, 10),
      startDate,
      endDate,
      assignedDefaultHours: 40.0,
      totalWeeklyWorkedHours: totalWeeklyWorkedHours,
      totalOvertimeWorkedHours: totalWeeklyWorkedHours - 40.0,
    };

    try {
      const response = await fetch(
        "http://localhost:8086/api/payrollManager/updateWeeklyWorkedHours",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("API Response Data:", data);

        if (
          data.weeklyWorkReportDtoList &&
          data.weeklyWorkReportDtoList.length > 0
        ) {
          const report = data.weeklyWorkReportDtoList[0];
          console.log("Submitted Timestamp:", report.submittedTimestamp);
          setSubmittedTimestamp(report.submittedTimestamp);
        }
        toast.success("Timesheet submitted successfully!");
        navigate("/worksheet");
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit timesheet. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Updated Submitted Timestamp:", submittedTimestamp);
  }, [submittedTimestamp]);

  const handleReset = () => {
    const newTimesheet = {};
    dates.forEach((date) => (newTimesheet[date] = ""));
    setTimesheet(newTimesheet);
  };

  const totalHours = Object.values(timesheet).reduce(
    (acc, hours) => acc + (parseFloat(hours) || 0),
    0
  );

  const formatHours = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "" : number.toFixed(2);
  };

  const isEditable = (date) => {
    return dayjs(date).isSameOrBefore(endDay);
  };

  const { colors } = useTheme();

  return (
    <div className="flex justify-center items-center m-10">
      <div>
        <div className="mb-5 flex flex-col">
          <span className="font-medium text-sm text-gray-400">
            Timesheet ID
          </span>
          <span className="font-normal text-xl">{timesheetId}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto">
            <table className="border-collapse w-full">
              <thead>
                <tr>
                  <th
                    className="text-center px-4 py-2 text-white font-normal text-sm whitespace-nowrap"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Date
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date}
                      className="text-center px-4 py-2 text-white font-normal text-sm whitespace-nowrap"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <div>
                        <div className="text-xs font-medium">
                          {dayjs(date).format("dddd")}
                        </div>
                        <div>{dayjs(date).format("YYYY-MM-DD")}</div>
                      </div>
                    </th>
                  ))}
                  <th
                    className="text-center px-4 py-2 text-white font-normal text-sm whitespace-nowrap"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    className="text-center border-b border-l px-4 py-2 font-normal text-sm whitespace-nowrap"
                    style={{ color: colors.secondary }}
                  >
                    Hours
                  </td>
                  {dates.map((date) => (
                    <td key={date} className="border-b px-4 py-2">
                      <input
                        name={date}
                        value={formatHours(timesheet[date])}
                        onChange={handleChange}
                        min="0"
                        className={`w-full p-2 outline-none border border-gray-300 rounded-md text-gray-900 ${
                          isEditable(date)
                            ? ""
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                        disabled={!isEditable(date)}
                      />
                    </td>
                  ))}
                  <td
                    colSpan={dates.length}
                    className="border-b border-r px-4 py-2 text-center font-normal"
                  >
                    {totalHours.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              style={{ color: colors.primary }}
              className="bg-white font-semibold py-2 px-10 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              style={{ color: colors.primary }}
              className="bg-white font-semibold py-2 px-10 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetTable;
