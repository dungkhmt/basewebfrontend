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
  return (
    <Menu
      id="simple-menu"
      anchorEl={props.anchorEl}
      keepMounted
      open={Boolean(props.anchorEl)}
      onClose={props.handleClose}
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
