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
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { useHistory, useParams } from "react-router";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FcCalendar } from "react-icons/fc";
import useOnMount from "./onMount";
import _ from "lodash";
import { request } from "../../../../api";
import { useSelector } from "react-redux";
import { errorNoti } from "../../../../utils/Notification";
import { useEffect } from "react";

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
  const assignmentId = params.assignmentId;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = React.useState(false);

  // Form.
  const {
    register,
    errors,
    watch,
    handleSubmit,
    setValue,
    setError,
    control,
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
  const getData = () => {
    if (assignmentId) {
      request(
        token,
        history,
        "get",
        `/edu/assignment/${params.assignmentId}/student`,
        (res) => {
          let data = res.data.assignmentDetail;

          setValue([
            { name: data.name },
            { deadline: new Date(data.deadLine) },
          ]);

          const blocksFromHtml = htmlToDraft(data.subject);
          const { contentBlocks, entityMap } = blocksFromHtml;
          const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );

          setEditorState(EditorState.createWithContent(contentState));
        },
        {}
      );
    }
  };

  const onSubmit = (formData) => {
    setLoading(true);
    let subject = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (assignmentId) {
      request(
        token,
        history,
        "put",
        `/edu/assignment/${assignmentId}`,
        (res) => {
          history.goBack();
        },
        {
          400: (e) => {
            setLoading(false);
            let data = e.response.data;

            if ("require future date" == data?.error) {
              setError(
                "deadline",
                "require future date ",
                "Vui lòng chọn thời điểm trong tương lai"
              );
            } else if ("not exist" == data?.error) {
              errorNoti("Bài tập đã bị xoá trước đó.");
            } else {
              errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
          },
          noResponse: (e) => {
            setLoading(false);
          },
          rest: (e) => {
            setLoading(false);
            errorNoti("Rất tiếc! Đã có lỗi xảy ra.");
          },
        },
        { ...formData, subject: subject }
      );
    } else {
      request(
        token,
        history,
        "post",
        "/edu/assignment",
        (res) => {
          history.goBack();
        },
        {
          400: (e) => {
            setLoading(false);
            let data = e.response.data;

            if ("require future date" == data?.error) {
              setError(
                "deadline",
                "require future date ",
                "Vui lòng chọn thời điểm trong tương lai"
              );
            } else if ("class not exist" == data?.error) {
              errorNoti("Lớp đã bị xoá trước đó.");
            } else {
              errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
          },
          noResponse: (e) => {
            setLoading(false);
          },
          rest: (e) => {
            setLoading(false);
            errorNoti("Rất tiếc! Đã có lỗi xảy ra.");
          },
        },
        { ...formData, classId: params.classId, subject: subject }
      );
    }
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
  };

  useOnMount(() => {
    register({ name: "deadline", type: "text" });
  });

  useEffect(() => {
    getData();
  }, []);

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
              {assignmentId ? "Chỉnh sửa thông tin bài tập" : "Tạo bài tập"}
            </Typography>
          }
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
                      required: "Trường này được yêu cầu",
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
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.createBtn}
                  >
                    {assignmentId ? "Chỉnh sửa" : "Tạo bài tập"}
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
      <DevTool control={control} />
    </MuiThemeProvider>
  );
}

export default CreateExercise;
