import React, { Fragment, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import {
  Box,
  CardMedia,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { motion } from "framer-motion";
import _ from "lodash";
import { request } from "../../api";
import { useState } from "react";
import { errorNoti, successNoti } from "../../utils/Notification";
import { useSelector } from "react-redux";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CustomizedDialogs from "./CustomizedDialogs";

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
  img: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
  },
  imgWrapper: { minWidth: 730, minHeight: 580 },
  wrapper: {
    background: "#311b92",
  },
  form: {
    background: "white",
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
    paddingLeft: 24,
    paddingRight: 24,
    minWidth: 520,
  },
  container: {
    flex: "0 1 auto",
    boxShadow: "5px 5px 5px white",
    borderRadius: "6px",
    minWidth: 1252,
  },
  roles: {
    width: "100%",
    paddingBottom: 20,
  },
  createBtn: {
    borderRadius: 20,
    width: 160,
    textTransform: "none",
    fontWeight: "bold",
    backgroundColor: "#1877f2",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
  createBtnWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    marginTop: 44,
    marginBottom: 16,
  },
  formField: {
    width: 220,
  },
  title: {
    fontFamily: "'Roboto', sans-serif",
  },
}));

export default function NewRegister() {
  const classes = useStyles();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [existedAccErr, setExistedAccErr] = useState(false);

  // Dialog.
  const [open, setOpen] = useState(false);

  // Forms.
  const { register, handleSubmit, control, errors, reset, watch } = useForm({
    defaultValues: {
      userLoginId: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      roles: [],
    },
  });

  // Functions.
  const getRoles = () => {
    request(
      token,
      history,
      "get",
      "/roles",
      (res) => {
        setRoles(res.data);
      },
      {}
    );
  };

  const onSubmit = (data) => {
    request(
      token,
      history,
      "post",
      "/user/register",
      () => {
        setExistedAccErr(false);
        setOpen(true);
        reset({
          userLoginId: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          roles: [],
        });
      },
      {
        400: (error) => {
          if (error.response.data?.error === "existed") {
            setExistedAccErr(true);
          } else {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
          }
        },
      },
      data
    );
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getRoles();
  }, []);

  return (
    <Box
      display="flex"
      width={window.innerWidth}
      height={window.innerHeight}
      justifyContent="center"
      alignItems="center"
      className={classes.wrapper}
    >
      <Box width="91.67%">
        <Grid
          container
          md={12}
          alignItems="stretch"
          className={classes.container}
        >
          <Grid item md={5} xs={5} sm={5} className={classes.form}>
            <Grid
              container
              md={12}
              alignItems="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ height: 56 }}
                >
                  <Typography variant="h4" className={classes.title}>
                    Tạo tài khoản
                  </Typography>
                </Box>
                {existedAccErr ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ height: 56 }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="error"
                      className={classes.title}
                    >
                      Tên đăng nhập hoặc email đã được sử dụng
                    </Typography>
                  </Box>
                ) : null}
                <Grid container justify="space-between" md={12}>
                  <Controller
                    name="userLoginId"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trim();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      maxLength: {
                        value: 60,
                        message:
                          "Vui lòng chọn tên đăng nhập không vượt quá 60 kí tự",
                      },
                    }}
                    as={
                      <TextField
                        value={watch("userLoginId")}
                        label="Tên đăng nhập*"
                        error={!!errors.userLoginId}
                        helperText={errors.userLoginId?.message}
                        className={classes.formField}
                        style={{ marginBottom: errors.userLoginId ? 0 : 20 }}
                      />
                    }
                  />
                  <Controller
                    name="firstName"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trim();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      maxLength: {
                        value: 100,
                        message: "Vui lòng sử dụng họ không vượt quá 100 kí tự",
                      },
                    }}
                    as={
                      <TextField
                        value={watch("firstName")}
                        label="Họ*"
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        className={classes.formField}
                        style={{ marginBottom: errors.firstName ? 0 : 20 }}
                      />
                    }
                  />
                  <Controller
                    name="middleName"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trimLeft();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      validate: {
                        maxLength: (name) => {
                          if (name.trim().length > 100)
                            return "Vui lòng sử dụng tên đệm không vượt quá 100 kí tự";
                          return true;
                        },
                      },
                    }}
                    as={
                      <TextField
                        value={watch("middleName")}
                        label="Tên đệm*"
                        error={!!errors.middleName}
                        helperText={errors.middleName?.message}
                        className={classes.formField}
                        style={{ marginBottom: errors.middleName ? 0 : 20 }}
                      />
                    }
                  />
                  <Controller
                    name="lastName"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trim();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      maxLength: {
                        value: 100,
                        message:
                          "Vui lòng sử dụng tên không vượt quá 100 kí tự",
                      },
                    }}
                    as={
                      <TextField
                        value={watch("lastName")}
                        label="Tên*"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        className={classes.formField}
                        style={{ marginBottom: errors.lastName ? 0 : 20 }}
                      />
                    }
                  />
                  <Controller
                    name="password"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trim();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      minLength: {
                        value: 11,
                        message: "Vui lòng chọn mật khẩu chứa ít nhất 11 kí tự",
                      },
                      maxLength: {
                        value: 60,
                        message:
                          "Vui lòng chọn mật khẩu không vượt quá 60 kí tự",
                      },
                    }}
                    as={
                      <FormControl>
                        <InputLabel
                          error={!!errors.password}
                          htmlFor="standard-adornment-password"
                        >
                          Mật khẩu*
                        </InputLabel>
                        <Input
                          id="standard-adornment-password"
                          error={!!errors.password}
                          value={watch("password")}
                          type={showPassword ? "text" : "password"}
                          className={classes.formField}
                          style={{ marginBottom: errors.password ? 0 : 20 }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText error={!!errors.password}>
                          {errors.password?.message}
                        </FormHelperText>
                      </FormControl>
                    }
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    onChange={([event]) => {
                      return event.target.value.trim();
                    }}
                    rules={{
                      required: "Trường này được yêu cầu",
                      validate: {
                        same: (confirmPassword) => {
                          if (confirmPassword !== watch("password")) {
                            return "Mật khẩu không khớp";
                          }
                          return true;
                        },
                      },
                    }}
                    as={
                      <FormControl>
                        <InputLabel
                          error={!!errors.confirmPassword}
                          htmlFor="standard-adornment-confirm-password"
                        >
                          Xác nhận mật khẩu*
                        </InputLabel>
                        <Input
                          id="standard-adornment-confirm-password"
                          error={!!errors.confirmPassword}
                          value={watch("confirmPassword")}
                          type={showPassword ? "text" : "password"}
                          className={classes.formField}
                          style={{
                            marginBottom: errors.confirmPassword ? 0 : 20,
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                        <FormHelperText error={!!errors.confirmPassword}>
                          {errors.confirmPassword?.message}
                        </FormHelperText>
                      </FormControl>
                    }
                  />
                  <TextField
                    name="email"
                    value={watch("email")}
                    label="Email*"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    className={classes.formField}
                    style={{ marginBottom: errors.email ? 0 : 20 }}
                    inputRef={register({
                      required: "Trường này được yêu cầu",
                      maxLength: {
                        value: 100,
                        message:
                          "Vui lòng sử dụng email không vượt quá 100 kí tự",
                      },
                      pattern: {
                        value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email không hợp lệ",
                      },
                    })}
                  />
                  <ThemeProvider theme={theme}>
                    <Controller
                      as={
                        <TextField
                          select
                          label="Vai trò*"
                          error={!!errors.roles}
                          helperText={errors.roles?.message}
                          SelectProps={{
                            multiple: true,
                          }}
                          className={classes.formField}
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      }
                      name="roles"
                      control={control}
                      rules={{
                        validate: {
                          required: (roles) => {
                            if (roles.length == 0) {
                              return "Vui lòng chọn ít nhất một vai trò";
                            }
                            return true;
                          },
                        },
                      }}
                    />
                  </ThemeProvider>
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={classes.createBtnWrapper}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      className={classes.createBtn}
                    >
                      Tạo
                    </Button>
                  </motion.div>
                </Grid>
              </form>
              <DevTool control={control} />
            </Grid>
          </Grid>
          <Grid item md={7} xs={7} sm={7} className={classes.imgWrapper}>
            <CardMedia
              image={require("./sign_up.jpg")}
              className={classes.img}
            />
          </Grid>
        </Grid>
      </Box>
      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title=""
        actions={
          <Button onClick={handleClose} color="primary" variant="contained">
            OK
          </Button>
        }
      />
    </Box>
  );
}
