import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useTheme } from "../context/theme-context";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

function AddHour() {
  const [open, setOpen] = useState(true);
  const [openr, setOpenR] = useState(false);
  const handleSelect = (e) => {
    e.preventDefault();
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
          />
        )}
      </div>
      {openr && <AsignedEmployeeCard />}
    </div>
  );
}

export default AddHour;

const AddEmployeeCard = ({ open, setOpen, handleSelect }) => {
  const { theme } = useTheme();

  return (
    <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[600px] bg-white rounded-lg">
      <div>
        <motion.div
          className=" shadow-md  z-50 rounded-lg p-10 flex flex-col gap-4 h-[300px]  "
          initial={{ opacity: 0, y: "20px" }}
          animate={{ opacity: open ? 1 : 0, y: open ? "0" : "20px" }}
          transition={{ duration: 0.3 }}
        >
          <form
            onSubmit={handleSelect}
            className="flex flex-col gap-4 justify-between  h-full"
          >
            <div className="grid grid-cols-2 items-center">
              <div className="col-span-1 font-semibold ">SELECT EMPLOYEE :</div>
              <div className="col-span-1">
                <select
                  name="#"
                  id=""
                  className="w-full border-[1px]  p-2 rounded-lg"
                >
                  <option value="#" defaultValue={true}>
                    Select the employee...
                  </option>
                  <option value="#">PRATHIBA</option>
                  <option value="#">SRIKANTH</option>
                  <option value="#">JEEVAN</option>
                  <option value="#">NIVEDITHA</option>
                </select>
              </div>
            </div>
            <div className="w-full grid grid-cols-2 gap-5">
              <button
                className="col-span-1 p-2 rounded-lg bg-gray-400 text-white"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="col-span-1 p-2 rounded-lg bg-gray-400 text-white"
                style={{ background: theme.colors.primary }}
              >
                Add
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
        <p>SELECTED EMPLOYEE :</p>
        <p className="text-lg font-semibold">SRIKANTH</p>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-8">
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">EMPLOYEE NAME :</p>
          <p className="text-sm">SRIKANTH</p>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">DATE OF JOIN :</p>
          <p className="text-sm">01/05/2024</p>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">PAYMENT MODE :</p>
          <p className="text-sm">MONTHLY</p>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">WORKING DAYS IN THE WEEK :</p>
          <p className="text-sm">FIVE DAYS</p>
        </div>
        <div className="col-span-1 flex items-center gap-4">
          <p className="text-sm text-gray-400">WORKING HOURS :</p>
          <p className="text-sm">45 HOURS</p>
        </div>
      </div>
      <div className="mt-8 w-full">
        <table className="w-full bg-gray-300 border-2 rounded-lg overflow-hidden">
          <thead className="p-2">
            <tr>
              <th className="text-left p-3 border-2 border-white">
                NAME OF EMPLOYEE
              </th>
              <th className="text-left p-3  border-2 border-white">
                FROM DATE
              </th>
              <th className="text-left p-3  border-2 border-white">TO DATE</th>
              <th className="text-left p-3  border-2 border-white">
                ASSIGNED HOURS
              </th>
              <th className="text-left p-3  border-2 border-white">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3  border-2 border-white">SRIKANTH</td>
              <td className="p-3  border-2 border-white">30/06/2024</td>
              <td className="p-3  border-2 border-white">06/07/2024</td>
              <td className="p-3  border-2 border-white">45</td>
              <td className="p-3  border-2 border-white text-green-500">
                APPROVED
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-full mt-8 p-4 bg-gray-300 rounded-lg">
        <p>PERIOD</p>
        <div className=" flex items-center gap-5 mt-4">
          <input type="date" className="p-2 border-[1px] border-black" />{" "}
          <span>to</span>{" "}
          <input type="date" className="p-2 border-[1px] border-black" />
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
