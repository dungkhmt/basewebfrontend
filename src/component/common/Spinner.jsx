import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  "@keyframes bouncer": {
    from: { transform: "translateY(0)" },
    to: { transform: "translateY(-50px)" },
  },
  bouncer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    width: 125,
    height: 50,
    "& div": {
      width: 20,
      height: 20,
      background: "#0077ff",
      borderRadius: "50%",
      animation:
        "$bouncer 0.5s cubic-bezier(.19,.57,.3,.98) infinite alternate",
    },
    "&>:nth-child(2)": {
      animationDelay: "0.1s",
      opacity: 0.9,
    },
    "&>:nth-child(3)": {
      animationDelay: "0.2s",
      opacity: 0.7,
    },
    "&>:nth-child(4)": {
      animationDelay: "0.3s",
      opacity: 0.5,
    },
    "&>:nth-child(5)": {
      animationDelay: "0.4s",
      opacity: 0.3,
    },
  },
}));

function Spinner() {
  const classes = useStyles();

  return (
    <div className={classes.bouncer}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export default Spinner;
