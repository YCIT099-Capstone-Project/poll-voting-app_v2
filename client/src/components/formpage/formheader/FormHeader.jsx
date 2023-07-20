import React, { useEffect, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FormsLogo } from "../../../assets/img";
import SearchIcon from "@mui/icons-material/Search";
import "./FormHeader.css";
import logo from "../../images/Pollite.jpeg";
import TestDrawer from "../TestDrawer";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../../redux/features/userSlice";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";

const FormHeader = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BACKEND}/notificationPoll/${user.id}`) // replace with actual API URL
      .then((response) => response.json())
      .then((data) => setNotifications(data));
  }, [user.id]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="header">
      <div className="header_left">
        <TestDrawer />
        <div className="logo_container">
          <img
            src={FormsLogo}
            alt="FormsLogo"
            style={{
              width: "40px",
              height: "40px",
            }}
            className="forms_logo"
          />
          <img
            src={logo}
            alt="logo"
            style={{
              width: "95px",
              height: "40px",
            }}
            className="forms_logo"
          />
        </div>
      </div>

      <div className="header_right">
        <IconButton onClick={handleNotificationClick}>
          <NotificationsActiveIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
        >
          {notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleNotificationClose}>
              {notification.title} is ending within a day
            </MenuItem>
          ))}
        </Menu>

        <IconButton>
          <p>{user.name}</p>
        </IconButton>
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default FormHeader;
