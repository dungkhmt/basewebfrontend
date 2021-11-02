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
  const [selectedUserLoginId, setSelectedUserLoginId] = useState(null);
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
  function handleChangeUserLoginId(e) {
    setSelectedUserLoginId(e.target.value);
  }
  function performUpdateRole() {
    let body = {
      classId: classId,
      userLoginId: selectedUserLoginId,
      roleId: selectedRole,
    };
    request(
      "POST",
      "edu/class/add-class-user-login-role",
      (res) => {
        //alert("assign teacher to class " + res.data);
        //setIsProcessing(false);
      },
      { 401: () => {} },
      body
    );
  }
  useEffect(() => {
    getRoles();
  }, []);
  return (
    <Dialog open={open}>
      <DialogTitle>Register information</DialogTitle>
      <DialogContent>
        <TextField
          label="UserLoginId"
          onChange={handleChangeUserLoginId}
        ></TextField>
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
        <Button onClick={() => performUpdateRole()}>Save</Button>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}
