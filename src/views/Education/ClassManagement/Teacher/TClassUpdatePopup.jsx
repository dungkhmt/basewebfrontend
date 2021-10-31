import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import React from "react";
import { Button } from "@material-ui/core";
import { request } from "../../../../api";

export default function TClassUpdatePopup(props) {
  const { open, performUpdate, setOpen, classId } = props;
  function updateStatus(status) {
    request(
      "get",
      "/edu/class/update-class-status?classId=" + classId + "&status=" + status
    ).then((res) => {
      setOpen(false);
    });
  }
  return (
    <Dialog open={open}>
      <DialogTitle>Register information</DialogTitle>
      <DialogContent>
        <TextField label="input"></TextField>
        <Button onClick={() => updateStatus("HIDDEN")}>Hide</Button>
        <Button onClick={() => updateStatus("OPEN")}>Open</Button>
        <Button onClick={() => performUpdate()}>Save</Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}
