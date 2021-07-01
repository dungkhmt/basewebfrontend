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
  avatar: {
    width: 36,
    height: 36,
    color: "#000000",
    backgroundColor: grey[300],
    overflow: "unset",
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
      `/notification?page=${0}&size=${20}`,
      (res) => {
        let data = res.data;

        const notis = data.notifications.content.map((notification) => ({
          id: notification.id,
          url: notification.url,
          avatar: notification.avatar,
          content: notification.content,
          time: notification.createdStamp,
          read: notification.read,
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
        aria-label="notification button"
        component="span"
      >
        <Avatar
          alt="notification button"
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
