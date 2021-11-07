import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { NavLink } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Phạm Quang Dũng
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    padding: 20,
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    width: theme.spacing(12),
    height: theme.spacing(8),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  container: {
    display: "flex",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    flexDirection: "row-reverse",
  },
  image: {
    position: "absolute",
    width: "100vw",
    maxHeight: "100vh",
  },
  wrapper: {
    background: "white",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: 40,
    backgroundColor: "green",
    "&:hover": {
      backgroundColor: "green",
    },
  },
}));

export default function SignIn(props) {
  const history = useHistory();
  const classes = useStyles();
  const [userName, setUserName] = useState(""); // new State (var) userName
  const [password, setPassword] = useState(""); // new State (var) password
  const [isTyping, setIsTyping] = useState(false);
  const handleUserNameChange = (event) => {
    setIsTyping(true);
    setUserName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setIsTyping(true);
    setPassword(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsTyping(false);
    props.requestLogin(userName, password);
  };

  if (props.isAuthenticated === true) {
    props.getScreenSecurityInfo(history);
    if (history.location.state && history.location.state.from) {
      history.replace(history.location.state.from);
      return null;
    } else
      return (
        <Redirect to={{ pathname: "/", state: { from: history.location } }} />
      );
  } else
    return (
      <div className={classes.container}>
        <img
          alt="Welcome"
          src="/static/images/welcome.jpg"
          className={classes.image}
        ></img>
        <div className={classes.paper}>
          {/* <img
          // alt="Hust"
          // className={classes.avatar}
          // src={process.env.PUBLIC_URL + "/soict-logo.png"}
          /> */}
          <Typography
            component="h1"
            variant="h4"
            style={{ position: "relative" }}
          >
            Đăng nhập
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit} noValidate>
            {props.errorState === true && isTyping === false ? (
              <Typography variant="overline" display="block" color="error">
                {props.errorMsg}
              </Typography>
            ) : (
              ""
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="user"
              label="Tên đăng nhập"
              name="user"
              onChange={handleUserNameChange}
              error={
                isTyping === false &&
                props.errorState !== null &&
                props.errorState === true
              }
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              onChange={handlePasswordChange}
              error={
                isTyping === false &&
                props.errorState !== null &&
                props.errorState === true
              }
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            {props.isRequesting === true ? (
              <Button
                disabled={true}
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
              >
                <CircularProgress /> Sign In
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Đăng nhập
              </Button>
            )}

            {/* <Grid item xs>
                
                <Link href="#" variant="body2" style = {{position:"relative"}}>
                  Quên mật khẩu?
                </Link>
              </Grid> */}

            <Link
              component={NavLink}
              to={process.env.PUBLIC_URL + "/user/register"}
              variant="body2"
              style={{ position: "relative", fontSize: "18px" }}
            >
              {"Tạo tài khoản"}
            </Link>

            {/* <Box mt={2} className={classes.cp}>
                <Copyright />
              </Box> */}
          </form>
        </div>
      </div>
    );
}
