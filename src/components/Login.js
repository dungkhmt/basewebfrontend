import React from "react";

import { Paper, TextField, Container, Button, Grid } from "@material-ui/core";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  main: {
    position: "absolute",
    margin: 0,
    padding: 0,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#eee"
  },
  form: {
    padding: "10px 60px"
  },
  formInput: {},
  title: {
    textAlign: "center",
    color: theme.palette.info.main,
    ...theme.typography.h3
  }
}));

const LoginForm = ({ classes }) => (
  <form onSubmit={e => e.preventDefault() || console.log("SUBMIT")}>
    <Paper className={classes.form}>
      <Container className={classes.title}>Login</Container>
      <Grid
        className={classes.formInput}
        container
        spacing={4}
        jusify="space-around"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <TextField label="Username" type="text" />
        </Grid>

        <Grid item>
          <TextField label="Password" type="password" />
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </form>
);

const Login = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      className={classes.main}
    >
      <Grid item>
        <LoginForm classes={classes} />
      </Grid>
    </Grid>
  );
};

export default Login;
