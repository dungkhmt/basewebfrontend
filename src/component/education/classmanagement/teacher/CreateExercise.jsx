import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "material-ui";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddIcon from "@material-ui/icons/Add";
import { useForm } from "react-hook-form";
import { DevTool } from "react-hook-form-devtools";
import { motion } from "framer-motion";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { convertToRaw, EditorState } from "draft-js";
import { useHistory, useParams } from "react-router";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  DateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FcCalendar } from "react-icons/fc";
import useOnMount from "./onMount";
import _ from "lodash";
import { request } from "../../../../api";
import { useSelector } from "react-redux";
import { successNoti } from "../../../../utils/Notification";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    borderRadius: 6,
  },
  textField: {
    width: 300,
  },
  container: {
    // minHeight: 1000,
  },
  cancelBtn: {
    borderRadius: "6px",
    textTransform: "none",
    fontSize: "1rem",
    marginLeft: theme.spacing(2),
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  createBtn: {
    borderRadius: "6px",
    backgroundColor: "#1877f2",
    textTransform: "none",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#1834d2",
    },
  },
}));

const editorStyle = {
  toolbar: {
    background: "#90caf9",
  },
  editor: {
    border: "1px solid black",
    minHeight: "300px",
  },
};

function CreateExercise() {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Form.
  const {
    register,
    errors,
    watch,
    handleSubmit,
    control,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      deadline: (() => {
        let date = new Date();

        date.setDate(date.getDate() + 1);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);

        return date;
      })(),
    },
  });

  // Functions.
  const onSubmit = (formData) => {
    let subject = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    request(
      token,
      history,
      "post",
      "/edu/assignment",
      (res) => {
        successNoti("Success!");
      },
      {},
      { ...formData, classId: params.id, subject: subject }
    );
  };

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  const onClickCancelBtn = () => {
    history.goBack();
  };

  const onDeadlineChange = (newDate) => {
    let date = new Date(newDate);

    date.setSeconds(59);
    setValue("deadline", date);
    // setError(
    //   "deadline",
    //   "require future date ",
    //   "Vui lòng chọn thời điểm trong tương lai"
    // );
  };

  useOnMount(() => {
    register({ name: "deadline", type: "text" });
  });

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#5e35b1" }}>
              <AddIcon />
            </Avatar>
          }
          title={<Typography variant="h5">Tạo bài tập</Typography>}
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container md={12} justify="center">
              <Grid
                container
                md={11}
                direction="column"
                alignItems="flex-start"
                spacing={3}
                className={classes.container}
              >
                <Grid item>
                  <TextField
                    name="name"
                    label="Tên bài tập*"
                    variant="outlined"
                    value={watch("name")}
                    size="small"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    className={classes.textField}
                    inputRef={register({
                      maxLength: {
                        value: 255,
                        message: "Vui lòng chọn tên không vượt quá 255 kí tự",
                      },
                      validate: (name) => {
                        if (_.isEmpty(name.trim()))
                          return "Vui lòng chọn tên hợp lệ";
                      },
                    })}
                  />
                </Grid>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      name="deadline"
                      variant="inline"
                      inputVariant="outlined"
                      size="small"
                      cancelLabel="Huỷ"
                      okLabel="Chọn"
                      ampm={false}
                      disablePast={true}
                      format="yyyy-MM-dd  HH:mm:ss"
                      label="Hạn nộp bài"
                      value={watch("deadline")}
                      onChange={onDeadlineChange}
                      strictCompareDates
                      error={!!errors.deadline}
                      helperText={errors.deadline?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <FcCalendar size={32} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      TextFieldComponent={(props) => (
                        <TextField
                          disabled
                          className={classes.textField}
                          {...props}
                        />
                      )}
                      KeyboardButtonProps={{
                        "aria-label": "deadline",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={onEditorStateChange}
                    toolbarStyle={editorStyle.toolbar}
                    editorStyle={editorStyle.editor}
                  />
                </Grid>
                <Grid item md={10}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.createBtn}
                  >
                    Tạo bài tập
                  </Button>
                  <Button
                    variant="outlined"
                    className={classes.cancelBtn}
                    onClick={onClickCancelBtn}
                  >
                    Huỷ
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {/* <DevTool control={control} /> */}
    </MuiThemeProvider>
  );
}

export default CreateExercise;
