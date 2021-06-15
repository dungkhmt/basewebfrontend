import { Divider, Menu, MenuItem } from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../action";

export function AccountMenu(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handlePasswordChange = () => {
    props.handleMenuClose();
    history.push("/userlogin/change-password/" + props.userName);
  };

  const handleViewAccount = () => {
    props.handleMenuClose();
    history.push("/userlogin/" + props.partyId);
  };

  const handleLogout = () => dispatch(logout());

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
        Tên: {props.name} <br /> Tên người dùng: {props.userName}{" "}
      </MenuItem>
      <Divider />
      {/* <MenuItem onClick={props.handleClose}>Settings</MenuItem> */}
      <MenuItem onClick={handleViewAccount}>Tài khoản</MenuItem>

      <MenuItem onClick={handlePasswordChange}>Đổi mật khẩu</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
    </Menu>
  );
}
