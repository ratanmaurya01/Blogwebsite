import React, { useContext } from "react";
import { IoNotificationsCircle } from "react-icons/io5";
import { usePosts } from "../context/PostContext";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "@mui/material/Skeleton";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const NotificationDropdown = () => {
  const { notifications, loading, setNotifications } = usePosts(); // Fetch notifications from PostContext
  const { isDarkTheme } = useContext(ThemeContext); // Access ThemeContext
  const navigate = useNavigate(); // Initialize navigate

  const handleNotificationClick = async (postId, notificationId) => {
    // Mark notification as read in Firestore
    const notificationRef = doc(db, "notifications", notificationId); // Replace with your Firestore structure
    await updateDoc(notificationRef, { read: true });

    // Update local state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );

    // Navigate to the post
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="relative">
      <Dropdown>
        <BaseMenuButton>
          <div className="text-3xl mx-2 relative cursor-pointer">
            <IoNotificationsCircle />
            {notifications.some((notification) => !notification.read) && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {
                  notifications.filter((notification) => !notification.read)
                    .length
                }
              </span>
            )}
          </div>
        </BaseMenuButton>
        <Menu
          className={`absolute right-0 mt-2 w-64 shadow-lg rounded-lg overflow-hidden z-20 lg:right-0 lg:w-64 sm:w-full sm:left-2/4 sm:transform sm:-translate-x-1/2 sm:mt-4 
          ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        >
          {loading ? (
            <BaseMenuItem className="px-4 py-2">
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                className={isDarkTheme ? "bg-gray-700" : "bg-gray-200"}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                className={isDarkTheme ? "bg-gray-700" : "bg-gray-200"}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={30}
                className={isDarkTheme ? "bg-gray-700" : "bg-gray-200"}
              />
            </BaseMenuItem>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              !notification.read && ( // Only show unread notifications
                <BaseMenuItem
                  key={notification.id} // Ensure a unique key
                  className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${menuItemClasses.root} ${isDarkTheme ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                  onClick={() => handleNotificationClick(notification.postId, notification.id)} // Add click handler
                >
                  <strong>{notification.title}</strong>
                </BaseMenuItem>
              )
            ))
          ) : (
            <BaseMenuItem className="px-4 py-2">No notifications</BaseMenuItem>
          )}
        </Menu>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
