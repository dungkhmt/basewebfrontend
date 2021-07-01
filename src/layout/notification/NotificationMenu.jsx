import { Avatar, List, Typography } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Notification from "./Notification";

const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: "hidden",
    maxHeight: `calc(100vh - 80px)`,
    width: 360,
    borderRadius: 8,
    boxShadow:
      "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  },
  notification: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  avatar: {
    width: 56,
    height: 56,
  },
}));

export default function NotificationMenu({
  open,
  setOpen,
  notifications,
  anchorRef,
}) {
  const classes = useStyles();

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom",
          }}
        >
          <Paper elevation={0} className={classes.paper}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
                style={{ padding: 0 }}
              >
                <SimpleBar
                  style={{
                    width: 360,
                    maxHeight: `calc(100vh - 80px)`,
                    overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu'scrollbar reach end
                  }}
                >
                  <div
                    style={{ margin: "20px 16px 12px", position: "relative" }}
                  >
                    <Typography
                      component="h1"
                      variant="h5"
                      className={classes.notification}
                      style={{ marginTop: "-7px", marginBottom: "-7px" }}
                    >
                      Thông báo
                    </Typography>
                  </div>

                  <List disablePadding aria-label="notifications list">
                    {notifications.map((notification) => (
                      <Notification
                        key={notification.id}
                        url={notification.url}
                        content={notification.content}
                        time={notification.time}
                        read={notification.read}
                        onClick={handleClose}
                        avatar={
                          <Avatar
                            alt="notification"
                            className={classes.avatar}
                            style={{
                              backgroundColor: notification.avatarColor,
                            }}
                          >
                            {notification.avatar
                              ? notification.avatar
                                  .substring(0, 2)
                                  .toLocaleUpperCase()
                              : "N"}
                          </Avatar>
                        }
                      />
                    ))}
                  </List>
                </SimpleBar>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
