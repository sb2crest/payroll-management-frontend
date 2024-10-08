import { useState } from "react";
import { addConsigneeData } from "../helpers/theme-api";
import toast from "react-hot-toast";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/auth-context";

function AddConsignee() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [workingDays, setWorkingDays] = useState(0);
  const [workingHours, setWorkingHours] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");

  const { ID } = useAuth();

  const addConsignee = async (e) => {
    e.preventDefault();
    console.log("ID : " + ID);
    try {
      const res = await addConsigneeData(
        ID,
        firstName,
        lastName,
        designation,
        paymentMode,
        dateOfJoining,
        workingDays,
        workingHours,
        paymentDate
      );
      console.log("Consignee successfully Added:", res);
      clearData();
      toast.success("Consignee Successfully Added", { id: "add" });
    } catch (e) {
      console.error("Error adding consignee data:", e);
      toast.error("Error in Adding consignee data", { id: "add" });
    }
  };

  const clearData = () => {
    setFirstName(" ");
    setLastName(" ");
    setDateOfJoining(" ");
    setDesignation(" ");
    setPaymentDate(" ");
    setPaymentMode(" ");
    setWorkingDays(0);
    setWorkingHours(0);
  };

  const { colors } = useTheme();

  return (
    <div className="flex justify-center m-5">
      <form
        className="bg-white p-5 shadow-lg rounded-sm"
        onSubmit={addConsignee}
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label
              htmlFor="first-name"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              First Name
            </label>
            <input
              id="first-name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="last-name"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Last Name
            </label>
            <input
              id="last-name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label
              htmlFor="doj"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Date of Joining
            </label>
            <input
              id="doj"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#AB85F0]"
              placeholder="yyyy-mm-dd"
              onChange={(e) => setDateOfJoining(e.target.value)}
              value={dateOfJoining}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="designation"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Role
            </label>
            <input
              id="designation"
              className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setDesignation(e.target.value)}
              value={designation}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label
              htmlFor="payment"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Payment Mode
            </label>
            <input
              id="payment"
              className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setPaymentMode(e.target.value)}
              value={paymentMode}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="days"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Working Days
            </label>
            <input
              id="days"
              className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setWorkingDays(e.target.value)}
              value={workingDays}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col">
            <label
              htmlFor="hours"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Working Hours
            </label>
            <input
              id="hours"
              className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#AB85F0]"
              onChange={(e) => setWorkingHours(e.target.value)}
              value={workingHours}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="pay-date"
              className="text-md mb-1"
              style={{ color: colors.secondary }}
            >
              Pay Date
            </label>
            <input
              id="pay-date"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#AB85F0]"
              placeholder="yyyy-mm-dd"
              onChange={(e) => setPaymentDate(e.target.value)}
              value={paymentDate}
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
          >
            Add
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
    </div>
  );
}

export default AddConsignee;
