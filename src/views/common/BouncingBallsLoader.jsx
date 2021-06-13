import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Spinner from "../../component/common/Spinner";

const useStyles = makeStyles((them) => ({
  wrapper: {
    width: "100%",
    height: "80vh",
  },
}));

function BouncingBallsLoader() {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      className={classes.wrapper}
    >
      <Spinner />
      <br />
      <Typography>Đang tải...</Typography>
    </Box>
  );
}

export default BouncingBallsLoader;
