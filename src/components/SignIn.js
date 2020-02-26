import React from "react";
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

const SignIn = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">Sign In</Typography>
        <form>
          <TextField
            variant="outlined"
            margin="normal"
            label="Email Address"
            name="email"
            autoComplete="off"
            fullWidth
          />
          <TextField
            margin="normal"
            variant="outlined"
            label="Password"
            name="password"
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

export default SignIn;
