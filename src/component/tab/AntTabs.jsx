import { teal } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import { AntScrollButton } from "./AntScrollButton";

export const AntTabs = withStyles({
  root: {
    position: "relative",
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: teal[800],
  },
})((props) => (
  <Tabs ScrollButtonComponent={AntScrollButton} {...props}>
    {props.children}
  </Tabs>
));
