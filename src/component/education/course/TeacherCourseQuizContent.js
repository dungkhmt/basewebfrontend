import DateFnsUtils from "@date-io/date-fns";
import {
  Card,
  CardActions,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { authGet, authPostMultiPart } from "../../../api";
import {
  dataUrlToFile,
  randomImageName,
} from "../../../utils/FileUpload/covert";
import AlertDialog from "../../common/AlertDialog";

let reDirect = null;
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
      minWidth: 120,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  imageContainer: {
    marginTop: "12px",
  },
  imageWrapper: {
    position: "relative",
  },
  imageQuiz: {
    maxWidth: "100%",
  },
  buttonClearImage: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 3,
    color: "red",
    width: 32,
    height: 32,
    cursor: "pointer",
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

function CreateQuizOfCourse() {
  const params = useParams();
  const classes = useStyles();
  const questionId = params.questionId;
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [quizCourseTopicId, setQuizCourseTopicId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [problemStatement, setProblemStatement] = useState(null);
  const [levelList, setLevelList] = useState([]);
  const [topicList, setTopicList] = useState([]);

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [fetchedImageArray, setFetchedImageArray] = useState([]);

  const [initState, setInitSate] = useState(false);

  const [alertMessage, setAlertMessage] = useState({
    title: "Vui lòng nhập đầy đủ thông tin cần thiết",
    content:
      "Một số thông tin yêu cầu cần phải được điền đầy đủ. Vui lòng kiểm tra lại.",
  });
  const [alertSeverity, setAlertSeverty] = useState("info");
  const [openAlert, setOpenAlert] = useState(false);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleAttachmentFiles = (files) => {
    setAttachmentFiles(files);
    //alert(JSON.stringify(files));
  };

  const onClickAlertBtn = () => {
    setOpenAlert(false);
    if (reDirect != null) {
      history.push(reDirect);
    }
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const onChangeEditorState = (editorState) => {
    setEditorState(editorState);
  };

  async function getLevelList() {
    let lst = await authGet(dispatch, token, "/get-quiz-levels");
    setLevelList(lst);
  }
  async function getTopicList(courseId) {
    let lst = await authGet(
      dispatch,
      token,
      "/get-quiz-course-topics-of-course/" + courseId
    );
    setTopicList(lst);
  }

  async function getQuizContent() {
    await authGet(
      dispatch,
      token,
      "/edu/teacher/course/quiz/detail/" + questionId
    )
      .then((res) => {
        if (res) {
          if (res.attachment && res.attachment.length !== 0) {
            const newFileURLArray = res.attachment.map((url) => ({
              id: randomImageName(),
              url,
            }));
            setFetchedImageArray(newFileURLArray);
          }
          let quizQuestion = res;
          setQuizCourseTopicId(quizQuestion.quizCourseTopic.quizCourseTopicId);
          setLevelId(quizQuestion.levelId);
          let blocksFromHtml = htmlToDraft(quizQuestion.questionContent);
          let { contentBlocks, entityMap } = blocksFromHtml;
          let contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
          );
          let statement = EditorState.createWithContent(contentState);
          setEditorState(statement);
          setCourseId(quizQuestion.quizCourseTopic.eduCourse.id);
          return quizQuestion.quizCourseTopic.eduCourse.id;
        } else {
          alert("Lỗi kết nối, thử tải lại trang");
        }
      })
      .then((courseId) => {
        getTopicList(courseId);
        getLevelList();
      })
      .then(() => {
        setInitSate(true);
      });
  }

  async function handleSubmit() {
    let statement = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const fetchedFileArray = [];
    for (const fetchedFile of fetchedImageArray) {
      const file = await dataUrlToFile(
        `data:image/jpeg;base64,${fetchedFile.url}`,
        fetchedFile.id
      );
      fetchedFileArray.push(file);
    }

    const newAttachmentFiles = [...fetchedFileArray, ...attachmentFiles];

    const fileId = newAttachmentFiles.map((file) => {
      if (typeof file.name !== "undefined") {
        return file.name;
      }
      return file.id;
    });

    console.log("handle submit");
    let body = {
      quizCourseTopicId: quizCourseTopicId,
      levelId: levelId,
      questionContent: statement,
      fileId,
    };

    let formData = new FormData();
    formData.append("QuizQuestionUpdateInputModel", JSON.stringify(body));
    for (const file of newAttachmentFiles) {
      formData.append("files", file);
    }

    authPostMultiPart(
      dispatch,
      token,
      "/update-quiz-question/" + questionId,
      formData
    ).then(
      (res) => {
        if (res.length !== 0) {
          //alert(JSON.stringify(res));
          alert("Cập nhật thành công");
        } else {
          alert("Cập nhật thất bại");
        }
        history.push("/edu/course/detail/" + courseId);
      },
      (error) => {
        alert("Cập nhật thất bại");
      }
    );
    //let chapter = await authPost(dispatch, token, '/create-quiz-question', body);
    //console.log('Create chapter success, chapter = ',chapter);
  }
  useEffect(() => {
    getQuizContent();
    // console.log('Create chapter of course ' + courseId);
  }, []);

  const handleDeleteImageAttachment = async (fileId) => {
    const newFileArray = fetchedImageArray.filter((file) => file.id !== fileId);
    setFetchedImageArray(newFileArray);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {!initState ? (
        <div />
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Nội dung bài tập
            </Typography>
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField
                  required
                  id="levelId"
                  select
                  label="Mức độ"
                  value={levelId}
                  fullWidth
                  onChange={(event) => {
                    setLevelId(event.target.value);
                    //console.log(problemId,event.target.value);
                  }}
                >
                  {levelList.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  id="quizCourseTopicId"
                  select
                  label="Chủ đề"
                  value={quizCourseTopicId}
                  fullWidth
                  onChange={(event) => {
                    setQuizCourseTopicId(event.target.value);
                    //console.log(problemId,event.target.value);
                  }}
                >
                  {topicList.map((item) => (
                    <MenuItem
                      key={item.quizCourseTopicId}
                      value={item.quizCourseTopicId}
                    >
                      {item.quizCourseTopicName}
                    </MenuItem>
                  ))}
                </TextField>

                <Editor
                  editorState={editorState}
                  handlePastedText={() => false}
                  onEditorStateChange={onChangeEditorState}
                  toolbarStyle={editorStyle.toolbar}
                  editorStyle={editorStyle.editor}
                />
              </div>
              <Typography
                variant="subtitle1"
                display="block"
                style={{ margin: "5px 0 0 7px", width: "100%" }}
              >
                File đính kèm
              </Typography>
              <DropzoneArea
                dropzoneClass={classes.dropZone}
                filesLimit={20}
                showPreviews={true}
                showPreviewsInDropzone={false}
                useChipsForPreview
                dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
                previewText="Xem trước:"
                previewChipProps={{
                  variant: "outlined",
                  color: "primary",
                  size: "medium",
                }}
                getFileAddedMessage={(fileName) =>
                  `Tệp ${fileName} tải lên thành công`
                }
                getFileRemovedMessage={(fileName) =>
                  `Tệp ${fileName} đã loại bỏ`
                }
                getFileLimitExceedMessage={(filesLimit) =>
                  `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
                }
                alertSnackbarProps={{
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  autoHideDuration: 1800,
                }}
                onChange={(files) => handleAttachmentFiles(files)}
              ></DropzoneArea>
              {fetchedImageArray.length !== 0 &&
                fetchedImageArray.map((file) => (
                  <div key={file.id} className={classes.imageContainer}>
                    <div className={classes.imageWrapper}>
                      <HighlightOffIcon
                        className={classes.buttonClearImage}
                        onClick={() => handleDeleteImageAttachment(file.id)}
                      />
                      <img
                        src={`data:image/jpeg;base64,${file.url}`}
                        alt="quiz test"
                        className={classes.imageQuiz}
                      />
                    </div>
                  </div>
                ))}
            </form>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "45px" }}
              onClick={handleSubmit}
            >
              Lưu
            </Button>
            <Button
              variant="contained"
              onClick={() => history.push("/edu/course/detail/" + courseId)}
            >
              Hủy
            </Button>
          </CardActions>
        </Card>
      )}

      <AlertDialog
        open={openAlert}
        onClose={handleCloseAlert}
        severity={alertSeverity}
        {...alertMessage}
        buttons={[
          {
            onClick: onClickAlertBtn,
            color: "primary",
            autoFocus: true,
            text: "OK",
          },
        ]}
      />
    </MuiPickersUtilsProvider>
  );
}

export default CreateQuizOfCourse;
