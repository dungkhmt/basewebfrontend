import { Avatar, Badge, IconButton } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";
import clsx from "clsx";
import randomColor from "randomcolor";
import React, { useState } from "react";
import { request } from "../../api";
import NotificationMenu from "./NotificationMenu";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    minWidth: 300,
    maxWidth: 360,
    borderRadius: 8,
    boxShadow:
      "0 12px 28px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5)",
  },
  notification: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  link: {
    padding: "0px 8px",
  },
  linkContent: {
    padding: "0px 8px",
    borderRadius: 8,
    "&:hover": {
      backgroundColor: grey[200],
    },
  },
  itemAvatar: {
    marginRight: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    color: "#000000",
    backgroundColor: grey[300],
    overflow: "unset",
  },
  itemText: {
    margin: 0,
  },
  time: {
    fontSize: "0.8125rem",
  },
  notificationMessage: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3 /* number of lines to show */,
    "-webkit-box-orient": "vertical",
  },
  avatarOpen: {
    backgroundColor: "#e7f3ff",
  },
  badge: { top: -3, right: -3 },
}));

export default function NotificationButton() {
  const classes = useStyles();

  //
  const [open, setOpen] = React.useState(false);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  const anchorRef = React.useRef(null);

  //
  const [badgeContent, setBadgeContent] = useState(0);
  const [notifications, setNotifications] = useState([]);

  //
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const fetchNotification = () => {
    request(
      "get",
      `/notification?page=${0}&size=${10}`,
      (res) => {
        let data = res.data;

        const notis = data.notifications.content.map((notification) => ({
          id: notification.id,
          url: notification.url,
          fromUser: notification.fromUser,
          content: notification.content,
          time: notification.createdStamp,
          read: notification.statusId === "NOTIFICATION_READ",
          avatarColor: randomColor({
            luminosity: "dark",
            hue: "random",
          }),
        }));

        setNotifications(notis);
        setBadgeContent(data.numUnread);
      },
      { 401: () => {} }
    );
  };

  React.useEffect(() => {
    //
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;

    if (open === false) fetchNotification();
  }, [open]);

  return (
    <>
      <IconButton
        disableRipple
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
        aria-label="notifications"
        component="span"
      >
        <Avatar
          className={clsx(classes.avatar, { [classes.avatarOpen]: open })}
        >
          {open ? (
            <NotificationsIcon color="primary" />
          ) : (
            <Badge
              badgeContent={badgeContent < 10 ? badgeContent : "+9"}
              color="secondary"
              classes={{ badge: classes.badge }}
            >
              <NotificationsIcon />
            </Badge>
          )}
        </Avatar>
      </IconButton>
      <NotificationMenu
        open={open}
        setOpen={setOpen}
        notifications={notifications}
        anchorRef={anchorRef}
      />
    </>
  );
}
