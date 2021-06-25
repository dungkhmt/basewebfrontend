import { TabScrollButton } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import React from "react";

const AntTabScrollButton = withStyles((theme) => ({
  root: {
    overflow: "hidden",
    transition: "width 0.5s",
    "&.Mui-disabled": {
      width: 0,
    },
  },
}))(TabScrollButton);

export const AntTabs = withStyles({
  root: {
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
