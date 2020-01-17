import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { authPost } from "../../api";

import { useDispatch, useSelector } from "react-redux";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));
function UserCreate(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();
  const [lastName, setLastName] = useState([]);
  const [middleName, setMiddleName] = useState([]);
  const [firstName, setFirstName] = useState([]);
  const [userName, setUserName] = useState([]);
  const [password, setPassword] = useState([]);
  const [birthDate, setBirthDate] = useState(new Date());

  const handleBirthDateChange = date => {
    setBirthDate(date);
  };
  const [isRequesting, setIsRequesting] = useState(false);

  const classes = useStyles();

  const handleUserNameChange = event => {
    setUserName(event.target.value);
  };
  const handleLastNameChange = event => {
    setLastName(event.target.value);
  };
  const handleMiddleNameChange = event => {
    setMiddleName(event.target.value);
  };
  const handleFirstNameChange = event => {
    setFirstName(event.target.value);
  };
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };
  const handleSubmit = () => {
    const data = {
      userLoginId: userName,
      password: password,
      lastName: lastName,
      middleName: middleName,
      firstName: firstName,
      birthDate: birthDate
    };
    setIsRequesting(true);
    authPost(dispatch, token, "/rest/userCombineEntities/", data).then(
      res => {
        console.log(res);
        setIsRequesting(false);
        //history.push("/tracklocations/list");
      },
      error => {
        console.log(error);
      }
    );
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Create User
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <div>
              <TextField
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={handleFirstNameChange}
              />
              <TextField
                id="middleName"
                label="Middle Name"
                value={middleName}
                onChange={handleMiddleNameChange}
              />
              <TextField
                id="lastName"
                label="LastName"
                value={lastName}
                onChange={handleLastNameChange}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Date picker inline"
                value={birthDate}
                onChange={handleBirthDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
              <TextField
                id="userName"
                label="UserName"
                value={userName}
                onChange={handleUserNameChange}
              />
              <TextField
                id="password"
                label="Password"
                value={password}
                type="password"
                onChange={handlePasswordChange}
              />
            </div>
          </form>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  );
}

export default UserCreate;
