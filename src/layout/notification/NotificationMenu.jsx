import { Box, List, Typography } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useLocation } from "react-router";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import { ReactComponent as EmptyNotificationIcon } from "../../assets/icons/undraw_happy_announcement_ac67.svg";
import Notification from "./Notification";
import NotificationTitle from "./NotificationTitle";

export const notificationMenuWidth = 360;
const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: "hidden",
    maxHeight: `calc(100vh - 80px)`,
    width: notificationMenuWidth,
    borderRadius: 8,
    boxShadow:
      "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  },
  notification: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  notificationsLoadingList: {
    "& div:first-of-type": {
      "& div": {
        paddingTop: 0,
      },
    },
  },
}));

const NotificationsLoading = React.memo(({ quantity }) => {
  const notifications = [];

  for (let i = 0; i < quantity; i++) {
    notifications.push(<Notification key={i} />);
  }

  return notifications;
});

export default function NotificationMenu({ open, notifications, anchorRef }) {
  const classes = useStyles();
  const { pathname } = useLocation();

  // Use useCallback to prevent Notification rerender because callback is recreated.
  const handleClose = React.useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    open.set(false);
  }, []);

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      open.set(false);
    }
  }

  return (
    <Popper
      open={open.get()}
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
                autoFocusItem={open.get()}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
                style={{ padding: 0 }}
              >
                {notifications ? (
                  <SimpleBar
                    style={{
                      width: notificationMenuWidth,
                      maxHeight: `calc(100vh - 80px)`,
                      overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu'scrollbar reach end
                    }}
                  >
                    <NotificationTitle />
                    {notifications.length > 0 ? (
                      <List disablePadding aria-label="notifications list">
                        {notifications.map((notification) => (
                          <Notification
                            key={notification.id.get()}
                            notification={notification}
                            currentURL={pathname}
                            handleClose={handleClose}
                          />
                        ))}
                      </List>
                    ) : (
                      // Empty notification.
                      <Box
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        pl={4}
                        pr={4}
                        pb={3}
                      >
                        <EmptyNotificationIcon width={225} height={200} />
                        <Typography style={{ textAlign: "center" }}>
                          Đừng bỏ lỡ những thông tin quan trọng. Khi có thông
                          báo mới, chúng sẽ hiển thị tại đây
                        </Typography>
                      </Box>
                    )}
                  </SimpleBar>
                ) : (
                  // Notifications loading.
                  <div>
                    <NotificationTitle />
                    <List
                      disablePadding
                      aria-label="notifications list"
                      className={classes.notificationsLoadingList}
                    >
                      <NotificationsLoading quantity={10} />
                    </List>
                  </div>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

// NotificationMenu.whyDidYouRender = {
//   logOnDifferentValues: true,
// };
