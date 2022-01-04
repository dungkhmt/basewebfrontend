import { Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React from "react";

const TertiaryButton = withStyles((theme) => ({
  root: {
    textTransform: "none",
  },
}))((props) => (
  <Button color="primary" {...props}>
    {props.children}
  </Button>
));

export default TertiaryButton;
