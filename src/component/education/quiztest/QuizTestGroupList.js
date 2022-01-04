import {
  Button,
  Checkbox,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { blue, green, grey } from "@material-ui/core/colors";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MaterialTable from "material-table";
import React, { useEffect, useReducer, useState } from "react";
import SimpleBar from "simplebar-react";
import { request } from "../../../api";
import PrimaryButton from "../../button/PrimaryButton";
import TertiaryButton from "../../button/TertiaryButton";
import CustomizedDialogs from "../../dialog/CustomizedDialogs";
import ErrorDialog from "../../dialog/ErrorDialog";
import QuizTestGroupQuestionList from "./QuizTestGroupQuestionList";
export const style = (theme) => ({
  testBtn: {
    marginLeft: 40,
    marginTop: 32,
  },
  wrapper: {
    padding: "32px 0px",
  },
  answerWrapper: {
    "& label": {
      "&>:nth-child(2)": {
        display: "inline-block",
        "& p": {
          margin: 0,
          textAlign: "justify",
        },
      },
    },
  },
  answer: {
    width: "100%",
    marginTop: 20,
  },
  quizStatement: {
    fontSize: "1rem",
    "&>p:first-of-type": {
      display: "inline",
    },
  },
  list: {
    paddingBottom: 0,
    width: 330,
  },
  dialogContent: { paddingBottom: theme.spacing(1), width: 362 },
  listItem: {
    borderRadius: 6,
    "&:hover": {
      backgroundColor: grey[200],
    },
    "&.Mui-selected": {
      backgroundColor: blue[500],
      color: theme.palette.getContrastText(blue[500]),
      "&:hover": {
        backgroundColor: blue[500],
      },
    },
  },
  btn: {
    textTransform: "none",
  },
});

const useStyles = makeStyles((theme) => style(theme));

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};

let count = 0;

export default function QuizTestGroupList(props) {
  // const classes = useStyles();

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [selectedAll, setSelectedAll] = useState(false);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });
  const classes = useStyles();

  const columns = [
    {
      field: "groupCode",
      title: "Mã đề",
      ...headerProperties,
    },
    {
      field: "note",
      title: "Ghi chú",
      ...headerProperties,
      width: "40%",
    },
    {
      field: "numStudent",
      title: "Số sinh viên",
      ...headerProperties,
      type: "numeric",
    },
    {
      field: "numQuestion",
      title: "Số câu hỏi",
      ...headerProperties,
      type: "numeric",
    },
    {
      field: "selected",
      title: "    Chọn",
      ...headerProperties,
      width: "10%",
      type: "numeric",
      render: (rowData) => (
        <Checkbox
          checked={rowData.selected}
          onChange={(e) => {
            rowData.selected = e.target.checked;
            if (rowData.selected == false) {
              count--;
              setSelectedAll(false);
            } else {
              count++;
            }
            if (count == groupList.length) {
              setSelectedAll(true);
            }
            forceUpdate();
          }}
        />
      ),
    },
  ];

  let testId = props.testId;

  const [groupList, setGroupList] = useState([]);
  const [numberGroups, setNumberGroups] = useState(null);

  const onOpenDialog = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChangeNumberGroups = (event) => {
    setNumberGroups(event.target.value);
  };
  async function getStudentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-test-groups-info?testId=" + testId,
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          temp.push({
            groupCode: elm.groupCode,
            note: elm.note,
            numStudent: elm.numStudent,
            numQuestion: elm.numQuestion,
            quizGroupId: elm.quizGroupId,
            selected: false,
          });
        });
        setGroupList(temp);
        console.log(res.data);
      }
    );
    count = 0;
  }

  const handleGenerateQuizGroup = (e) => {
    handleClose();
    let data = { quizTestId: testId, numberOfQuizTestGroups: numberGroups };

    request(
      // token,
      // history,
      "post",
      "generate-quiz-test-group",
      (res) => {
        console.log(res);
        alert("Thêm đề thành công");
      },
      { rest: () => setError(true) },

      data
    );
  };

  const handleDeleteQuizGroup = (e) => {
    if (!window.confirm("Bạn có chắc muốn xóa những đề thi này không ???")) {
      return;
    }

    let acceptList = [];
    groupList.map((v, i) => {
      if (v.selected == true) {
        acceptList.push(v.quizGroupId);
      }
    });

    if (acceptList.length != 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("testId", testId);
      formData.append("quizTestGroupList", acceptList.join(";"));

      request(
        // token,
        // history,
        "POST",
        "/delete-quiz-test-groups",
        (res) => {
          result = res.data;

          if (result >= 0) {
            let temp = groupList.filter(
              (el) => !acceptList.includes(el.userLoginId)
            );
            setGroupList(temp);
            count = 0;
          }
        },
        {},
        formData
      );
    }
  };

  useEffect(() => {
    getStudentList();
    return () => {};
  }, []);

  return (
    <>
      <MaterialTable
        title=""
        columns={columns}
        data={groupList}
        //icons={tableIcons}
        localization={{
          header: {
            actions: "",
          },
          body: {
            emptyDataSourceMessage: "Không có bản ghi nào để hiển thị",
            filterRow: {
              filterTooltip: "Lọc",
            },
          },
        }}
        options={{
          search: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          tableLayout: "fixed",
          //selection: true
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Thêm đề mới"
                  aria-label="Thêm đề mới"
                  placement="top"
                >
                  <ThemeProvider theme={theme}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        //handleGenerateQuizGroup(e);
                        onOpenDialog();
                      }}
                      style={{ color: "white" }}
                    >
                      <AddCircleOutlineIcon
                        style={{ color: "white" }}
                        fontSize="default"
                      />
                      &nbsp;&nbsp;&nbsp;Thêm đề&nbsp;&nbsp;
                    </Button>
                  </ThemeProvider>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Tooltip
                  title="Xóa đề được chọn"
                  aria-label="Xóa đề được chọn"
                  placement="top"
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      handleDeleteQuizGroup(e);
                    }}
                  >
                    <Delete style={{ color: "white" }} fontSize="default" />
                    &nbsp;&nbsp;&nbsp;Xóa&nbsp;&nbsp;
                  </Button>
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
          {
            icon: () => {
              return (
                <Tooltip
                  title="Chọn tất cả"
                  aria-label="Chọn tất cả"
                  placement="top"
                >
                  <Checkbox
                    checked={selectedAll}
                    onChange={(e) => {
                      let tempS = e.target.checked;
                      setSelectedAll(e.target.checked);

                      if (tempS) count = groupList.length;
                      else count = 0;

                      groupList.map((value, index) => {
                        value.selected = tempS;
                      });
                    }}
                  />
                  {/* <div>&nbsp;&nbsp;&nbsp;Chọn tất cả&nbsp;&nbsp;</div> */}
                </Tooltip>
              );
            },
            isFreeAction: true,
          },
        ]}
      />
      <QuizTestGroupQuestionList testId={testId} />

      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title="Sinh thêm đề"
        content={
          <>
            <Typography color="textSecondary" gutterBottom>
              Nhập số lượng đề cần sinh thêm
            </Typography>
            <SimpleBar
              style={{
                height: "100%",
                maxHeight: 400,
                width: 330,
                overflowX: "hidden",
                overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
              }}
            ></SimpleBar>
            <TextField
              required
              id="standard-required"
              label="Required"
              defaultValue="1"
              onChange={handleChangeNumberGroups}
            />
          </>
        }
        actions={
          <>
            <TertiaryButton onClick={handleClose}>Huỷ</TertiaryButton>
            <PrimaryButton onClick={handleGenerateQuizGroup}>
              Sinh thêm đề
            </PrimaryButton>
          </>
        }
        style={{ content: classes.dialogContent }}
      />
      <ErrorDialog open={error} />
    </>
  );
}
