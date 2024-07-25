import { useTheme } from "../context/theme-context";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { companyID } = useParams();
  const { colors, fetchCompanyThemeData } = useTheme();

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
                <label className="block mb-2 text-sm font-normal text-gray-900 dark:text-white">
                  Email ID
                </label>
                <input
                  type="email"
                  name="login"
                  id="email"
                  className="bg-white-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-none
                   focus:border-[#C8C9CC] block w-full p-2.5"
                  required=""
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-normal text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="bg-white-50 border border-gray-300 text-gray-900 sm:text-sm rounded-sm focus:outline-none
                   focus:border-[#C8C9CC] block w-full p-2.5"
                  required=""
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href=""
                  className="text-sm font-medium text-[#4D5664] underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                style={{ background: colors.primary }}
                type="submit"
                className="text-white font-medium  py-1.5 px-4 rounded-sm  w-full"
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
