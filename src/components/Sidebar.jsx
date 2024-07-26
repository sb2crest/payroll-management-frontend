import { Link, useLocation } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { FaClipboard } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { useTheme } from "../context/theme-context";
import { useAuth } from "../context/auth-context";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen(!open);
  const { colors } = useTheme();
  const { role } = useAuth();

  const sidebarLinkItems = [
    {
      icon: RiDashboardFill,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: FaClipboard,
      text: "Work Sheet",
      path: "/worksheet",
    },

    {
      icon: IoPerson,
      text: "Profile",
      path: "/profile",
    },



  const sidebarLinkItemsForManger = [
    {
      icon: RiDashboardFill,
      text: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: IoPeopleSharp,
      text: "Add Consignee",
      path: "/add-consignee",
    },
    {
      icon: FaClipboard,
      text: "Time Sheet",
      path: "/timesheet",
    },
    {
      icon: IoIosNotifications,
      text: "Add Hours",
      path: "/add-hours",
    },
    {
      icon: MdOutlineAccessTimeFilled,
      text: "Update Hour",
      path: "/update-hours",
    },
    {
      icon: IoPerson,
      text: "Profile",
      path: "/profile",
    },

    {
      icon: IoIosSettings,
      text: "Settings",
      path: "/settings",
    },
  ];

  const sidebarItems =
    role === "Manager" ? sidebarLinkItemsForManger : sidebarLinkItems;

  return (
    <motion.div
      initial={{ width: "230px" }}
      animate={{ width: open ? "230px" : "85px" }}
      className="h-screen bg-white  relative"
    >
      <motion.div
        initial={{ width: "230px" }}
        animate={{ width: open ? "230px" : "85px" }}
        className="h-screen  fixed bg-white top-0 shadow-md left-0"
      >
        <div className="w-full relative">
          <motion.button
            initial={{ rotate: "180deg" }}
            animate={{
              rotate: open ? "180deg" : "0deg",
            }}
            transition={{ duration: 0.3 }}
            onClick={toggleSidebar}
            className="w-10 h-10 z-50 rounded-full absolute  top-4 -right-5   flex items-center text-white justify-center"
            style={{ background: colors.primary }}
          >
            <span>
              <IoIosArrowForward />
            </span>
          </motion.button>
          <div className="w-full p-5 px-8  ">
            <h1
              className={`text-2xl text-black font-bold ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              LOGO
            </h1>
          </div>
          <div className="mt-10 px-8">
            <p
              className={`${open ? "opacity-100" : "opacity-0"} text-sm`}
              style={{ color: colors.accent }}
            >
              overview
            </p>

            <div className="w-full flex flex-col mt-4">
              {sidebarItems.map((val) => (
                <SidebarLink
                  icon={val.icon}
                  path={val.path}
                  text={val.text}
                  key={val.text}
                  open={open}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;

const SidebarLink = ({ icon: Icon, path, text, open }) => {
  const { pathname } = useLocation();
  const active = pathname.includes(path);
  const { colors } = useTheme();
  return (
    <Link to={path} className="w-full">
      <motion.div
        className="w-full flex gap-3 items-center py-3"
        style={{
          color: active ? colors.primary : colors.secondary,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xl">
          <Icon />
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden whitespace-nowrap text-md font-semibold ${
            open ? "opacity-100 " : "opacity-0"
          } `}
        >
          {text}
        </motion.span>
      </motion.div>
    </Link>
  );
};
