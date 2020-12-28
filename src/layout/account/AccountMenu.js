import { Divider, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

export function AccountMenu(props) {
  const history = useHistory();
  const handlePasswordChange = () => {
    props.handleClose();
    history.push("/userlogin/change-password/" + props.userName);
  };
  const handleViewAccount = () => {
    props.handleClose();
    history.push("/userlogin/" + props.partyId);
  };

  const isMenuOpen = Boolean(props.anchorEl);

  return (
    <Menu
      anchorEl={props.anchorEl}
      id={props.id}
      keepMounted
      open={isMenuOpen}
      onClose={props.handleMenuClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <MenuItem>
        Name: {props.name} <br /> UserName: {props.userName}{" "}
      </MenuItem>
      <Divider />
      <MenuItem onClick={props.handleClose}>Settings</MenuItem>
      <MenuItem onClick={handleViewAccount}>My account</MenuItem>

      <MenuItem onClick={handlePasswordChange}>Change Password</MenuItem>
      <Divider />
      <MenuItem onClick={props.handleLogout}>Logout</MenuItem>
    </Menu>
  );
}
