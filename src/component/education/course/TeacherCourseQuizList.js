import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
} from "@material-ui/core/";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import {exportQuizsListPdf} from "./TeacherCourseQuizListExportPDF.js"
import { makeStyles } from "@material-ui/core/styles";
import PositiveButton from "../classmanagement/PositiveButton";


import ReactExport from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;



const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    borderRadius: "6px",
  },
  registrationBtn: {},
}));

function TeacherCourseQuizList(props) {
  const params = useParams();
  const classes = useStyles();
  const courseId = props.courseId;
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [quizs, setQuizs] = useState([]);
  const [fetchedQuizs, setfetchedQuizs] = useState(false);
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

  const DataSet = [
    {
      columns: [
        {
          title: "QuestionId",
          ...TableHeaderStyle,
          width: { wch: "50" },
        },
        {
          title: "Level",
          ...TableHeaderStyle,
          width: { wch: "35" },
        },
        {
          title: "Status",
          ...TableHeaderStyle,
          width: { wch: "25" },
        },
        {
          title: "Topic",
          ...TableHeaderStyle,
          width: { wch: "25" },
        },
        {
          title: "Created date",
          ...TableHeaderStyle,
          width: { wch: "40" },
        }
      ],
      data: !fetchedQuizs?[]:
        quizs.map((quiz)=>{
          return[
            { 
              value: quiz.questionId, 
              ...TableCellStyle 
            },
            { 
              value: quiz.levelId, 
              ...TableCellStyle 
            },
            { 
              value: quiz.statusId?quiz.statusId:"", 
              ...TableCellStyle 
            },
            { 
              value: quiz.quizCourseTopic.quizCourseTopicId, 
              ...TableCellStyle 
            },
            { 
              value: quiz.createdStamp?quiz.createdStamp:"", 
              ...TableCellStyle 
            }
          ]
        }),
       
    },
  ];
  const columns = [
    {
      title: "QuestionId",
      field: "questionId",
      render: (rowData) => (
        <Link to={"/edu/teacher/course/quiz/detail/" + rowData["questionId"]}>
          {rowData["questionId"]}
        </Link>
      ),
    },
    { title: "Level", field: "levelId" },
    { title: "Status", field: "statusId" },
    { title: "Topic", field: "quizCourseTopic.quizCourseTopicId" },
    { title: "Created date", field: "createdStamp" },
    {
      field: "",
      title: "",
      cellStyle: { textAlign: "center" },
      render: (rowData) => (
        <PositiveButton
          label="Thay đổi trạng thái"
          disableRipple
          className={classes.registrationBtn}
          onClick={() => changeStatus(rowData)}
        />
      ),
    },
  ];

  const changeStatus = (rowData) => {
    //alert('change status');
    let quiz = authGet(
      dispatch,
      token,
      "/change-quiz-open-close-status/" + rowData.questionId
    );
    console.log("change status, return status = " + quiz);
    history.push("/edu/course/detail/" + courseId);
  };
  
  async function getQuestionList() {
    //let lst = await authGet(dispatch, token, '/get-all-quiz-questions');
    await authGet(dispatch, token, "/get-quiz-of-course/" + courseId).then((res)=>{
      setfetchedQuizs(true);
      setQuizs(res);
    });
  }

  useEffect(() => {
    getQuestionList();
  }, []);

  return (
    <Card>
      <CardContent>
        {quizs.length !== 0 ? (
          <div>
            
          </div>
          
        ) : null}
        <MaterialTable
          title={"Quizs"}
          columns={columns}
          data={quizs}
          actions={[
            {
              icon: () => {
                return  <ExcelFile
                          filename={"Danh sách câu hỏi môn " + courseId}
                          element={
                            <Button
                              variant="contained"
                              color="primary"
                              style={{ marginLeft: "0px" }}
                            >
                              Xuất Excel
                            </Button>
                          }
                          >
                            <ExcelSheet
                              dataSet={DataSet}
                              name={"Danh sách câu hỏi môn " + courseId}
                            />
                        </ExcelFile>;
              },
              tooltip: "Xuất Excel",
              isFreeAction: true,
            },
            {
              icon: () => {
                return  <Button
                          variant="contained"
                          color="secondary"
                          style={{ marginLeft: "0px" }}
                        >
                          Xuất PDF
                        </Button> ;
              },
              tooltip: "Xuất PDF",
              isFreeAction: true,
              onClick: () => {
                exportQuizsListPdf(quizs, courseId)
              },
            },
            {
              icon: () => {
                return <AddIcon color="primary" fontSize="large" />;
              },
              tooltip: "Thêm mới",
              isFreeAction: true,
              onClick: () => {
                history.push("quiz/create/" + courseId);
              },
            }
          ]}
        />
      </CardContent>
    </Card>
  );
}

export default TeacherCourseQuizList;
