import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import "simplebar/dist/simplebar.min.css";

const useStyles = makeStyles((theme) => ({
  notification: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

export default function NotificationTitle() {
  const classes = useStyles();

  return (
    <div style={{ margin: "20px 16px 12px", position: "relative" }}>
      <Typography
        component="h1"
        variant="h5"
        className={classes.notification}
        style={{ marginTop: "-7px", marginBottom: "-7px" }}
      >
        Thông báo
      </Typography>
    </div>
  );
}
