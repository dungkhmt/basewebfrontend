import { Button, Grid, Modal, TextField, MenuItem } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import { request } from "../../../api";

const modalStyle = {
  paper: {
    boxSizing: "border-box",
    position: "absolute",
    width: 600,
    maxHeight: 600,
    // border: '2px solid #000',
    borderRadius: "5px",
    boxShadow:
      "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
    backgroundColor: "white",
    zIndex: 999,
    left: "50%",
    top: "50%",
    transform: "translate(-50% , -50%)",
    padding: "20px 40px",
  },
};

function UpdateClassForAssignmentModel(props) {
  const classId = props.selectedClassId;
  const [hourLoad, setHourLoad] = React.useState(null);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    props.onUpdateInfo(hourLoad);
  };

  useEffect(() => {
    //getTeacherForAssignmentList();
  }, []);

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle.paper}>
        <h2 id="simple-modal-title">Cập nhật thông tin lớp trong KH</h2>
        <div width="100%">
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item xs={2}>
                <TextField
                  required
                  id="hourLoad"
                  label="Hour Load"
                  value={hourLoad}
                  fullWidth
                  onChange={(event) => {
                    setHourLoad(event.target.value);
                  }}
                ></TextField>
              </Grid>

              <Grid item xs={2}>
                <Button color="primary" type="submit" width="100%">
                  Update
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Modal>
  );
}

export default UpdateClassForAssignmentModel;
