import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [colors, setColors] = useState({});
  const [fontFamily, setFontFamily] = useState();
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
        `http://localhost:8080/api/organization/getThemeData?companyId=${companyID}`
      );
      const data = res.data;

      if (data) {
        const themeColor = data.colors[0];
        const font = data.font[0];
        const company = data.company[0];

        setColors({
          primary: themeColor.primary,
          secondary: themeColor.secondary,
          accent: themeColor.accent,
          globalBackgroundColor: themeColor.globalBackground,
          componentBackgroundColor: themeColor.componentBackgroundColor,
        });
        setFontFamily(font.font);
        setCompany({ logoURL: company.logoURL, name: company.name });

        localStorage.setItem("colors", JSON.stringify(colors));
        localStorage.setItem("fontFamily", fontFamily);
        localStorage.setItem("company", JSON.stringify(company));
      }
      console.log(colors);
    } catch (error) {
      console.error("Error fetching company theme data:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ colors, fetchCompanyThemeData, fontFamily, company }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;
