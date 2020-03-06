import React from "react";
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { createSelector } from "reselect";
import { removeNotification } from "../actions";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    width: "400px",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

const Alert = props => <MuiAlert elevation={6} variant="filled" {...props} />;

const Notifications = ({ open, messages, onClose }) => {
  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div className={classes.root}>
        {messages.map(m => (
          <Alert key={m.id} severity={m.severity} onClose={() => onClose(m.id)}>
            {m.content}
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
};

const mapState = createSelector(
  state => state.notifications,
  notifications => ({
    open: Object.values(notifications.messages).length > 0,
    messages: Object.values(notifications.messages)
  })
);

const mapDispatch = dispatch => ({
  onClose: id => dispatch(removeNotification(id))
});

export default connect(mapState, mapDispatch)(Notifications);
