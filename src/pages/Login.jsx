import { useTheme } from "../context/theme-context";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
function Login() {
  const [ID, setID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { companyID } = useParams();
  const { colors, fetchCompanyThemeData, setIsManagerStatus } = useTheme();

  const { authenticateRole, role } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await authenticateRole(ID, password);
    console.log(res);
    if (res) {
      if (res.role === "Employee") {
        navigate("/dashboard");
      } else if (res.role === "Manager") {
        setIsManagerStatus(true);
        navigate("/dashboard");
      }
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
                  Company ID
                </label>
                <input
                  type="text"
                  name="login"
                  id="companyId"
                  className="bg-white-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-none
                   focus:border-[#C8C9CC] block w-full p-2.5"
                  required=""
                  value={ID}
                  onChange={(e) => setID(e.target.value)}
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
