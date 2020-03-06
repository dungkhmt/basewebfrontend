import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  makeStyles
} from "@material-ui/core";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  dialog: {
    width: "500px"
  }
}));

import { closeAddSecurityGroupDialog, addSecurityGroup } from "../actions";
import { GROUP_LOADING, GROUP_FAILED } from "../reducers/security";

const AddSecurityGroupDialog = ({
  open,
  loading,
  failed,
  onClose,
  addGroup
}) => {
  const classes = useStyles();
  const [name, setName] = useState("");

  const handleOnClose = () => {
    setName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleOnClose}>
      <DialogTitle className={classes.dialog}>Add Security Group</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Security Group Name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {failed ? <h3>Failed</h3> : ""}
        {loading ? <h3>Loading...</h3> : ""}
        <Button onClick={onClose} variant="contained" color="secondary">
          Cancel
        </Button>
        <Button
          disabled={name === ""}
          onClick={() => addGroup(name)}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapState = state => ({
  open: state.security.openAddSecurityGroupDialog,
  loading: state.security.addSecurityGroupState === GROUP_LOADING,
  failed: state.security.addSecurityGroupState === GROUP_FAILED
});

const mapDispatch = dispatch => ({
  onClose: () => dispatch(closeAddSecurityGroupDialog()),
  addGroup: name => dispatch(addSecurityGroup(name))
});

export default connect(mapState, mapDispatch)(AddSecurityGroupDialog);
