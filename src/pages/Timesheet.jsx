import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "../context/theme-context";
import { motion } from "framer-motion";
import {
  handleApproved,
  handleReject as rejectTimesheet,
} from "../helpers/theme-api";
import { useAuth } from "../context/auth-context";

const fetchTimeSheetData = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=${id}`
    );
    console.log("Fetched Data:", res.data);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch data", error);
    throw new Error("Failed to fetch data");
  }
};

const Timesheet = () => {
  const { ID } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["timeSheetData", ID],
    queryFn: () => fetchTimeSheetData(ID),
  });

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  const { colors } = useTheme();

  const handleApprove = async (weeklySubmissionId) => {
    console.log(weeklySubmissionId);
    await handleApproved(weeklySubmissionId);
    refetch();
  };

  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [reason, setReason] = useState("");

  const handleOpen = async (weeklySubmissionId) => {
    setId(weeklySubmissionId);
    setOpen(true);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    await rejectTimesheet(id, reason);
    setReason("");
    setOpen(false);
    refetch();
  };

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("Data in useEffect:", data); // Debugging statement
      setFilteredData(
        data.filter((item) => {
          const employeeId = item.employeeUniqueId?.toLowerCase() || "";
          const firstName = item.firstName?.toLowerCase() || "";
          const lastName = item.lastName?.toLowerCase() || "";
          return (
            employeeId.includes(searchTerm.toLowerCase()) ||
            firstName.includes(searchTerm.toLowerCase()) ||
            lastName.includes(searchTerm.toLowerCase())
          );
        })
      );
    } else {
      console.error("Unexpected data format:", data);
      setFilteredData([]);
    }
  }, [searchTerm, data]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < Math.ceil(filteredData.length / pageSize)) {
      setCurrentPage(page);
    }
  };

  const pages = Math.ceil(filteredData.length / pageSize);
  const currentPageData = filteredData.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  return (
    <div className="m-6 ">
      {open && (
        <motion.div
          initial={{ display: "none" }}
          animate={{ display: open ? "flex" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="border-[1px] w-[500px] p-4 z-[999999] h-[300px] flex items-center flex-col gap-6 justify-center absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] bg-gray-100 rounded-lg shadow-md"
        >
          <form onSubmit={handleReject} className="w-full">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              type="text"
              placeholder="Reason for rejection"
              className="outline-none p-2 border-[1px] border-black w-full rounded-lg"
            />
            <div className="flex items-center gap-4 w-full mt-4">
              <button
                onClick={() => setOpen(false)}
                className="p-2 bg-gray-400 rounded-lg w-full"
              >
                cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-red-500 w-full rounded-lg text-white"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div>
      )}
      <div className="bg-white p-10 mt-6 rounded-lg shadow-md relative border-[1px]">
        {isLoading ? (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            Loading...
          </div>
        ) : error ? (
          <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            Error loading data
          </div>
        ) : (
          <>
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
                placeholder="Search by name or id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <table
              className="my-auto border-2 border-white bg-[#eee] w-full rounded-lg mt-5 overflow-hidden"
              style={{ background: colors.globalBackgroundColor }}
            >
              <thead className="border-b-2 border-b-white">
                <tr>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: colors.secondary }}
                  >
                    Employee Id
                  </th>
                  <th
                    className="border-2 border-white p-2 text-sm"
                    style={{ color: colors.secondary }}
                  >
                    Name
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
                    Payment Mode
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
                    Overtime Hours
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
                    Approval
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((item) => (
                  <tr
                    key={item.employeeUniqueId}
                    className="border-2 border-white"
                  >
                    <td className="border-2 border-white p-2 text-sm">
                      {item.employeeUniqueId}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {` ${item.firstName} ${item.lastName}`}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.startDate}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.endDate}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.paymentMode}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.assignedHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.overTimeWorkingHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm">
                      {item.totalWorkingHours}
                    </td>
                    <td className="border-2 border-white p-2 text-sm flex gap-2">
                      <button
                        className="p-1 bg-green-500 rounded-lg text-white text-xs"
                        onClick={() => handleApprove(item.weeklySubmissionId)}
                      >
                        Approve
                      </button>
                      <button
                        className="p-1 bg-red-500 rounded-lg text-white text-xs"
                        onClick={() => handleOpen(item.weeklySubmissionId)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <div>
                <label htmlFor="pageSize">Page Size:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="ml-2 border border-gray-300 rounded"
                >
                  {[2, 5, 10].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-1 bg-gray-200 rounded"
                >
                  Prev
                </button>
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-1 ${
                      currentPage === i
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    } rounded`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pages - 1}
                  className="p-1 bg-gray-200 rounded"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Timesheet;