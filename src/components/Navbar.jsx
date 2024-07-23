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
    <div className="h-16 w-full border-b flex items-center justify-between px-8 bg-white">
      <div>
        <p
          className="text-[16px] font-bold"
          style={{ color: style.colors.primary }}
        >
          Hi, Kavya Shree
        </p>
        <p
          className="text-[10px] font-normal mt-[0px]"
          style={{ color: style.colors.secondary }}
        >
          Have a productive work day!
        </p>
      </div>
      <div className="relative ml-20 max-w-[300px] w-full">
        <button className="absolute top-1/2 left-2 transform -translate-y-1/2  border-none cursor-pointer rounded-l-lg">
          <CiSearch style={{ color: style.colors.secondary }} />
        </button>
        <input
          type="text"
          className="rounded-md  py-2 text-sm outline-none pl-10 pr-4 bg-gray-100  w-full"
          placeholder="Search"
        />
      </div>
      <div className="flex items-center gap-5">
        {" "}
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
        <div className="flex items-center">
          <CgProfile
            className="text-[32px] cursor-pointer"
            style={{ color: style.colors.primary }}
          />
          <p className=" ml-2">
            <p
              className="text-[16px] font-medium"
              style={{ color: style.colors.primary }}
            >
              Kavya Shree
            </p>
            <p
              className="text-[10px] mt-[0px]"
              style={{ color: style.colors.secondary }}
            >
              Associate Developer
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
