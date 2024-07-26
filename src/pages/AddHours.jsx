import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/theme-context";
import axios from "axios";
import toast from "react-hot-toast";

const AddHours = () => {
  const [isModalOpenStatus, setIsModalOpenStatus] = useState(true);
  const { colors } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [defaultWorkingHours, setDefaultWorkingHours] = useState(0.0);

  const generateTimeSheet = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/payrollManager/weekly-report",
        {
          managerUniqueId: "MGR2",
          firstName: firstName,
          lastName: lastName,
          startDate: startDate,
          endDate: endDate,
          defaultWorkingHours: defaultWorkingHours,
        }
      );
      console.log("Generated time sheet:", res.data);
      toast.success("Time Sheet Successfully Generated", { id: "add" });
    } catch (e) {
      console.error("Error generating time sheet:", e);
      toast.error("Employee Not Found", { id: "add" });
    }
  };

  const handleGenerateButton = (e) => {
    e.preventDefault();
    generateTimeSheet();
  };

  useEffect(() => {
    console.log("Component re-rendered, isModalOpenStatus:", isModalOpenStatus);
  }, [isModalOpenStatus]);

  return (
    <div className="w-full relative min-h-screen">
      <div className="w-full flex justify-end">
        {isModalOpenStatus && (
          <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]  bg-white rounded-lg">
            <div>
              <motion.div
                className=" shadow-md  z-50 rounded-lg p-10 flex flex-col gap-4 "
                initial={{ opacity: 0, y: "20px" }}
                animate={{ opacity: open ? 1 : 0, y: open ? "0" : "20px" }}
                transition={{ duration: 0.3 }}
              >
                <form className="flex flex-col gap-4 justify-between  h-full">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="first-name"
                        className="text-sm mb-1 font-medium"
                        style={{ color: colors.secondary }}
                      >
                        First Name
                      </label>
                      <input
                        id="first-name"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium mb-1"
                        style={{ color: colors.secondary }}
                      >
                        Last Name
                      </label>
                      <input
                        id="last-name"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="start-date"
                        className="text-sm mb-1 font-medium"
                        style={{ color: colors.secondary }}
                      >
                        Start Date
                      </label>
                      <input
                        id="start-date"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none placeholder:text-sm"
                        placeholder="yyyy-mm-dd"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="end-date"
                        className="text-sm font-medium mb-1"
                        style={{ color: colors.secondary }}
                      >
                        End Date
                      </label>
                      <input
                        id="end-date"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none placeholder:text-sm"
                        placeholder="yyyy-mm-dd"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="assigned-hours"
                        className="text-sm mb-1 font-medium"
                        style={{ color: colors.secondary }}
                      >
                        Default Company Hours
                      </label>
                      <input
                        id="assigned-hours"
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none placeholder:text-sm"
                        placeholder="HH : MM"
                        value={defaultWorkingHours}
                        onChange={(e) => setDefaultWorkingHours(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      className="px-10 py-2 rounded-sm"
                      type="submit"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.componentBackgroundColor,
                      }}
                      onClick={handleGenerateButton}
                    >
                      Generate
                    </button>
                    <button
                      className="px-10 py-2 rounded-sm"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.componentBackgroundColor,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddHours;
