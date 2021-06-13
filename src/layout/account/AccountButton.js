import { Avatar, IconButton } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import randomColor from "randomcolor";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { request } from "../../api";
import { AccountMenu } from "./AccountMenu";

const bgColor = randomColor({
  luminosity: "dark",
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
    request(
      // token, history,
      "get",
      "/my-account/",
      (res) => {
        let data = res.data;

        setName(data.name);
        setUserName(data.user);
        setPartyId(data.partyId);
      }
    );
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
        <Avatar className={classes.avatar}>
          {name !== "" ? name.substring(0, 1).toLocaleUpperCase() : ""}
        </Avatar>
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
