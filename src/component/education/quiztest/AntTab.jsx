import { teal } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import React from "react";

export const AntTab = withStyles((theme) => ({
  root: {
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
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&$selected": {
      color: teal[800],
      fontWeight: theme.typography.fontWeightMedium,
    },
    "&:focus": {
      color: teal[800],
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);
