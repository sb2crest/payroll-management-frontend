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
  ID,
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
    managerUniqueId: ID,
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
    return response.data;
  } catch (error) {
    console.error("Error in saving data: " + error);
  }
};

export const getEmployeeData = async (employeeId) => {
  const response = await axios.get(
    `http://localhost:8080/api/payrollEmployee/findEmployeeByEmployeeId?employeeUniqueId=${employeeId}`
  );

  return response.data;
};

export const getAllEmployees = async (id) => {
  console.log("manager id:", id);
  try {
    const res = await axios.get(
      `http://localhost:8080/api/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=${id}`
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

export const handleReject = async (submissions) => {
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/report-approval`,
    submissions
  );

  return response.data;
};

export const handleApproved = async (submissions) => {
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/report-approval`,
    submissions
  );

  return response.data;
};

export const updateEmployeeData = async (
  weeklySubmissionId,
  startDate,
  endDate,
  assignedDefaultHours,
  totalWeeklyWorkedHours,
  totalOvertimeWorkedHours,
  reportStatus
) => {
  const response = await axios.put(
    `http://localhost:8080/api/payrollManager/editWeeklyReportWithReportId`,
    {
      weeklySubmissionId,
      startDate,
      endDate,
      assignedDefaultHours,
      totalWeeklyWorkedHours,
      totalOvertimeWorkedHours,
      reportStatus,
    }
  );

  return response.data;
};

export const createTimeSheetData = async (
  firstName,
  lastName,
  startDate,
  endDate,
  defaultWorkingHours,
  ID
) => {
  console.log("comming here two");
  const response = await axios.post(
    `http://localhost:8080/api/payrollManager/weekly-report`,
    {
      managerUniqueId: ID,
      firstName: firstName,
      lastName: lastName,
      startDate: startDate,
      endDate: endDate,
      defaultWorkingHours: defaultWorkingHours,
    }
  );

  return response.data;
};

export const deleteTimeSheet = async (timeSheetId) => {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/payrollManager/deleteWeeklyReport/${timeSheetId}`
    );
    return response.data;
  } catch (error) {
    error;
  }
};
