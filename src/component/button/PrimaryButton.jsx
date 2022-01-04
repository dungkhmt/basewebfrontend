import { Button } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { withStyles } from "@material-ui/core/styles";
import React from "react";
const PrimaryButton = withStyles((theme) => ({
  root: {
    textTransform: "none",
    backgroundColor: blue[700],
    color: theme.palette.getContrastText(blue[700]),
    "&:hover": {
      backgroundColor: blue[700],
    },
  },
}))((props) => (
  <Button variant="contained" {...props}>
    {props.children}
  </Button>
));

export default PrimaryButton;
