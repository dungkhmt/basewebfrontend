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
  Link
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import { loginAction } from "../actions";
import { connect } from "react-redux";

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

const Login = ({ onLogin }) => {
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
        <Typography variant="h5">Sign In</Typography>
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

const mapState = () => ({});

const mapDispatch = dispatch => ({
  onLogin: (username, password) => dispatch(loginAction(username, password))
});

export default connect(mapState, mapDispatch)(Login);
