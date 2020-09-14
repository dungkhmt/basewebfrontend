import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "material-ui";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddIcon from "@material-ui/icons/Add";
import { useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
  },
  textField: {
    width: 300,
  },
  container: {
    marginLeft: 100,
  },
}));

function CreateExercise() {
  const classes = useStyles();

  const {
    register,
    setError,
    errors,
    watch,
    handleSubmit,
    control,
  } = useForm();

  // Functions.
  const onSubmit = (formData) => {
    console.log(formData);
  };

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#5e35b1" }}>
              <AddIcon />
            </Avatar>
          }
          title={
            <Typography variant="h5">
              Tạo bài tập (Ý tưởng phân bài tập lớn cho nhóm SV)
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3} className={classes.container}>
              <Grid item md={12}>
                <TextField
                  name="code"
                  label="Mã bài tập"
                  variant="outlined"
                  value={watch("code")}
                  error={errors.code ? true : null}
                  helperText={errors.code?.message}
                  inputRef={register({
                    maxLength: {
                      value: 30,
                      message: "Độ dài vượt quá kích thước cho phép",
                    },
                  })}
                  className={classes.textField}
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  name="name"
                  label="Tên bài tập*"
                  variant="outlined"
                  value={watch("name")}
                  error={errors.name ? true : null}
                  helperText={errors.name?.message}
                  inputRef={register({
                    required: "Được yêu cầu",
                    maxLength: {
                      value: 255,
                      message: "Độ dài vượt quá kích thước cho phép",
                    },
                  })}
                  className={classes.textField}
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  name="note"
                  label="Ghi chú"
                  variant="outlined"
                  value={watch("note")}
                  error={errors.note ? true : null}
                  helperText={errors.note?.message}
                  inputRef={register({
                    maxLength: {
                      value: 255,
                      message: "Độ dài vượt quá kích thước cho phép",
                    },
                  })}
                  className={classes.textField}
                />
              </Grid>
              <Grid item md={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ width: 100, marginLeft: 10, marginRight: 10 }}
                >
                  Huỷ
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ width: 100, marginLeft: 10, marginRight: 10 }}
                >
                  Tạo mới
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <DevTool control={control} />
    </MuiThemeProvider>
  );
}

export default CreateExercise;
