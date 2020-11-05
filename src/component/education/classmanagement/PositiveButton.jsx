import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    minWidth: 124,
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
};

function PosButton(props) {
  const { label, className } = props;
  return (
    <Button {...props} className={className}>
      {label}
    </Button>
  );
}

export default withStyles(styles)(PosButton);
