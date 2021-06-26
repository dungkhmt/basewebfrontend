import { TabScrollButton } from "@material-ui/core";
import { grey, teal } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import React from "react";

const AntTabScrollButton = withStyles((theme) => ({
  root: {
    opacity: 1,
    position: "absolute",
    height: 36,
    width: 36,
    marginTop: 6,
    borderRadius: "50%",
    backgroundColor: grey[200],
    overflow: "hidden",
    "&.MuiTabs-scrollButtons": {
      "&:hover": { backgroundColor: "#ffffff" },
      "&:first-of-type": { zIndex: 1 },
      "&:last-of-type": { right: 0 },
    },

    // Another way to fix scroll button
    // transition: "width 0.5s",
    // "&.Mui-disabled": {
    //   width: 0,
    // },
  },
}))(TabScrollButton);

export const AntTabs = withStyles({
  root: {
    position: "relative",
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: teal[800],
  },
})((props) => (
  <Tabs ScrollButtonComponent={AntTabScrollButton} {...props}>
    {props.children}
  </Tabs>
));
