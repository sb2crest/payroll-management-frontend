import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [submittedTimestamp, setSubmittedTimestamp] = useState(null);

  const authenticateRole = async (ID, password) => {
    try {
      const response = await axios.post(
        "https://parroll.seabed2crest.com/api/data-details/login",
        { uniqueId: ID, password: password }
      );
      console.log("Response for authenticating the role:", response);
      const data = response.data;

      if (data) {
        setRole(data.role);
        setID(data.id);
        setName(data.fullName);
        setIsAuthenticated(true);
        localStorage.setItem("ID", data.id);
        localStorage.setItem("Role", data.role);
        localStorage.setItem("Name", data.fullName);
      }
      return data;
    } catch (e) {
      console.log("Error authenticating role:", e);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedID = localStorage.getItem("ID");
      const storedRole = localStorage.getItem("Role");
      const storedName = localStorage.getItem("Name");

      if (storedID && storedRole && storedName) {
        try {
          // Validate stored credentials with the server
          const response = await axios.post(
            "https://payroll.seabed2crest.com/api/data-details/validate",
            { uniqueId: storedID }
          );

          if (response.data.valid) {
            setID(storedID);
            setRole(storedRole);
            setName(storedName);
            setIsAuthenticated(true);
          } else {
            // Handle invalid stored data
            localStorage.removeItem("ID");
            localStorage.removeItem("Role");
            localStorage.removeItem("Name");
            setIsAuthenticated(false);
          }
        } catch (e) {
          console.log("Error validating stored data:", e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        ID,
        name,
        authenticateRole,
        isAuthenticated,
        submittedTimestamp,
        setSubmittedTimestamp,
        loading,
      }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
