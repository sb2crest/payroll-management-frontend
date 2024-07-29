import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [ID, setID] = useState("");
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticateRole = async (ID, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/data-details/login",
        {
          uniqueId: ID,
          password: password,
        }
      );
      console.log("Response for authenticating the role:", response);
      const data = response.data;
    
      if (data) {
        setRole(data.role);
        setID(data.id);
        setName(data.fullName);
        setIsAuthenticated(true);
      }
      return data;
    } catch (e) {
      console.log("Error authenticating role:", e);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (ID) {
      localStorage.setItem("ID:", ID);
    }
  }, [ID]);
  useEffect(() => {
    if (role) {
      localStorage.setItem("Role:", role);
    }
  }, [role]);
  useEffect(() => {
    if (name) {
      localStorage.setItem("Name:", name);
    }
  }, [name]);

  return (
    <AuthContext.Provider
      value={{
        role,
        ID,
        name,
        authenticateRole,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
