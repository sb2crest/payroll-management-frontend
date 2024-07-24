import axios from "axios";

export const fetchTheme = async (companyId) => {
  try {
    const res = await axios.get(`/api/theme/${companyId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
