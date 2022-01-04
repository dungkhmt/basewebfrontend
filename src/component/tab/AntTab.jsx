import { teal } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import React from "react";

export function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const AntTab = withStyles((theme) => ({
  root: {
    transition: "text-shadow .3s",
    textTransform: "none",
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      opacity: 1,
      // fontWeight: theme.typography.fontWeightMedium,
      textShadow: "0 0 .65px, 0 0 .65px",
    },
    "&$selected": {
      color: teal[800],
      // fontWeight: theme.typography.fontWeightMedium,
      textShadow: "0 0 .65px, 0 0 .65px",
    },
    "&:focus": {
      color: teal[800],
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);
