import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authGet, request } from "../../api";
import { AccountMenu } from "./AccountMenu";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory } from "react-router";
import { Fragment } from "react";
import randomColor from "randomcolor";

const bgColor = randomColor({
  luminosity: "light",
  hue: "random",
});

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 36,
    height: 36,
    background: bgColor,
  },
}));

export default function AccountButton(props) {
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  //
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [partyId, setPartyId] = useState("");

  //
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuId = "primary-search-account-menu";

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    request(token, history, "get", "/my-account/", (res) => {
      if (res !== undefined && res !== null) {
        setName(res.data.name);
        setUserName(res.data.user);
        setPartyId(res.data.partyId);
      }
    });
  }, []);

  return (
    <Fragment>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
      >
        <Avatar className={classes.avatar}>{name !== "" ? name[0] : ""}</Avatar>
      </IconButton>
      <AccountMenu
        anchorEl={anchorEl}
        id={menuId}
        handleMenuClose={handleMenuClose}
        name={name}
        userName={userName}
        partyId={partyId}
        handleLogout={props.handleLogout}
      />
    </Fragment>
  );
}
