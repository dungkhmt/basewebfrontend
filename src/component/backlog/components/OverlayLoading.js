import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dialog, CircularProgress
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "rgba(117,117,117,0.3)"
  },

  paper: {
    backgroundColor: "transparent",
    boxShadow: "none",
    overflow: "hidden"
  },
}));

export default function OverlayLoading(props) {
  const { open, onClose } = props;
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick={true}
      aria-labelledby="simple-dialog-title"
      BackdropProps={{
        classes: {
          root: classes.root
        }
      }}
      PaperProps={{
        classes: {
          root: classes.paper
        }
      }}
    >
      <div>
        <CircularProgress
          style={{ display: "inline-block" }}
        // size={50}
        />
      </div>
    </Dialog>
  );
}