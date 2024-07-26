import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiBell } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const uniqueId = "MG9FE9B7F20B";
  const base_url = "http://localhost:8080/api/payrollManager";

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${base_url}/getNotificationsByUniqueId?uniqueId=${uniqueId}`
        );
        const unreadNotifications = response.data.filter(
          (notification) => !notification.read
        );
        setNotifications(unreadNotifications);
        setUnreadCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [uniqueId]);

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `${base_url}/readNotificationsByEmployee?uniqueId=${uniqueId}&message=${encodeURIComponent(
          notification.message
        )}`
      );
      const updatedNotifications = notifications.filter(
        (n) => n.message !== notification.message
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.length);

      setIsOpen(false);
      navigate(`/timesheet/${notification.notificationId}`);
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative mt-1">
      <span className="text-xl cursor-pointer" onClick={toggleDropdown}>
        <BiBell />
      </span>
      {unreadCount > 0 && (
        <span className="absolute -top-3 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
          {unreadCount}
        </span>
      )}
      <AnimatePresence>
        {isOpen && notifications.length > 0 ? (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-7 right-2 bg-white border p-2 rounded-lg shadow-md w-64 max-h-80 z-10 overflow-y-auto"
          >
            {notifications.map((notification) => (
              <div
                key={notification.message}
                className={`p-2 border-b border-gray-200 cursor-pointer text-xs leading-6 ${
                  !notification.read ? "bg-white" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.message}
              </div>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Notifications;
