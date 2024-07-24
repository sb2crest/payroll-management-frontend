import { createContext, useContext, useState } from "react";

const initialThemeData = {
  colors: {
    primary: "#AB85C0",
    secondary: "#4D5664",
    accent: "#C8C9CC",
    globalBackgroundColor: "#F5F5F5",
    componentBackgroundColor: "#FFFFFF",
  },
  font: {
    font: "Source Sans 3, sans-serif",
  },
  company: {
    logoURL: "https:/logoURL/com",
    name: "Company Name",
  },
};

const ThemeContext = createContext(initialThemeData);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(initialThemeData);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeContext;
