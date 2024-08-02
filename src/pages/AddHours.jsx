/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useTheme } from "../context/theme-context";
import toast from "react-hot-toast";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  createTimeSheetData,
  deleteTimeSheet,
  getAllEmployees,
  getEmployeeData,
  updateEmployeeData,
} from "../helpers/theme-api";
import { GoPlus } from "react-icons/go";
import { useAuth } from "../context/auth-context";

const AddHours = () => {
  const { ID } = useAuth();

  const [open, setOpen] = useState(true);
  const [openr, setOpenR] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getAllEmployeesData = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await getAllEmployees(ID);
      if (data) {
        setData(data);
      }
    } catch (error) {
      setError(true);
      setErrorMsg(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEmployeesData();
  }, [ID]);

  const handleSelect = (e) => {
    setSelectedItem(e.target.value);
    setOpen(false);
    setOpenR(true);
  };

  return (
    <div
      className={`w-full p-5 relative min-h-screen ${
        open ? "flex  mt-[200px] justify-center" : ""
      }`}
    >
      <div>
        {loading ? (
          <p>Loading</p>
        ) : error ? (
          <p>{errorMsg}</p>
        ) : data.length !== 0 ? (
          <AddEmployeeCard
            data={data}
            handleSelect={handleSelect}
            setSelectedItem={setSelectedItem}
            openr={openr}
          />
        ) : null}
      </div>
      {openr && selectedItem && (
        <AssignedEmployeeCard selectedItem={selectedItem} />
      )}
    </div>
  );
};

export default AddHours;

// eslint-disable-next-line no-unused-vars
const AddEmployeeCard = ({ data, handleSelect, setSelectedItem, openr }) => {
  // eslint-disable-next-line no-unused-vars
  const { colors } = useTheme();

  console.log(data);

  return (
    <div>
      <div className="flex items-center mt-5">
        <form className="font-semibold flex gap-5 items-center">
          <select
            onChange={handleSelect}
            className="select select-bordered w-[400px] max-w-xs"
          >
            <option disabled selected>
              Select Employee
            </option>
            {data.map((val, index) => (
              <option
                className="text-md border-[1px] p-4"
                key={index}
                value={val.employeeUniqueId}
              >{`${val.firstName} ${val.lastName}`}</option>
            ))}
          </select>
        </form>
      </div>
    </div>
  );
};

const AssignedEmployeeCard = ({ selectedItem }) => {
  const { colors } = useTheme();

  const [data, setData] = useState(null);

  const fetchSelectedEmployeeData = async () => {
    try {
      const gettingData = await getEmployeeData(selectedItem);
      if (gettingData) {
        setData(gettingData[0]);
      }
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchSelectedEmployeeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  return (
    <div className="w-full p-4 mt-5 border-t-[1px] ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-10">
          <p className="">SELECTED EMPLOYEE :</p>{" "}
          <p className="text-lg font-semibold text-gray-500">{`${data.firstName} ${data.lastName}`}</p>
        </div>
        <div className="flex items-center gap-10">
          <p className="">EMPLOYEE ID :</p>{" "}
          <p className="text-lg font-semibold text-gray-500">
            {data.employeeUniqueId}
          </p>
        </div>
        <CreateModal
          data={data}
          fetchSelectedEmployeeData={fetchSelectedEmployeeData}
        />
      </div>

      <div className="mt-5 w-full overflow-x-auto ">
        <table className="w-full border-[1px] rounded-lg">
          <thead className="text-white" style={{ background: colors.primary }}>
            <tr className="border-b-[1px]">
              <th className="p-3 text-sm text-center">STATUS</th>
              <th className="p-3 text-sm text-center">FROM DATE</th>
              <th className="p-3 text-sm text-center">TO DATE</th>
              <th className="p-3 text-sm text-center">TOTAL WORKED HOURS</th>
              <th className="p-2 text-sm text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.timeSheet.reverse().map((val, index) => (
              <tr
                key={val.timeSheetId}
                className={`border-b-[1px]`}
                style={{
                  background:
                    index % 2 === 0
                      ? ""
                      : `rgba(${hexToRgb(colors.primary)}, 0.1)`,
                }}
              >
                <td
                  className={`text-center  p-2 ${
                    val.status === "DRAFT"
                      ? "text-blue-500"
                      : val.status === "PENDING"
                      ? "text-red-500"
                      : val.status === "REJECTED"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {val.status}
                </td>
                <td className="p-2 text-sm text-gray-700 text-center">
                  {val.fromDate}
                </td>
                <td className="p-2 text-sm text-gray-700 text-center">
                  {val.toDate}
                </td>
                <td className="p-2 text-sm text-gray-700 text-center">
                  {val.assignedDefaultHours}
                </td>
                <td className="p-2 flex items-center gap-5 justify-center">
                  <EditCard
                    data={val}
                    fetchSelectedEmployeeData={fetchSelectedEmployeeData}
                  />
                  <DeleteCard
                    timeSheetId={val.timeSheetId}
                    fetchSelectedEmployeeData={fetchSelectedEmployeeData}
                    data={val}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CreateModal = ({ data, fetchSelectedEmployeeData }) => {
  const { colors } = useTheme();

  const { ID } = useAuth();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const today = new Date();
  const [startDate, setStartDate] = useState(formatDate(today));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [totalHours, setTotalHours] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (startDate) {
      setEndDate(getOneWeekLater(startDate));
    }
  }, [startDate]);

  const getOneWeekLater = (date) => {
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 5);
    return formatDate(end);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("comming one");
    try {
      toast.loading("Creating time sheet", { id: "create" });
      const res = await createTimeSheetData(
        data.firstName,
        data.lastName,
        startDate,
        endDate,
        totalHours,
        ID
      );

      if (res) {
        await fetchSelectedEmployeeData();
        toast.success("Timesheet created Successfully", { id: "create" });
        setStartDate(formatDate(today));
        setTotalHours("");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("Error creating the timesheet", { id: "create" });
    }
  };

  return (
    <>
      <button
        className="rounded-lg text-white p-2 px-5 font-medium flex items-center gap-1"
        onClick={() => setIsModalOpen(true)}
        style={{ background: colors.primary }}
      >
        ADD
        <span>
          <GoPlus />
        </span>
      </button>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <dialog open className="modal fixed inset-0 z-50">
            <div
              className="modal-box relative border-t-[10px]"
              style={{ borderTopColor: colors.primary }}
            >
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <form method="dialog" onSubmit={handleSubmit}>
                <div className="w-full flex items-center justify-center flex-col gap-3">
                  <h1 className="text-2xl font-semibold">Add Timesheet</h1>
                  <div className="w-full flex items-center gap-3">
                    <div className="w-full flex flex-col">
                      <label htmlFor="start-date">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="end-date">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        disabled
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="total-hours">Total Worked Hours</label>
                    <input
                      type="number"
                      value={totalHours}
                      onChange={(e) => setTotalHours(e.target.value)}
                      placeholder="Enter hours"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-3 w-full text-white rounded-lg"
                    style={{ background: colors.primary }}
                  >
                    ADD
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

const DeleteCard = ({ timeSheetId, fetchSelectedEmployeeData, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDisable =
    data.status === "PENDING"
      ? true
      : data.status === "REJECTED"
      ? true
      : false;
  const handleDelete = async () => {
    try {
      toast.loading("Deleting", { id: "delete" });
      const res = await deleteTimeSheet(timeSheetId);
      if (res) {
        await fetchSelectedEmployeeData();
        setIsModalOpen(false);
        toast.success("Timesheet deleted", { id: "delete" });
      }
    } catch (error) {
      toast.error("Can't delete the timesheet", { id: "delete" });
    }
  };
  return (
    <>
      <button
        disabled={isDisable}
        className={`rounded-lg  p-2 font-medium flex items-center gap-1 ${
          isDisable
            ? "text-gray-300 hover:text-gray-300"
            : "text-black hover:text-red-500"
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <span className=" ">
          <MdDelete />
        </span>
      </button>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <dialog open className="modal fixed inset-0 z-50">
            <div className="modal-box relative flex flex-col gap-5 border-t-[10px] border-t-red-400">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <h1 className="text-2xl text-gray-800 font-semibold">
                Delete Timesheet
              </h1>
              <p className="text-sm">Are you sure want to delete?</p>
              <div className="flex items-center w-full gap-5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full p-2 text-black bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  className="w-full p-2 text-white bg-red-400 rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

const EditCard = ({ data, fetchSelectedEmployeeData }) => {
  // eslint-disable-next-line no-unused-vars
  const { colors } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workeHour, setWorkHour] = useState(data.assignedDefaultHours);
  const [startDate, setStartDate] = useState(data.fromDate);
  // eslint-disable-next-line no-unused-vars
  const [endDate, setEndDate] = useState(data.toDate);
  const isDisable =
    data.status === "PENDING"
      ? true
      : data.status === "REJECTED"
      ? true
      : false;
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Updating", { id: "update" });
      const res = await updateEmployeeData(
        data.timeSheetId,
        startDate,
        endDate,
        workeHour,
        data.totalWorkedHours,
        data.overTimeWorkedHours,
        data.status
      );
      if (res) {
        toast.success("Updated Successfully", { id: "update" });
        fetchSelectedEmployeeData();
        setWorkHour("");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message, { id: "update" });
    }
  };
  return (
    <>
      <button
        disabled={isDisable}
        className={`rounded-lg  p-2 font-medium flex items-center gap-1 ${
          isDisable
            ? "text-gray-300 hover:text-gray-300"
            : "text-black hover:text-green-400"
        }`}
        onClick={() => setIsModalOpen(true)}
      >
        <span className="">
          <FaPencilAlt />
        </span>
      </button>

      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 "
            onClick={() => setIsModalOpen(false)}
          ></div>
          <dialog open className="modal fixed inset-0 z-50 ">
            <div className="modal-box relative flex flex-col gap-5 border-t-[10px] border-t-green-400">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <h1 className="text-2xl text-gray-800 font-semibold">
                Update Timesheet
              </h1>
              <form method="dialog" onSubmit={handleEdit}>
                <div className="w-full flex items-center justify-center flex-col gap-3">
                  <div className="w-full flex items-center gap-3">
                    <div className="w-full flex flex-col">
                      <label htmlFor="start-date">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        disabled
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="end-date">End Date</label>
                      <input
                        type="text"
                        disabled
                        value={endDate}
                        className="input input-bordered w-full max-w-xs"
                      />
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <label htmlFor="total-hours">Total Worked Hours</label>
                    <input
                      type="number"
                      value={workeHour}
                      onChange={(e) => setWorkHour(e.target.value)}
                      placeholder="Enter hours"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    className="p-3 w-full text-white rounded-lg bg-green-400"
                    // style={{ background: colors.primary }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};
