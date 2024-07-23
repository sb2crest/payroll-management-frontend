import { CiSearch } from "react-icons/ci";
import { CgMail } from "react-icons/cg";
import { IoNotifications } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { MdBrightness4 } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { useState } from "react";

const Navbar = () => {
  const [hasNewMail, setHasNewMail] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  const style = {
    colors: {
      primary: "#4D5664",
      secondary: "#C8C9CC",
    },
  };

  return (
    <div className="h-16 border-b flex items-center">
      <div className="px-10 flex flex-col">
        <span
          className="text-[20px] font-bold"
          style={{ color: style.colors.primary }}
        >
          Hi, Kavya Shree
        </span>
        <span
          className="text-[10px] font-normal mt-[0px]"
          style={{ color: style.colors.secondary }}
        >
          Have a productive work day!
        </span>
      </div>
      <div className="relative ml-20">
        <button className="absolute top-1/2 left-2 transform -translate-y-1/2  border-none cursor-pointer rounded-l-lg">
          <CiSearch style={{ color: style.colors.secondary }} />
        </button>
        <input
          type="text"
          className="rounded-md w-[400px] py-2 text-sm outline-none pl-10 pr-4 bg-gray-100"
          placeholder="Search"
        />
      </div>
      <div
        className="flex items-center ml-20"
        style={{ color: style.colors.primary }}
      >
        <div className="relative mr-6">
          <CgMail className="text-2xl cursor-pointer" />
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
      <div className="flex items-center ml-20">
        <CgProfile
          className="text-[32px] cursor-pointer"
          style={{ color: style.colors.primary }}
        />
        <p className="flex flex-col ml-2">
          <span
            className="text-[16px] font-medium"
            style={{ color: style.colors.primary }}
          >
            Kavya Shree
          </span>
          <span
            className="text-[10px] mt-[0px]"
            style={{ color: style.colors.secondary }}
          >
            Associate Developer
          </span>
        </p>
      </div>
    </div>
  );
};

export default Navbar;
