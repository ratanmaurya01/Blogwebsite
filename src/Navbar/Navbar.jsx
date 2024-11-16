import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

import { MdNightlight } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { Dropdown } from "@mui/base/Dropdown";
import { Menu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import { styled } from "@mui/system";
import { getAuth, signOut } from "firebase/auth";
import { confirmAlert } from "react-confirm-alert"; // Import react-confirm-alert module
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css file
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firestore configuration
import { collection } from "firebase/firestore"; // Import collection and onSnapshot
import NotificationDropdown from "../CommonUI/NotificationDropdown";

const Navbar = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext); // Consume context
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);
  const storedUserData = localStorage.getItem("user");
  const userData = JSON.parse(storedUserData);
  // Fallback to default icon URL if userData.photoUrl is not found
  const profileImageUrl =
    userData?.photoUrl ||
    "https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000";

  const auth = localStorage.getItem("isLoggIn");
  const handleCloseNavbar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Reference to the notifications collection
    const notificationRef = collection(db, "notifications");
    // Subscribe to real-time updates on the notifications collection
    const unsubscribe = onSnapshot(notificationRef, (snapshot) => {
      setNotificationCount(snapshot.size); // Use snapshot.size to get the number of documents
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("isLoggIn");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleOpenProfile = () => {
    navigate("/Profile");
  };
  const handleClicOnDashboard = () => {
    navigate("/Dashboard");
  };

  const handleOpenCreatePost = () => {
    navigate("/PostForm");
  };

  
  const handleGameSite = () => {
    navigate("/Game");
  };

  const showConfirmationDialog = () => {
    confirmAlert({
      title: "Confirm to LogOut",
      message: "Are you sure you want to Logout ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            handleLogout();
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const Listbox = styled("ul")(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    box-shadow: 0px 4px 6px ${
      theme.palette.mode === "dark" ? "rgba(0,0,0, 0.50)" : "rgba(0,0,0, 0.05)"
    };
    z-index: 1;
    `
  );

  const MenuItem = styled(BaseMenuItem)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &:focus {
      outline: 3px solid ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
      background-color: ${
        theme.palette.mode === "dark" ? grey[800] : grey[100]
      };
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
    }
    `
  );

  const blue = {
    50: "#F0F7FF",
    100: "#C2E0FF",
    200: "#99CCF3",
    300: "#66B2FF",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E6",
    700: "#0059B3",
    800: "#004C99",
    900: "#003A75",
  };

  const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
  };

  const MenuButton = styled(BaseMenuButton)(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 1px 1px;
    border-radius: 80px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }
  
    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${
        theme.palette.mode === "dark" ? blue[300] : blue[200]
      };
      outline: none;
    }
    `
  );

  return (
    <>
      <nav
        className={`p-2 fixed top-0 left-0 w-full z-10 transition-all duration-300 ${
          isDarkTheme ? "bg-black text-white" : "bg-white text-black shadow-md"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Brand logo */}
          <div className="text-lg font-bold">
            <NavLink
              to="/"
              className="block px-2 py-1"
              onClick={handleCloseNavbar}
            >
              Brand
            </NavLink>
          </div>
          <div className="flex items-center">
            <ul className="flex items-center space-x-1 sm:space-x-1">
              <li className="navlink-item flex items-center relative">
            <NotificationDropdown/> 
              
              </li>

              <li className="navlink-item">
                <NavLink
                  to="/"
                  className="block px-2 py-1"
                  onClick={handleCloseNavbar}
                >
                  Post
                </NavLink>
              </li>
              <li className="navlink-item">
                <NavLink to="#" className="block px-2 py-1">
                  About
                </NavLink>
              </li>
              {auth === "true" ? (
                <li className="navlink-item">
                  <Dropdown>
                    <MenuButton className="w-full sm:w-auto shadow-2xl">
                      <img
                        className="shadow-2xl"
                        src={profileImageUrl} // Add the URL of the profile image here
                        alt="Profile"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                    </MenuButton>
                    <Menu slots={{ listbox: Listbox }}>
                      <MenuItem onClick={handleOpenProfile}>Profile</MenuItem>
                      <MenuItem onClick={handleOpenCreatePost}>
                        Create Post
                      </MenuItem>
                      <MenuItem onClick={handleClicOnDashboard}>
                        Dashboard
                      </MenuItem>

                      <MenuItem onClick={handleGameSite}>
                        Game Site
                      </MenuItem>

                      <MenuItem onClick={showConfirmationDialog}>
                        Log out
                      </MenuItem>


                      
                    </Menu>
                  </Dropdown>
                </li>
              ) : (
                <li className="navlink-item">
                  <NavLink
                    to="/login"
                    className="block px-2 py-1 cursor-pointer"
                    onClick={handleCloseNavbar}
                  >
                    Login
                  </NavLink>
                </li>
              )}

              <li className="navlink-item">
                <button onClick={toggleTheme} className="px-2 py-1">
                  {isDarkTheme ? (
                    <span className="text-xl">
                      <MdNightlight />
                    </span>
                  ) : (
                    <span className="text-xl">
                      <FaRegLightbulb />
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
