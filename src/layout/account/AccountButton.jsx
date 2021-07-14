import { Avatar, IconButton } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import randomColor from "randomcolor";
import React, { Fragment, useEffect, useState } from "react";
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

function AccountButton() {
  const classes = useStyles();

  //
  const [user, setUser] = useState({});

  //
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuId = "primary-search-account-menu";

  //
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    request(
      "get",
      "/my-account/",
      (res) => {
        let data = res.data;

        setUser({
          name: data.name,
          userName: data.user,
          partyId: data.partyId,
        });
      },
      { 401: () => {} }
    );
  }, []);

  return (
    <Fragment>
      <IconButton
        disableRipple
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
      >
        <Avatar className={classes.avatar}>
          {user.name ? user.name.substring(0, 1).toLocaleUpperCase() : ""}
        </Avatar>
      </IconButton>
      <AccountMenu
        id={menuId}
        avatarBgColor={bgColor}
        anchorEl={anchorEl}
        name={user.name}
        userName={user.userName}
        partyId={user.partyId}
        handleClose={handleClose}
      />
    </Fragment>
  );
}

// AccountButton.whyDidYouRender = {
//   logOnDifferentValues: true,
// };

export default React.memo(AccountButton);
