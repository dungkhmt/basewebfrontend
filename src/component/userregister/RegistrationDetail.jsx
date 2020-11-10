import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { Fragment, useState } from "react";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiMenuItem: {
      root: {
        marginBottom: 2,
        "&$selected, &$selected:focus, &$selected:hover": {
          // This is to refer to the prop provided by M-UI
          color: "white",
          backgroundColor: "#1976d2", // updated backgroundColor
          marginBottom: 2,
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  registrationBtn: {
    marginLeft: theme.spacing(6),
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
  container: {
    background: "#eeeeee",
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  content: {
    paddingLeft: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  roles: {
    width: 300,
    background: "white",
  },
}));

function RegistrationDetail(props) {
  const classes = useStyles();
  const { data, roles, grantedRoles, handleApprove } = props;
  const [assignedRoles, setAssignedRoles] = useState(data.roleIds); // collect selected items in select-box.

  // Functions.
  const handleChangeRoles = (e) => {
    if (e.target.value.length > 0) {
      setAssignedRoles(e.target.value);
    }
  };

  return (
    <Grid container md={12} xs={12} sm={12} className={classes.container}>
      <Grid item md={11} xs={11} sm={11} className={classes.title}>
        <Typography variant="h6">Thông tin đăng ký</Typography>
      </Grid>
      <Grid
        item
        md={3}
        xs={3}
        sm={3}
        direction="column"
        className={classes.content}
      >
        <Typography>
          <b>Tên đăng nhập</b>
        </Typography>
        <Typography>
          <b>Họ và tên</b>
        </Typography>
        <Typography>
          <b>Email</b>
        </Typography>
        <Typography>
          <b>Vai trò đăng ký</b>
        </Typography>
      </Grid>
      <Grid item md={8} xs={8} sm={8} direction="column">
        <Typography>
          <b>:&nbsp;</b>
          {data.id}
        </Typography>
        <Typography>
          <b>:&nbsp;</b>
          {data.fullName}
        </Typography>
        <Typography>
          <b>:&nbsp;</b>
          {data.email}
        </Typography>
        <Typography>
          <b>:&nbsp;</b>
          {data.roleNames}
        </Typography>
      </Grid>
      <Grid
        item
        md={11}
        xs={11}
        sm={11}
        direction="column"
        className={classes.title}
      >
        <Typography variant="h6">Phân quyền</Typography>
      </Grid>
      <Box display="flex" alignItems="center" width="100%">
        {undefined !== grantedRoles[data.id] ? (
          <Typography>{grantedRoles[data.id]}</Typography>
        ) : (
          <Fragment>
            <ThemeProvider theme={theme}>
              <TextField
                select
                variant="outlined"
                size="small"
                value={assignedRoles}
                className={classes.roles}
                SelectProps={{
                  multiple: true,
                }}
                onChange={handleChangeRoles}
              >
                {roles.map((role) => (
                  <MenuItem key={data.id + role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
            </ThemeProvider>
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.registrationBtn}
              onClick={() => {
                handleApprove(data.tableData.id, data.id, assignedRoles);
              }}
            >
              Phê duyệt
            </Button>
          </Fragment>
        )}
      </Box>
    </Grid>
  );
}

export default RegistrationDetail;
