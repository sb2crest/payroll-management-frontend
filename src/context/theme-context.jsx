import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [colors, setColors] = useState({});
  const [fontFamily, setFontFamily] = useState("");
  const [company, setCompany] = useState({});

  useEffect(() => {
    const storedColors = localStorage.getItem("colors");
    const storedFontFamily = localStorage.getItem("fontFamily");
    const storedCompany = localStorage.getItem("company");

    if (storedColors) {
      setColors(JSON.parse(storedColors));
    }
    if (storedFontFamily) {
      setFontFamily(storedFontFamily);
    }
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  const fetchCompanyThemeData = async (companyID) => {
    try {
      const res = await axios.get(
        `https://payroll.seabed2crest.com/api/organization/getThemeData?companyId=${companyID}`
      );
      const data = res.data;

      if (data) {
        const themeColor = data.colors[0];
        const font = data.font[0];
        const companyData = data.company[0];

        const newColors = {
          primary: themeColor.primary,
          secondary: themeColor.secondary,
          accent: themeColor.accent,
          globalBackgroundColor: themeColor.globalBackground,
          componentBackgroundColor: themeColor.componentBackgroundColor,
        };

        setColors(newColors);
        setFontFamily(font.font);
        setCompany({ logoURL: companyData.logoURL, name: companyData.name });
      }
    } catch (error) {
      console.error("Error fetching company theme data:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(colors).length > 0) {
      localStorage.setItem("colors", JSON.stringify(colors));
    }
  }, [colors]);

  useEffect(() => {
    if (fontFamily) {
      localStorage.setItem("fontFamily", fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (company && Object.keys(company).length > 0) {
      localStorage.setItem("company", JSON.stringify(company));
    }
  }, [company]);

  const [isManager, setIsManagerStatus] = useState(true);

  useEffect(() => {
    const storedIsManager = localStorage.getItem("isManager");
    if (storedIsManager) {
      setIsManagerStatus(storedIsManager === "true");
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        fetchCompanyThemeData,
        fontFamily,
        company,
        isManager,
        setIsManagerStatus,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;
