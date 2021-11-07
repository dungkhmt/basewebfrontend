import {
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@material-ui/core/";
import { makeStyles } from "@material-ui/core/styles";
import { Delete } from "@material-ui/icons";
import * as _ from "lodash";
import MaterialTable from "material-table";
import React, { useEffect, useReducer, useState } from "react";
import { FcDocument } from "react-icons/fc";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SimpleBar from "simplebar-react";
import { request } from "../../../api";
import { localization } from "../../../utils/MaterialTableUtils";
import PrimaryButton from "../../button/PrimaryButton";
import TertiaryButton from "../../button/TertiaryButton";
import CustomizedDialogs from "../../dialog/CustomizedDialogs";
import ErrorDialog from "../../dialog/ErrorDialog";
import { style } from "./TeacherViewQuizDetailForAssignment";

const useStyles = makeStyles((theme) => ({
  ...style(theme),
  table: {
    minWidth: 700,
  },
}));

const headerProperties = {
  headerStyle: {
    fontSize: 16,
    backgroundColor: "rgb(63, 81, 181)",
    color: "white",
  },
};

let count = 0;

export default function QuizTestStudentList(props) {
  const history = useHistory();
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);

  //
  const testId = props.testId;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [selectedAll, setSelectedAll] = useState(false);
  const [studentList, setStudentList] = useState([]);

  // Modals.
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [quizGroups, setQuizGroups] = useState();
  const [selectedGroup, setSelectedGroup] = useState();
  const [std, setStd] = useState();

  const onOpenDialog = (student) => {
    setStd(student);
    setOpen(true);
  };

  const handleListItemClick = (event, group) => {
    setSelectedGroup(group);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Tables.
  const cols = [
    {
      field: "userLoginId",
      title: "MSSV",
      ...headerProperties,
    },
    {
      field: "fullName",
      title: "Họ và tên",
      ...headerProperties,
      width: "40%",
    },
    {
      field: "testGroup",
      title: "Đề",
      ...headerProperties,
      width: "40%",
      render: (rowData) =>
        rowData["testGroup"] === "-" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onOpenDialog(rowData)}
          >
            Chọn đề
          </Button>
        ) : (
          rowData["testGroup"]
        ),
    },

    {
      field: "email",
      title: "Email",
      ...headerProperties,
    },
    {
      field: "selected",
      title: "Chọn",
      ...headerProperties,
      width: "10%",
      type: "numeric",
      render: (rowData) => (
        <Checkbox
          checked={rowData.selected}
          onChange={(e) => {
            rowData.selected = e.target.checked;
            if (rowData.selected === false) {
              count--;
              setSelectedAll(false);
            } else {
              count++;
            }
            if (count === studentList.length) {
              setSelectedAll(true);
            }
            forceUpdate();
          }}
        />
      ),
    },
  ];

  //
  const getQuizGroup = () => {
    request(
      // token,
      // history,
      "get",
      `/get-test-groups-info?testId=${testId}`,
      (res) => {
        setQuizGroups(res.data);
      }
    );
  };

  const handleAssignGroup = () => {
    handleClose();

    if (selectedGroup)
      request(
        // token,
        // history,
        "post",
        "/add-participant-to-quiz-test-group",
        (res) => {
          // Update group for this student in table.
          std.testGroup = selectedGroup.groupCode;
          _.remove(
            studentList,
            (student) => student.userLoginId === std.userLoginId
          );
          setStudentList([std, ...studentList]);
        },
        { rest: () => setError(true) },
        {
          participantUserLoginId: std.userLoginId,
          quizTestGroupId: selectedGroup.quizGroupId,
        }
      );
  };

  function getStudentList() {
    request(
      // token,
      // history,
      "GET",
      "/get-all-student-in-test?testId='" + testId + "'",
      (res) => {
        let temp = [];
        res.data.map((elm, index) => {
          if (elm.statusId === "STATUS_APPROVED")
            temp.push({
              userLoginId: elm.userLoginId,
              fullName: elm.fullName,
              testGroup: elm.testGroupCode,
              email: elm.email,
              selected: false,
            });
        });
        setStudentList(temp);
      }
    );
    count = 0;
  }

  const handleRejectStudent = (e) => {
    if (
      !window.confirm(
        "Bạn có chắc muốn loại bỏ những thí sinh này khỏi kỳ thi ???"
      )
    ) {
      return;
    }

    let rejectList = [];
    studentList.map((v, i) => {
      if (v.selected === true) {
        rejectList.push(v.userLoginId);
      }
    });

    if (rejectList.length !== 0) {
      let result = -1;
      let formData = new FormData();
      formData.append("testId", testId);
      formData.append("studentList", rejectList.join(";"));
      request(
        // token,
        // history,
        "POST",
        "/reject-students-in-test",
        (res) => {
          result = res.data;

          if (result >= 0) {
            let temp = studentList.filter(
              (el) => !rejectList.includes(el.userLoginId)
            );
            setStudentList(temp);
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
    getQuizGroup();
  }, []);

  return (
    <>
      <MaterialTable
        title=""
        columns={cols}
        data={studentList}
        //icons={tableIcons}
        localization={localization}
        options={{
          search: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          tableLayout: "fixed",
        }}
        actions={[
          {
            icon: () => {
              return (
                <Tooltip
                  title="Loại thí sinh khỏi kì thi"
                  aria-label="Loại thí sinh khỏi kì thi"
                  placement="top"
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => {
                      handleRejectStudent(e);
                    }}
                  >
                    <Delete style={{ color: "white" }} fontSize="default" />
                    &nbsp;&nbsp;&nbsp;Loại&nbsp;&nbsp;
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

                      if (tempS) count = studentList.length;
                      else count = 0;

                      studentList.map((value, index) => {
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

      {/* Dialogs */}
      <CustomizedDialogs
        open={open}
        handleClose={handleClose}
        title="Phân đề"
        content={
          <>
            <Typography color="textSecondary" gutterBottom>
              Chọn một đề cho <b>{std?.fullName}</b> trong danh sách dưới đây.
            </Typography>
            <SimpleBar
              style={{
                height: "100%",
                maxHeight: 400,
                width: 330,
                overflowX: "hidden",
                overscrollBehaviorY: "none", // To prevent tag <main> be scrolled when menu's scrollbar reach end
              }}
            >
              <List className={classes.list}>
                {quizGroups
                  ? quizGroups.map((group) => (
                      <ListItem
                        key={group.quizGroupId}
                        className={classes.listItem}
                        selected={
                          selectedGroup?.quizGroupId === group.quizGroupId
                        }
                        onClick={(event) => handleListItemClick(event, group)}
                      >
                        <ListItemIcon>
                          <FcDocument size={24} />
                        </ListItemIcon>
                        <ListItemText primary={group.groupCode} />
                      </ListItem>
                    ))
                  : null}
              </List>
            </SimpleBar>
          </>
        }
        actions={
          <>
            <TertiaryButton onClick={handleClose}>Huỷ</TertiaryButton>
            <PrimaryButton
              // className={classes.assignBtn}
              onClick={handleAssignGroup}
            >
              Áp dụng
            </PrimaryButton>
          </>
        }
        style={{ content: classes.dialogContent }}
      />
      <ErrorDialog open={error} />
    </>
  );
}
