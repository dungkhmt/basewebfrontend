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
    <div
      style={{
        display: "flex",

        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          paddingTop: "50px",

          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            paddingRight: "30px",

            justifyContent: "center",
          }}
        >
          <TextField label="userlogin" onChange={handleChange}></TextField>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={handleClick}>
            Reset password
          </Button>
        </div>
      </div>
    </div>
  );
}
