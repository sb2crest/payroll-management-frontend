import { useState, useEffect } from "react";
import { useTheme } from "../context/theme-context";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  getAllEmployeeData,
  getAllEmployees,
  updateEmployeeData,
} from "../helpers/theme-api";
import toast from "react-hot-toast";

function UpdateHours() {
  const [open, setOpen] = useState(true);
  const [openr, setOpenR] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
  });

  const handleSelect = (e) => {
    e.preventDefault();
    console.log("Selected Employee ID:", selectedItem);
    setOpen(false);
    setOpenR(true);
  };

  return (
    <div className="w-full p-5 relative min-h-screen">
      <div className="w-full flex justify-end">
        {open && (
          <AddEmployeeCard
            open={open}
            setOpen={setOpen}
            handleSelect={handleSelect}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        )}
      </div>
      {openr && <AssignedEmployeeCard selectedItem={selectedItem} />}
    </div>
  );
}

export default UpdateHours;

const AddEmployeeCard = ({
  open,
  setOpen,
  handleSelect,
  error,
  isLoading,
  data,
  selectedItem,
  setSelectedItem,
}) => {
  const { colors } = useTheme();

  // Check if data is defined before filtering
  const filteredData = data
    ? data.filter(
        (employee) =>
          employee.status !== "APPROVED" && employee.status !== "DRAFT"
      )
    : [];

  return (
    <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[600px] bg-white rounded-lg">
      <div>
        <motion.div
          className="shadow-md z-50 rounded-lg p-10 flex flex-col gap-4 h-[300px]"
          initial={{ opacity: 0, y: "20px" }}
          animate={{ opacity: open ? 1 : 0, y: open ? "0" : "20px" }}
          transition={{ duration: 0.3 }}
        >
          <form
            onSubmit={handleSelect}
            className="flex flex-col gap-4 justify-between h-full"
          >
            <div className="grid grid-cols-2 items-center">
              <div className="col-span-1 font-semibold">SELECT EMPLOYEE :</div>
              <div className="col-span-1">
                {error ? (
                  <p>Can't get employees</p>
                ) : isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <select
                    value={selectedItem}
                    name="employee"
                    id="employee"
                    className="w-full border-[1px] p-2 rounded-lg"
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an employee
                    </option>
                    {filteredData.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.employeeUniqueId}
                      >
                        {`${employee.firstName} ${employee.lastName}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-5">
              <button
                className="col-span-1 p-2 rounded-lg"
                onClick={() => setOpen(false)}
                style={{
                  backgroundColor: colors.primary,
                  color: colors.componentBackgroundColor,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="col-span-1 p-2 rounded-lg bg-gray-400 text-white"
                style={{ background: colors.primary }}
              >
                SELECT
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const AssignedEmployeeCard = ({ selectedItem }) => {
  const { colors } = useTheme();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["employeeData", selectedItem],
    queryFn: () => getAllEmployeeData(selectedItem),
    enabled: !!selectedItem,
  });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hour, setHour] = useState();
  const [totalHours, setTotalHours] = useState([]);
  const [totalOvertimeWorkedHours, setTotalOvertimeWorkedHours] = useState([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (data) {
      const initialStartDate =
        data.timeSheet.length > 0 ? data.timeSheet[0].fromDate : "";
      const initialEndDate =
        data.timeSheet.length > 0 ? data.timeSheet[0].toDate : "";
      const initialHour = data.assignedDefaultHours || 0;

      const workedHours = data.timeSheet.map((val) => val.totalWorkedHours);
      const overtimeHours = data.timeSheet.map(
        (val) => val.overTimeWorkedHours
      );

      setStartDate(initialStartDate);
      setEndDate(getOneWeekLater(initialStartDate)); // Set end date to one week after start date
      setHour(initialHour);
      setTotalHours(workedHours[0]);
      setTotalOvertimeWorkedHours(overtimeHours[0]);
    }
  }, [data]);

  useEffect(() => {
    if (startDate) {
      setEndDate(getOneWeekLater(startDate));
    }
  }, [startDate]);

  const getOneWeekLater = (date) => {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return end.toISOString().split("T")[0]; // Format the date as yyyy-mm-dd
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const weeklySubmissionId = data.timeSheet.map((val) => val.timeSheetId);
      toast.loading("Updating Hours", { id: "update" });
      await updateEmployeeData(
        +weeklySubmissionId,
        startDate,
        endDate,
        +hour,
        +totalHours,
        +totalOvertimeWorkedHours
      );
      setShow(false);
      // Refetch the data after update
      refetch();
      toast.success("Updated Successfully", { id: "update" });
    } catch (error) {
      toast.error("cant update", { id: "update" });
    }
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg border-[1px]">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading employee data</p>
      ) : (
        <>
          <div className="flex items-center gap-10">
            <p>SELECTED EMPLOYEE :</p>
            <p className="text-lg font-semibold">{`${data.firstName} ${data.lastName}`}</p>
          </div>
          <div className="grid grid-cols-3 gap-5 mt-8">
            <div className="col-span-1 flex items-center gap-4">
              <p className="text-sm text-gray-400">EMPLOYEE ID :</p>
              <p className="text-sm">{data.employeeUniqueId}</p>
            </div>
            <div className="col-span-1 flex items-center gap-4">
              <p className="text-sm text-gray-400">DATE OF JOIN :</p>
              <p className="text-sm">{data.dateOfJoining}</p>
            </div>
            <div className="col-span-1 flex items-center gap-4">
              <p className="text-sm text-gray-400">PAYMENT MODE :</p>
              <p className="text-sm">{data.paymentMode}</p>
            </div>
            <div className="col-span-1 flex items-center gap-4">
              <p className="text-sm text-gray-400">
                WORKING DAYS IN THE WEEK :
              </p>
              <p className="text-sm">{data.workingDays}</p>
            </div>
            <div className="col-span-1 flex items-center gap-4">
              <p className="text-sm text-gray-400">WORKING HOURS :</p>
              <p className="text-sm">{data.assignedDefaultHours}</p>
            </div>
          </div>
          <div className="mt-8 w-full">
            <table className="w-full bg-gray-200 border-2 rounded-lg overflow-hidden">
              <thead className="p-2">
                <tr>
                  <th className="text-left p-3 border-2 text-sm border-white">
                    STATUS
                  </th>
                  <th className="text-left p-3 border-2 text-sm border-white">
                    EMPLOYEE ID
                  </th>
                  <th className="text-left p-3 border-2 text-sm border-white">
                    FROM DATE
                  </th>
                  <th className="text-left p-3 border-2 text-sm border-white">
                    TO DATE
                  </th>
                  <th className="text-left uppercase p-3 border-2 text-sm border-white">
                    Total Weekly Worked Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.timeSheet && data.timeSheet.length > 0 ? (
                  data.timeSheet.map((val, index) => (
                    <tr key={index}>
                      <td
                        className={`p-3 border-2 text-sm border-white ${
                          val.status === "PENDING"
                            ? "text-red-500"
                            : val.status === "APPROVED"
                            ? "text-green-400"
                            : val.status === "DRAFT"
                            ? "text-blue-500"
                            : "text-black"
                        }`}
                      >
                        {val.status}
                      </td>
                      <td className="p-3 border-2 text-sm border-white">
                        {data.employeeUniqueId}
                      </td>
                      <td className="p-3 border-2 text-sm border-white">
                        {val.fromDate}
                      </td>
                      <td className="p-3 border-2 text-sm border-white">
                        {val.toDate}
                      </td>
                      <td className="p-3 border-2 text-sm border-white">
                        {val.totalWorkedHours}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="p-3 border-2 text-sm border-white"
                      colSpan="5"
                    >
                      No time sheet data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {show && (
            <div className="w-full mt-8 p-4 bg-gray-200 rounded-lg">
              <p className="text-sm font-semibold">UPDATE HOURS</p>
              <form onSubmit={handleUpdate}>
                <div className="flex items-center mt-5 gap-10 w-full">
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">FROM DATE</p>
                    <input
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      type="date"
                      className="p-2 border-[1px] rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs">TO DATE</p>
                    <input
                      value={endDate}
                      type="date"
                      className="p-2 border-[1px] rounded-lg"
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <p className="text-gray-400 text-xs uppercase">
                      Total Weekly Worked Hours
                    </p>
                    <input
                      value={totalOvertimeWorkedHours}
                      onChange={(e) =>
                        setTotalOvertimeWorkedHours(e.target.value)
                      }
                      type="number"
                      className="p-2 border-[1px] rounded-lg"
                    />
                  </div>
                </div>
                <div className="mt-5 w-full flex justify-end">
                  <button
                    type="submit"
                    className="p-2 px-5 text-white rounded-lg"
                    style={{ background: colors.primary }}
                  >
                    UPDATE
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};
