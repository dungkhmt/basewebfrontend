import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { request } from "../../api";
export default function ForgetPassword() {
  const [userLogin, setUserLogin] = useState("");
  function handleChange(e) {
    setUserLogin(e.target.value);
  }
  function handleClick() {
    //alert("reset password for " + userLogin);
    request(
      "get",
      "/public/user/resetpassword/" + userLogin,
      (res) => {
        console.log("new password sent to email");
      },
      {}
    );
  }
  return (
    <div>
      <h1>Forget password</h1>
      <TextField label="userlogin" onChange={handleChange}></TextField>
      <Button onClick={handleClick}>Reset password</Button>
    </div>
  );
}
