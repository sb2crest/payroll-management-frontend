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
    `http://localhost:8080/api/payrollEmployee/findAllEmployeesByMangerUniqueID?managerUniqueId=MG6729941207`
  );
  console.log("data--" + response.data);
  return response.data;
};
export const getAllEmployeeData = async (employeeId) => {
  const response = await axios.get(
    `http://localhost:8080/api/payrollEmployee/find-employee?employeeUniqueId=${employeeId}`
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
    +assignedDefaultHours,
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
      totalWeeklyWorkedHours: totalWeeklyWorkedHours,
      totalOvertimeWorkedHours: totalOvertimeWorkedHours,
    }
  );
  console.log("data" + response.data);
  return response.data;
};
