import React, { useState } from "react";
import {
  makeStyles,
  Container,
  CssBaseline,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
  CircularProgress
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { loginAction } from "../actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  STATE_FAILED,
  STATE_IN_PROGRESS,
  STATE_LOGGED_IN
} from "../reducers/auth";

const useStyles = makeStyles(theme => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    margin: theme.spacing(3, 0)
  }
}));

const Login = ({ state, onLogin }) => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Login</Typography>
        {state === STATE_FAILED ? <h4>Account or Password not correct</h4> : ""}
        <form onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            autoComplete="off"
            fullWidth
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            className={classes.submit}
          >
            Sign In
          </Button>
          {state === STATE_IN_PROGRESS ? <CircularProgress /> : ""}
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item xs>
              <Link href="#" variant="body2">
                {"Don't have an account, Sign Up?"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const RedirectLogin = ({ state, onLogin, previousUrl }) => (
  <React.Fragment>
    {state === STATE_LOGGED_IN ? (
      <Redirect to={previousUrl} />
    ) : (
      <Login state={state} onLogin={onLogin} />
    )}
  </React.Fragment>
);

const mapState = state => ({
  state: state.auth.state,
  previousUrl: state.auth.previousUrl
});

const mapDispatch = dispatch => ({
  onLogin: (username, password) => dispatch(loginAction(username, password))
});

export default connect(mapState, mapDispatch)(RedirectLogin);
