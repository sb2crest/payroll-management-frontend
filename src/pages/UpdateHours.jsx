import { useState } from "react";
import { useTheme } from "../context/theme-context";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getAllEmployeeData, getAllEmployees } from "../helpers/theme-api";

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
    console.log("logging" + selectedItem);
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
      {openr && <AsignedEmployeeCard selectedItem={selectedItem} />}
    </div>
  );
}

export default UpdateHours;

const AddEmployeeCard = ({ open, setOpen, handleSelect }) => {
  const { theme } = useTheme();

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
              <form className="col-span-1" onSubmit={handleSelect}>
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
                    {data.map((employee) => (
                      <option
                        key={employee.id}
                        value={employee.employeeUniqueId}
                      >
                        {`${employee.firstName} ${employee.lastName}`}
                      </option>
                    ))}
                  </select>
                )}
              </form>
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
                className="col-span-1 p-2 rounded-lg bg-gray-400 text-white"
                style={{ background: theme.colors.primary }}
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

const AsignedEmployeeCard = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full p-4 bg-white rounded-lg border-[1px]">
      <div className="flex items-center gap-10">
        <p className="font-semibold ">SELECTED EMPLOYEE :</p>
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
          <p className="text-sm text-gray-400">WORKING DAYS IN THE WEEK :</p>
          <p className="text-sm">{data.workingDays}</p>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">WORKING HOURS :</p>
          <p className="text-sm">{data.assignedDefaultHours}</p>
        </div>
      </div>
      <div className="mt-8 w-full">
        <table className="w-full bg-gray-300 border-2 rounded-lg overflow-hidden">
          <thead className="p-2">
            <tr>
              <th className="text-left p-3 border-2 border-white text-[10px]">
                STATUS
              </th>

              <th className="text-left p-3 border-2 border-white text-sm">
                FROM DATE
              </th>
              <th className="text-left p-3 border-2 border-white text-sm">
                TO DATE
              </th>
              <th className="text-left p-3 border-2 border-white text-sm">
                ASSIGNED HOURS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {data.timeSheet.map((val) => (
                <>
                  <td
                    className="p-3 border-2 border-white"
                    style={{
                      color: val.status === "PENDING" ? "red" : "black",
                    }}
                  >
                    {val.status}
                  </td>

                  <td className="p-3 border-2 border-white">{val.fromDate}</td>
                  <td className="p-3 border-2 border-white">{val.toDate}</td>
                  <td className="p-3 border-2 border-white">
                    {data.assignedDefaultHours}
                  </td>
                </>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full mt-8 p-4 bg-gray-300 rounded-lg">
        <p className="font-semibold">UPDATE HOUR</p>
        <div className="flex items-center gap-5 mt-4">
          <div>
            <span className="text-sm mr-3">from</span>
            <input
              type="date"
              className="p-2 border-[1px] rounded-lg border-gray-400"
            />{" "}
          </div>

          <div>
            <span className="text-sm mr-3">to</span>
            <input
              type="date"
              className="p-2 border-[1px] rounded-lg border-gray-400"
            />
          </div>
        </div>
        <div className="mt-4 w-full flex justify-end">
          <div className="flex place-items-center gap-3">
            <button
              className="p-2 rounded-lg text-white"
              style={{ background: theme.colors.primary }}
            >
              SAVE
            </button>
            <button className="bg-blue-500 p-2 text-white rounded-lg">
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
