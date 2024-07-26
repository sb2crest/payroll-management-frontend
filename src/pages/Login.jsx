import { useTheme } from "../context/theme-context";
import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { companyID } = useParams();
  const { colors, fetchCompanyThemeData, setIsManagerStatus } = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "employee@gmail.com" && password === "1234567890") {
      console.log("I am an employee");
      setIsManagerStatus(false);
      localStorage.setItem("isManager", "false");
      navigate("/dashboard");
    } else if (email === "manager@gmail.com" && password === "0987654321") {
      console.log("I am an manager");
      setIsManagerStatus(true);
      localStorage.setItem("isManager", "true");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  useLayoutEffect(() => {
    fetchCompanyThemeData(companyID);
  }, [companyID]);

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-sm shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              LOGO
            </h1>
            <form className="space-y-4 md:space-y-6">
              <div>
                <label
                  className="block mb-2 text-sm font-medium dark:text-white"
                  style={{ color: colors.secondary }}
                >
                  Email ID
                </label>
                <input
                  type="email"
                  name="login"
                  id="email"
                  className="bg-white-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-none
                   focus:border-[#C8C9CC] block w-full p-2.5"
                  required=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium  dark:text-white"
                  style={{ color: colors.secondary }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-white-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-none
                   focus:border-[#C8C9CC] block w-full p-2.5"
                  required=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href=""
                  className="text-sm font-medium underline"
                  style={{ color: colors.secondary }}
                >
                  Forgot Password?
                </a>
              </div>
              <button
                style={{ background: colors.primary }}
                type="submit"
                className="text-white font-medium  py-1.5 px-4 rounded-sm  w-full"
                onClick={handleSubmit}
              >
                LOGIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
