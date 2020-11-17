import React, { useState, useEffect } from "react";
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
import AddIcon from "@material-ui/icons/Add";
import { useForm } from "react-hook-form";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import { useHistory, useParams } from "react-router";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { FcCalendar } from "react-icons/fc";
import useOnMount from "../../../../component/education/classmanagement/onMount";
import _ from "lodash";
import { request } from "../../../../api";
import { useSelector } from "react-redux";
import { errorNoti } from "../../../../utils/Notification";
import EditIcon from "@material-ui/icons/Edit";
import NegativeButton from "../../../../component/education/classmanagement/NegativeButton";
import { DevTool } from "react-hook-form-devtools";
import PositiveButton from "../../../../component/education/classmanagement/PositiveButton";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    borderRadius: 6,
  },
  textField: {
    width: 300,
  },
  container: {},
  cancelBtn: {
    minWidth: 112,
    fontWeight: "normal",
    marginRight: 10,
  },
  createOrUpdateBtn: {
    minWidth: 112,
    fontWeight: "normal",
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

function CreateAssignment() {
  const classes = useStyles();
  const params = useParams();
  const assignId = params.assignmentId;
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);

  // Editor.
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Pickers.
  const pickerProps = {
    inputVariant: "outlined",
    size: "small",
    cancelLabel: "Huỷ",
    okLabel: "Chọn",
    ampm: false,
    disablePast: true,
    format: "yyyy-MM-dd  HH:mm:ss",
    strictCompareDates: true,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton>
            <FcCalendar size={32} />
          </IconButton>
        </InputAdornment>
      ),
    },
    TextFieldComponent: (props) => (
      <TextField disabled className={classes.textField} {...props} />
    ),
  };

  // Form.
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    register,
    errors,
    watch,
    handleSubmit,
    setValue,
    setError,
    clearError,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      openTime: (() => {
        let date = new Date();

        date.setDate(date.getDate() + 1);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);

        return date;
      })(),
      closeTime: (() => {
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
    request(
      token,
      history,
      "get",
      `/edu/assignment/${params.assignmentId}/student`,
      (res) => {
        let data = res.data.assignmentDetail;

        setValue([
          { name: data.name },
          { openTime: new Date(data.openTime) },
          { closeTime: new Date(data.closeTime) },
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
  };

  // onChangeHandlers.
  const onChangeOpenTime = (newDate) => {
    let close = new Date(watch("closeTime"));

    if (newDate.getTime() > close.getTime()) {
      setError(
        "closeTime",
        "require subsequent date",
        "Vui lòng chọn thời điểm sau ngày giao"
      );
    } else {
      clearError("closeTime");
    }

    if (errors.openTime?.type == "require future date") {
      clearError("openTime");
    }

    setValue("openTime", newDate);
  };

  const onChangeCloseTime = (newDate) => {
    let open = new Date(watch("openTime"));

    if (open.getTime() > newDate.getTime()) {
      setError(
        "closeTime",
        "require subsequent date",
        "Vui lòng chọn thời điểm sau ngày giao"
      );
    } else {
      clearError("closeTime");
    }

    newDate.setSeconds(59);
    setValue("closeTime", newDate);
  };

  const onChangeEditorState = (editorState) => {
    setEditorState(editorState);
  };

  const onSubmit = (formData) => {
    setIsProcessing(true);
    let subject = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    if (assignId) {
      request(
        token,
        history,
        "put",
        `/edu/assignment/${assignId}`,
        () => {
          history.goBack();
        },
        {
          onError: () => {
            setIsProcessing(false);
          },
          400: (e) => {
            let errors = e.response.data?.errors;

            if (errors) {
              errors.forEach((error) => {
                switch (error.location) {
                  case "openTime":
                    setError("openTime", error.type, error.message);
                    break;
                  case "closeTime":
                    setError("closeTime", error.type, error.message);
                    break;
                  case "id":
                    errorNoti("Bài tập đã bị xoá trước đó.");
                    break;
                }
              });
            } else {
              errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
          },
          rest: () => {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
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
        () => {
          history.goBack();
        },
        {
          onError: () => {
            setIsProcessing(false);
          },
          400: (e) => {
            let errors = e.response.data?.errors;

            if (errors) {
              errors.forEach((error) => {
                switch (error.location) {
                  case "openTime":
                    setError("openTime", error.type, error.message);
                    break;
                  case "closeTime":
                    setError("closeTime", error.type, error.message);
                    break;
                  case "classId":
                    errorNoti("Lớp đã bị xoá trước đó.");
                    break;
                }
              });
            } else {
              errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
            }
          },
          rest: () => {
            errorNoti("Rất tiếc! Đã có lỗi xảy ra. Vui lòng thử lại.");
          },
        },
        { ...formData, subject: subject, classId: params.classId }
      );
    }
  };

  const onCancel = () => {
    history.goBack();
  };

  useOnMount(() => {
    register({ name: "openTime", type: "text" });
    register({ name: "closeTime", type: "text" });
  });

  useEffect(() => {
    if (assignId) getData();
  }, []);

  return (
    <MuiThemeProvider>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar style={{ background: "#5e35b1" }}>
              {assignId ? <EditIcon /> : <AddIcon />}
            </Avatar>
          }
          title={
            <Typography variant="h5">
              {assignId ? "Chỉnh sửa thông tin bài tập" : "Tạo bài tập"}
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
                      name="openTime"
                      label="Ngày giao"
                      value={watch("openTime")}
                      error={!!errors.openTime}
                      helperText={errors.openTime?.message}
                      onChange={onChangeOpenTime}
                      KeyboardButtonProps={{
                        "aria-label": "openTime",
                      }}
                      {...pickerProps}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      name="closeTime"
                      label="Hạn nộp bài"
                      value={watch("closeTime")}
                      error={!!errors.closeTime}
                      helperText={errors.closeTime?.message}
                      onChange={onChangeCloseTime}
                      KeyboardButtonProps={{
                        "aria-label": "closeTime",
                      }}
                      {...pickerProps}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item>
                  <Editor
                    editorState={editorState}
                    handlePastedText={() => false}
                    onEditorStateChange={onChangeEditorState}
                    toolbarStyle={editorStyle.toolbar}
                    editorStyle={editorStyle.editor}
                  />
                </Grid>
                <Grid item md={10}>
                  <NegativeButton
                    label="Huỷ"
                    className={classes.cancelBtn}
                    onClick={onCancel}
                  />
                  <PositiveButton
                    disabled={isProcessing}
                    type="submit"
                    label={assignId ? "Chỉnh sửa" : "Tạo bài tập"}
                    className={classes.createOrUpdateBtn}
                  />
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

export default CreateAssignment;
