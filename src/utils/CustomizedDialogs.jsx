import { Box } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogActions from "@material-ui/core/DialogActions";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import clsx from "clsx";
import React from "react";

const styles = (theme) => ({
  root: {
    margin: 0,
    height: theme.spacing(7),
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, style, ...other } = props;
  return (
    <MuiDialogTitle
      disableTypography
      className={classes.root}
      {...other}
      style={style}
    >
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h6">{children}</Typography>
      </Box>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    height: theme.spacing(7),
    padding: theme.spacing(1),
  },
}));

const DialogActions = ({ className, children }) => {
  const classes = useStyles();

  return (
    <MuiDialogActions className={clsx(classes.root, className)}>
      {children}
    </MuiDialogActions>
  );
};

export default function CustomizedDialogs(props) {
  const { open, handleClose, title, actions, content, style } = props;

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={style?.title}
        >
          <b>{title}</b>
        </DialogTitle>
        <DialogContent className={style?.content} dividers>
          {content}
        </DialogContent>
        <DialogActions className={style?.actions}>{actions}</DialogActions>
      </Dialog>
    </div>
  );
}
