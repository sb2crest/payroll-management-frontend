import { CiSearch } from "react-icons/ci";
import { CgMail } from "react-icons/cg";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdBrightness4 } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context/theme-context";

const Navbar = () => {
  const { colors } = useTheme();
  const [hasNewMail, setHasNewMail] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  return (
    <div className="h-16 w-full border-b flex items-center justify-between px-8 bg-white">
      <div>
        <p
          className="text-[16px] font-bold"
          style={{ color: colors.secondary }}
        >
          Hi, Kavya Shree
        </p>
        <p
          className="text-[10px] font-normal mt-[0px]"
          style={{ color: colors.accent }}
        >
          Have a productive work day!
        </p>
      </div>
      <div className="relative ml-20 max-w-[300px] w-full">
        <button className="absolute top-1/2 left-2 transform -translate-y-1/2 border-none cursor-pointer rounded-l-lg">
          <CiSearch style={{ color: colors.accent }} />
        </button>
        <input
          type="text"
          className="rounded-md py-2 text-sm outline-none pl-10 pr-4 bg-gray-100 w-full"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center gap-5">
        <div
          className="flex items-center ml-20"
          style={{ color: colors.secondary }}
        >
          <div className="relative mr-6">
            <CgMail className="text-2xl" />
            {hasNewMail && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            )}
          </div>
          <div className="relative mr-6">
            <IoNotifications className="text-2xl cursor-pointer" />
            {hasNewNotification && (
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            )}
          </div>
          <MdBrightness4 className="text-2xl cursor-pointer mr-6" />
          <IoIosSettings className="text-2xl cursor-pointer mr-6" />
        </div>
        <PersonCard />
      </div>
    </div>
  );
};

export default Navbar;

const PersonCard = () => {
  const [open, setOpen] = useState(false);
  const handleLogOut = () => {
    setOpen(false);
  };
  const { colors } = useTheme();

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/5 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <div>
        <motion.div
          className="absolute top-10 right-0 w-[250px] shadow-md bg-white z-50 rounded-lg p-4 flex flex-col gap-2"
          initial={{ opacity: 0, y: "20px", display: "none" }}
          animate={{
            opacity: open ? 1 : 0,
            y: open ? "0" : "20px",
            display: open ? "flex" : "none",
          }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            style={{ color: colors.secondary }}
          >
            Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            style={{ color: colors.secondary }}
          >
            Settings
          </Link>
          <button
            onClick={handleLogOut}
            style={{ background: colors.primary }}
            className="w-full py-2 px-10 rounded-md text-white"
          >
            Logout
          </button>
        </motion.div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <CgProfile
            className="text-[32px] cursor-pointer"
            style={{ color: colors.secondary }}
          />
          <div className="ml-2">
            <p
              className="text-[16px] font-medium"
              style={{ color: colors.secondary }}
            >
              Kavya Shree
            </p>
            <p
              className="text-[10px] mt-[0px]"
              style={{ color: colors.accent }}
            >
              Manager
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
