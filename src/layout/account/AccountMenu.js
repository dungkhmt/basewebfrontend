import {
  Avatar,
  Box,
  Divider,
  ListItemAvatar,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyRoundedIcon from "@material-ui/icons/VpnKeyRounded";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../action";

const StyledMenu = withStyles({
  paper: {
    minWidth: 240,
  },
})((props) => (
  <Menu
    elevation={8}
    getContentAnchorEl={null}
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    padding: "0px 8px",
    borderRadius: 6,
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
  divider: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  avatar: {
    // width: 60,
    // height: 60,
    marginRight: 12,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // fontSize: "1.875rem",
  },

  avatarIcon: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: grey[300],
    margin: "8px 12px 8px 0px",
  },
  text: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export function AccountMenu(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, handleClose, anchorEl, partyId, userName, name, avatarBgColor } =
    props;

  //
  const handlePasswordChange = () => {
    handleClose();
    history.push(`/userlogin/change-password/${userName}`);
  };

  const handleViewAccount = () => {
    handleClose();
    history.push(`/userlogin/${partyId}`);
  };

  const handleLogout = () => dispatch(logout());

  return (
    <div>
      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div style={{ padding: "0px 8px" }}>
          <Box display="flex" pl={1} pr={1} alignItems="center">
            <Avatar
              className={classes.avatar}
              style={{
                background: avatarBgColor,
              }}
            >
              {name ? name.substring(0, 1).toLocaleUpperCase() : ""}
            </Avatar>

            <Box display="flex" flexGrow={1} alignItems="center" flexShrink={1}>
              <Typography className={classes.text}>{name}</Typography>
            </Box>
          </Box>
        </div>

        <Divider className={classes.divider} />

        <div style={{ padding: "0px 8px" }}>
          <StyledMenuItem onClick={handleViewAccount}>
            <ListItemAvatar>
              <Avatar className={classes.avatarIcon}>
                <AccountCircleRoundedIcon
                  style={{ color: "black" }}
                  fontSize="medium"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Tài khoản"
              primaryTypographyProps={{ className: classes.text }}
            />
          </StyledMenuItem>
        </div>

        <div style={{ padding: "0px 8px" }}>
          <StyledMenuItem onClick={handlePasswordChange}>
            <ListItemAvatar>
              <Avatar className={classes.avatarIcon}>
                <VpnKeyRoundedIcon
                  style={{ color: "black" }}
                  fontSize="medium"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Đổi mật khẩu"
              primaryTypographyProps={{
                className: classes.text,
              }}
            />
          </StyledMenuItem>
        </div>

        <Divider className={classes.divider} />

        <div style={{ padding: "0px 8px" }}>
          <StyledMenuItem onClick={handleLogout}>
            <ListItemAvatar>
              <Avatar className={classes.avatarIcon}>
                <ExitToAppIcon style={{ color: "black" }} fontSize="medium" />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{ className: classes.text }}
            />
          </StyledMenuItem>
        </div>
      </StyledMenu>
    </div>
  );
}
