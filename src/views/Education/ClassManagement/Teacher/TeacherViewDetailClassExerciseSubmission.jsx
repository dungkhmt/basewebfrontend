import { request } from "../../../../api";
import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { drawerWidth } from "../../../../assets/jss/material-dashboard-react";
import {
  FcApproval,
  FcClock,
  FcConferenceCall,
  FcExpired,
  FcMindMap,
} from "react-icons/fc";
import Button from "@material-ui/core/Button";
import ReactExport from "react-data-export";
import MaterialTable from "material-table";
import changePageSize, {
  localization,
  tableIcons,
} from "../../../../utils/MaterialTableUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    margin: "auto",
    width: `calc(100vw - ${drawerWidth + theme.spacing(4) * 2 + 1}px)`,
    backgroundColor: theme.palette.background.paper,
  },
  card: {
    marginTop: theme.spacing(2),
  },
  grid: {
    paddingLeft: 56,
  },
  negativeBtn: {
    minWidth: 112,
    marginLeft: 10,
    marginRight: 10,
  },
  positiveBtn: {
    minWidth: 112,
  },
  dialogRemoveBtn: {
    fontWeight: "normal",
  },
  listItem: {
    height: 48,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
  open: { transform: "rotate(-180deg)", transition: "0.3s" },
  close: { transition: "0.3s" },
  item: {
    paddingLeft: 32,
  },
  tabs: { padding: theme.spacing(2) },
  tabSelected: {
    background: "rgba(254,243,199,1)",
    color: "rgba(180,83,9,1) !important",
  },
  tabRoot: {
    margin: "0px 0.5rem",
    borderRadius: "0.375rem",
    textTransform: "none",
  },
}));
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

export default function TeacherViewDetailClassExerciseSubmission(props) {
  const classes = useStyles();
  //const params = useParams();
  const classId = props.classId;
  const history = useHistory();
  const [studentAssignmentList, setStudentAssignmentList] = useState([]);
  const [fetchedStudentAssignment, setFetchedStudentAssignment] =
    useState(false);

  const [classDetail, setClassDetail] = useState({});
  const studentTableRef = useRef(null);
  const studentAssignTableRef = useRef(null);

  const headerProperties = {
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
      fontSize: "1rem",
    },
  };
  const TableBorderStyle = "medium";
  const TableHeaderStyle = {
    style: {
      font: { sz: "14", bold: true },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: TableBorderStyle },
        bottom: { style: TableBorderStyle },
        left: { style: TableBorderStyle },
        right: { style: TableBorderStyle },
      },
    },
  };

  const TableCellStyle = {
    style: {
      font: { sz: "14" },
      alignment: { vertical: "center", horizontal: "center" },
      border: {
        top: { style: TableBorderStyle },
        bottom: { style: TableBorderStyle },
        left: { style: TableBorderStyle },
        right: { style: TableBorderStyle },
      },
    },
  };
  const stuAssignCols = [
    {
      field: "studentName",
      title: "Họ và tên sinh viên",
      ...headerProperties,
    },
  ].concat(
    !fetchedStudentAssignment
      ? []
      : !studentAssignmentList.length
      ? []
      : studentAssignmentList[0].assignmentList.map((assignment, index) => {
          return {
            field: "assignmentList[" + index + "].assignmentStatus",
            title: assignment.assignmentName,
            ...headerProperties,
          };
        }),
    [
      {
        field: "totalSubmitedAssignment",
        //field: "totalSubmitedAssignment",
        title: "Tổng số bài nộp",
        ...headerProperties,
      },
    ]
  );

  const DataSet = [
    {
      columns: [
        {
          title: "Họ và tên sinh viên",
          ...TableHeaderStyle,
          width: { wch: "Họ và tên sinh viên".length },
        },
      ].concat(
        !fetchedStudentAssignment
          ? []
          : !studentAssignmentList.length
          ? []
          : studentAssignmentList[0].assignmentList.map((assignment) => {
              return {
                title: assignment.assignmentName,
                ...TableHeaderStyle,
                width: { wch: assignment.assignmentName.length + 3 },
              };
            }),
        [
          {
            title: "Tổng số bài nộp",
            ...TableHeaderStyle,
            width: { wch: "Tổng số bài nộp".length },
          },
        ]
      ),
      data: !fetchedStudentAssignment
        ? []
        : studentAssignmentList.map((data) => {
            return [{ value: data.studentName, ...TableCellStyle }].concat(
              data.assignmentList.map((data2) => {
                return { value: data2.assignmentStatus, ...TableCellStyle };
              }),
              [{ value: data.totalSubmitedAssignment, ...TableCellStyle }]
            );
          }),
    },
  ];
  const getStudentAssignment = () => {
    request(
      // token,
      // history,
      "get",
      `/edu/class/${classId}/all-student-assignments/teacher`,
      (res) => {
        setStudentAssignmentList(res.data);
        setFetchedStudentAssignment(true);
      }
    );
  };

  useEffect(() => {
    //getClassDetail();
    //getAssigns();
    getStudentAssignment();
    //getStudents("register");
    //getStudents();
  }, []);

  return (
    <div>
      <h1>Exercise submission</h1>
      <Card className={classes.card}>
        {/* <CardActionArea disableRipple onClick={onClickStuAssignCard}> */}
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              {/*#ffeb3b <PeopleAltRoundedIcon /> */}
              <FcConferenceCall size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách nộp bài tập</Typography>}
          // action={
          //   <div>
          //     <IconButton aria-label="show more">
          //       <FcExpand
          //         size={24}
          //         className={clsx(
          //           !openStuAssignCard && classes.close,
          //           openStuAssignCard && classes.open
          //         )}
          //       />
          //     </IconButton>
          //   </div>
          // }
        />
        {/* </CardActionArea>
          <Collapse in={openStuAssignCard} timeout="auto"> */}
        <CardContent>
          {studentAssignmentList.length !== 0 ? (
            <ExcelFile
              filename={"Danh sách nộp bài tập lớp " + classDetail.code}
              element={
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "0px" }}
                >
                  Xuất Excel
                </Button>
              }
            >
              <ExcelSheet
                dataSet={DataSet}
                name={"Danh sách nộp bài tập lớp " + classDetail.code}
              />
            </ExcelFile>
          ) : null}
          <MaterialTable
            title=""
            columns={stuAssignCols}
            icons={tableIcons}
            tableRef={studentAssignTableRef}
            localization={localization}
            data={studentAssignmentList}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              fixedColumns: {
                left: 1,
                right: 1,
              },
              draggable: false,
              filtering: true,
              sorting: true,
              search: false,
              pageSize: 10,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              filterCellStyle: { textAlign: "center" },
              cellStyle: { fontSize: "1rem", textAlign: "center" },
              toolbarButtonAlignment: "left",
              // exportButton: true,
              // exportFileName: "Danh sách nộp bài tập lớp " + classDetail.code,
              // exportDelimiter: ",",
            }}
          />
        </CardContent>
        {/* </Collapse> */}
      </Card>
      <Card className={classes.card}>
        {/* <CardActionArea disableRipple onClick={onClickStuAssignCard}> */}
        <CardHeader
          avatar={
            <Avatar style={{ background: "white" }}>
              {/*#ffeb3b <PeopleAltRoundedIcon /> */}
              <FcConferenceCall size={40} />
            </Avatar>
          }
          title={<Typography variant="h5">Danh sách nộp bài tập</Typography>}
          // action={
          //   <div>
          //     <IconButton aria-label="show more">
          //       <FcExpand
          //         size={24}
          //         className={clsx(
          //           !openStuAssignCard && classes.close,
          //           openStuAssignCard && classes.open
          //         )}
          //       />
          //     </IconButton>
          //   </div>
          // }
        />
        {/* </CardActionArea>
          <Collapse in={openStuAssignCard} timeout="auto"> */}
        <CardContent>
          {studentAssignmentList.length !== 0 ? (
            <ExcelFile
              filename={"Danh sách nộp bài tập lớp " + classDetail.code}
              element={
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "0px" }}
                >
                  Xuất Excel
                </Button>
              }
            >
              <ExcelSheet
                dataSet={DataSet}
                name={"Danh sách nộp bài tập lớp " + classDetail.code}
              />
            </ExcelFile>
          ) : null}
          <MaterialTable
            title=""
            columns={stuAssignCols}
            icons={tableIcons}
            tableRef={studentAssignTableRef}
            localization={localization}
            data={studentAssignmentList}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
            }}
            options={{
              fixedColumns: {
                left: 1,
                right: 1,
              },
              draggable: false,
              filtering: true,
              sorting: true,
              search: false,
              pageSize: 10,
              debounceInterval: 500,
              headerStyle: {
                backgroundColor: "#673ab7",
                fontWeight: "bold",
                fontSize: "1rem",
                color: "white",
              },
              filterCellStyle: { textAlign: "center" },
              cellStyle: { fontSize: "1rem", textAlign: "center" },
              toolbarButtonAlignment: "left",
              // exportButton: true,
              // exportFileName: "Danh sách nộp bài tập lớp " + classDetail.code,
              // exportDelimiter: ",",
            }}
          />
        </CardContent>
        {/* </Collapse> */}
      </Card>
    </div>
  );
}
