import axios from "axios";

export const fetchTheme = async (companyId) => {
  try {
    const res = await axios.get(`/api/theme/${companyId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addConsigneeData = async (
  firstName,
  lastName,
  designation,
  paymentMode,
  dateOfJoining,
  workingDays,
  workingHours,
  paymentDate
) => {
  const requestBody = {
    firstName: firstName,
    lastName: lastName,
    designation: designation,
    paymentMode: paymentMode,
    dateOfJoining: dateOfJoining,
    workingDays: workingDays,
    workingHours: workingHours,
    paymentDate: paymentDate,
  };
  console.log("Request Body:", requestBody);
  try {
    const response = await axios.post("/data-details/addData", requestBody);
    console.log(response.data);
  } catch (error) {
    console.error("Error in saving data: " + error);
  }
};

export const getAllEmployees = async () => {
  const response = await axios.get(
    `http://localhost:8080/api/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=MG9FE9B7F20B`
  );
  console.log("data--" + response.data);
  return response.data;
};
export const getAllEmployeeData = async (employeeId) => {
  const response = await axios.get(
    `http://localhost:8080/api/payrollEmployee/findEmployeeByEmployeeId?employeeUniqueId=${employeeId}`
  );
  console.log("data" + response.data);
  return response.data;
};
export const handleReject = async (id, reason) => {
  // console.log(weeklySubmissionId);
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/report-approval`,
    {
      weeklySubmissionId: id,
      message: reason,
      reportStatus: "REJECTED",
    }
  );
  console.log("data" + response.data);
  return response.data;
};
export const handleApproved = async (weeklySubmissionId) => {
  console.log(weeklySubmissionId);
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/report-approval`,
    {
      weeklySubmissionId: weeklySubmissionId,
      message: "Report Approvedddd",
      reportStatus: "APPROVED",
    }
  );
  console.log("data" + response.data);
  return response.data;
};

export const updateEmployeeData = async (
  weeklySubmissionId,
  startDate,
  endDate,
  assignedDefaultHours,
  totalWeeklyWorkedHours,
  totalOvertimeWorkedHours
) => {
  console.log(
    weeklySubmissionId,
    startDate,
    endDate,
    assignedDefaultHours,
    totalWeeklyWorkedHours,
    totalOvertimeWorkedHours
  );
  const response = await axios.put(
    `http://localhost:8080/api/payrollManager/updateWeeklyWorkedHours`,
    {
      weeklySubmissionId: weeklySubmissionId,
      startDate: startDate,
      endDate: endDate,
      assignedDefaultHours: assignedDefaultHours,
      totalWeeklyWorkedHours: assignedDefaultHours + totalOvertimeWorkedHours,
      totalOvertimeWorkedHours: totalOvertimeWorkedHours,
    }
  );
  console.log("data" + response.data);
  return response.data;
};
export const createHours = async (
  firstName,
  lastName,
  startDate,
  endDate,
  defaultWorkingHours
) => {
  console.log("comming");
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/weekly-report`,
    {
      managerUniqueId: "MG9FE9B7F20B",
      firstName: firstName,
      lastName: lastName,
      startDate: startDate,
      endDate: endDate,
      defaultWorkingHours: defaultWorkingHours,
    }
  );
  console.log("data" + response.data);
  return response.data;
};
