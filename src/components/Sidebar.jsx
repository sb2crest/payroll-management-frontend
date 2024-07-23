import { Link, useLocation } from "react-router-dom";
import { RiDashboardFill } from "react-icons/ri";
import { FaClipboard } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoPeopleSharp } from "react-icons/io5";

const sidebarLinkItems = [
  {
    icon: RiDashboardFill,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: FaClipboard,
    text: "Time Sheet",
    path: "/timesheet",
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
    text: "Inbox",
    path: "/inbox",
  },
  {
    icon: MdOutlineAccessTimeFilled,
    text: "Add Hour",
    path: "/add-hour",
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

const styles = {
  primaryColor: "#7b2cbf",
  secondaryColor: "#212529",
};

const manager = true;

function Sidebar() {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen(!open);

  return (
    <motion.div
      initial={{ width: "230px" }}
      animate={{ width: open ? "230px" : "85px" }}
      className="h-screen bg-white shadow-md relative"
    >
      <motion.button
        initial={{ rotate: "0deg" }}
        animate={{ rotate: open ? "0deg" : "-180deg" }}
        transition={{ duration: 0.3 }}
        onClick={toggleSidebar}
        className="w-10 h-10 z-50 rounded-full absolute -right-5 top-4  bg-red-300 flex items-center text-white justify-center"
        style={{ background: styles.primaryColor }}
      >
        <span>
          <IoIosArrowForward />
        </span>
      </motion.button>
      <div className="h-screen fixed top-0 left-0">
        <div className="w-full p-5 px-8  ">
          <h1
            className={`text-2xl text-black font-bold ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            Phoenix
          </h1>
        </div>
        <div className="mt-10 px-8">
          <p
            className={`${
              open ? "opacity-100" : "opacity-0"
            } text-sm text-gray-500`}
          >
            overview
          </p>

          <div className="w-full flex flex-col mt-4">
            {manager
              ? sidebarLinkItemsForManger.map((val) => (
                  <SidebarLink
                    icon={val.icon}
                    path={val.path}
                    text={val.text}
                    key={val.text}
                    open={open}
                  />
                ))
              : sidebarLinkItems.map((val) => (
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
  );
}

export default Sidebar;

const SidebarLink = ({ icon: Icon, path, text, open }) => {
  const { pathname } = useLocation();
  const active = pathname.includes(path);

  return (
    <Link to={path} className="w-full">
      <motion.div
        className="w-full flex gap-3 items-center py-3"
        style={{ color: active ? styles.primaryColor : styles.secondaryColor }}
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
