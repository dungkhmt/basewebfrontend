import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { request } from "../../../../api";

export default function TClassUpdatePopup(props) {
  const { open, performUpdate, setOpen, classId } = props;
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  function updateStatus(status) {
    request(
      "get",
      "/edu/class/update-class-status?classId=" + classId + "&status=" + status
    ).then((res) => {
      setOpen(false);
    });
  }
  function getRoles() {
    request("GET", "/edu/class/get-role-list-educlass-userlogin", (res) => {
      setRoles(res.data);
      console.log("getRoles res = ", res);
    });
  }
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <Dialog open={open}>
      <DialogTitle>Register information</DialogTitle>
      <DialogContent>
        <TextField
          label="input"
          required
          select
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((item) => (
            <MenuItem key={item.roleId} value={item.roleId}>
              {item.description}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={() => updateStatus("HIDDEN")}>Hide</Button>
        <Button onClick={() => updateStatus("OPEN")}>Open</Button>
        <Button onClick={() => performUpdate()}>Save</Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}
