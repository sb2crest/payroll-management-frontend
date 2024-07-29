// src/TimesheetTable.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import toast from "react-hot-toast";

dayjs.extend(isSameOrBefore);

const TimesheetTable = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
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
      const nextTwoDays = [
        end.add(1, "day").format("YYYY-MM-DD"),
        end.add(2, "day").format("YYYY-MM-DD"),
      ];

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

      generatedDates.push(...nextTwoDays);
      nextTwoDays.forEach((date) => (newTimesheet[date] = ""));

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the API call
    const totalWeeklyWorkedHours = Object.values(timesheet).reduce(
      (acc, hours) => acc + (parseFloat(hours) || 0),
      0
    );
    const payload = {
      weeklySubmissionId: parseInt(timesheetId, 10),
      startDate,
      endDate,
      assignedDefaultHours: 40.0, // Assuming assigned default hours are static
      totalWeeklyWorkedHours: totalWeeklyWorkedHours,
      totalOvertimeWorkedHours: totalWeeklyWorkedHours - 40.0, // Example calculation for overtime
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/payrollManager/updateWeeklyWorkedHours",
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
        toast.success("Timesheet submitted successfully!"); // Show success message
        navigate("/worksheet"); // Navigate to the "Worksheet" page
      } else {
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit timesheet. Please try again."); // Show error message
    }
  };

  const handleReset = () => {
    const newTimesheet = {};
    dates.forEach((date) => (newTimesheet[date] = ""));
    setTimesheet(newTimesheet); // Reset the form to initial state
  };

  const totalHours = Object.values(timesheet).reduce(
    (acc, hours) => acc + (parseFloat(hours) || 0),
    0
  );

  const formatHours = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? "" : number.toFixed(2);
  };

  // Determine if a date is editable
  const isEditable = (date) => {
    return dayjs(date).isSameOrBefore(endDay);
  };

  return (
    <div className="max-w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-gray-50">
      <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
        Timesheet for {timesheetId}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 bg-gray-500 text-white text-left">
                  Timesheet ID
                </th>
                <th className="border border-gray-300 px-4 py-2 bg-gray-500 text-white text-left">
                  Date
                </th>
                {dates.map((date) => (
                  <th
                    key={date}
                    className="border border-gray-300 px-4 py-2 bg-gray-500 text-white text-center"
                  >
                    {dayjs(date).format("YYYY-MM-DD")}
                  </th>
                ))}
                <th className="border border-gray-300 px-4 py-2 bg-gray-500 text-white text-center">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                  {timesheetId}
                </td>
                <td className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                  Hours Worked
                </td>
                {dates.map((date) => (
                  <td key={date} className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      name={date}
                      value={formatHours(timesheet[date])}
                      onChange={handleChange}
                      min="0"
                      className={`w-full p-2 border border-gray-300 rounded-md text-gray-900 ${
                        isEditable(date) ? "" : "bg-gray-200 cursor-not-allowed"
                      }`}
                      disabled={!isEditable(date)}
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2 text-center">
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
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimesheetTable;
