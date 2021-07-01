import { ListItemAvatar, Typography } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import ListItemLink from "../sidebar/v1/ListItemLink";
import NotificationReadIcon from "./NotificationReadIcon";

const useStyles = makeStyles((theme) => ({
  itemLink: {
    padding: "0px 8px",
    color: theme.palette.text.primary,
  },
  contentContainer: {
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
  time: {
    fontSize: "0.8125rem",
    marginTop: 5,
    fontWeight: (props) =>
      props.read
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  },
  content: {
    marginBottom: 5,
    fontSize: ".9375rem",
    color: (props) => (props.read ? "inherit" : "#050505"),
    fontWeight: (props) =>
      props.read
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,

    // limited lines text
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 3 /* number of lines to show */,
    "-webkit-box-orient": "vertical",
  },
}));

const ONE_MINUTE = 60000;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;

const formatTime = (createdTime) => {
  const now = new Date().getTime();
  const time = new Date(createdTime).getTime();

  const duration = now - time;
  let convertDuration = (duration / ONE_WEEK) | 0;

  if (convertDuration > 0) {
    return `${convertDuration} tuần trước`;
  } else {
    convertDuration = (duration / ONE_DAY) | 0;

    if (convertDuration > 0) {
      return `${convertDuration} ngày trước`;
    } else {
      convertDuration = (duration / ONE_HOUR) | 0;

      if (convertDuration > 0) {
        return `${convertDuration} giờ trước`;
      } else {
        convertDuration = (duration / ONE_MINUTE) | 0;
        convertDuration = convertDuration > 1 ? convertDuration : 1;

        return `${convertDuration} phút trước`;
      }
    }
  }
};

export default function Notification(props) {
  const classes = useStyles(props);
  const { url, avatar, content, time, read, onClick } = props;

  return (
    <ListItemLink
      disableGutters
      className={classes.itemLink}
      onClick={onClick}
      to={url}
    >
      <div
        className={classes.contentContainer}
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <ListItemAvatar className={classes.itemAvatar}>{avatar}</ListItemAvatar>

        {/* {icon ? <ListItemIcon>{icon}</ListItemIcon> : null} */}
        <div
          style={{
            padding: "6px 0px 10px",
            position: "relative",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            <Typography className={classes.content}>{content}</Typography>
            <Typography
              color={read ? "default" : "primary"}
              className={classes.time}
            >
              {formatTime(time)}
            </Typography>
          </div>
          <NotificationReadIcon read={read} />
        </div>
      </div>
    </ListItemLink>
  );
}
