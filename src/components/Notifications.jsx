import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BiBell } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const { ID, role } = useAuth();

  const base_url = "http://localhost:8080/api/payrollManager";

  // eslint-disable-next-line no-unused-vars
  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${base_url}/getNotificationsByUniqueId?uniqueId=${ID}`
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

  const updateNotificationStatus = async ({ ID, message }) => {
    await axios.put(
      `${base_url}/readNotificationsByEmployee?uniqueId=${ID}&message=${encodeURIComponent(
        message
      )}`
    );
  };

  const { refetch } = useQuery({
    queryKey: ["notifications", ID],
    queryFn: () => fetchNotifications(ID),
    onError: (error) => {
      console.error("Error fetching notifications:", error);
    },
  });

  const mutation = useMutation({
    mutationFn: (notification) =>
      updateNotificationStatus({ ID, message: notification.message }),
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error updating notification status:", error);
    },
  });

  /* For notified data */
  const handleNotificationClick = (notification) => {
    try {
      mutation.mutate(notification);
      setIsOpen(false);
      if (role === "Manager") {
        navigate(`/timesheet`);
      } else if (role === "Employee") {
        navigate(`/worksheet`);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
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
