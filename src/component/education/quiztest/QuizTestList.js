import {
    Button, Card, CardActions, CardContent, TextField, Typography, IconButton,
    MenuItem, Checkbox, Grid, Tooltip
  } from "@material-ui/core/";
import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
import {Link} from "react-router-dom";
import AddIcon from '@material-ui/icons/Add';
//import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const nextLine = 
<pre>
</pre>

const lineBreak = 
<pre style={{userSelect: "none"}}>{
  ' '
}</pre>;

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: 'rgb(63, 81, 181)',
      color: theme.palette.common.white,
      fontSize: 16,
    },
    body: {
      fontSize: 16,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
root: {
    '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
    },
},
}))(TableRow);

function createData(testId, testName, scheduleDatetime, duration, classId, classUuid) {
    //date = Date.parse(scheduleDatetime);
    let index = scheduleDatetime.indexOf('T');
    let date = scheduleDatetime.substring(0, index);
    let excuteTime = scheduleDatetime.substring(index + 1, scheduleDatetime.indexOf('.'));
    //console.log(scheduleDatetime)
    return { testId, testName, datetime: date, excuteTime: excuteTime, duration: duration + ' phút', classId, classUuid};
}

const rows = [

];

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const headerProperties = {
    headerStyle: {
        fontSize: 16,
        backgroundColor: 'rgb(63, 81, 181)',
        color: 'white'
    },
    
};

const columns = [
    {
        field: "testId",
        title: "Mã kỳ thi",
        render: (rowData) => (
            <Link
                to={{
                    pathname: `/edu/class/quiztest/detail/${rowData.testId}`,
                }}

                style={{
                    textDecoration: 'none'
                }}

            >
                {rowData.testId}
            </Link>
          ),
        ...headerProperties,
    },
    {
        field: "testName",
        title: "Tên kỳ thi",
        ...headerProperties,
        width: "40%"
    },
    {
        field: "classId",
        title: "Mã lớp",
        render: (rowData) => (
            <Link
                to={{
                    pathname: `/edu/teacher/class/${rowData.classUuid}`,
                }}
                style={{
                    textDecoration: 'none'
                }}
            >
                {rowData.classId}
            </Link>
          ),
        ...headerProperties
    },
    {
        field: "datetime",
        title: "Ngày thi",
        ...headerProperties
    },
    {
        field: "excuteTime",
        title: "Giờ thi",
        ...headerProperties,
        width: "10%"
    },
    {
        field: "duration",
        title: "Thời lượng",
        ...headerProperties,
    },
]

function QuizTestList(){
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [quizTestList, setQuizTestList] = useState([]);

    async function getAllQuizTestByUser() {
        let list = await authGet(dispatch, token, "/get-all-quiz-test-by-user");

        let listClass = await authGet(dispatch, token, "/edu/class/list/teacher");

        rows.splice(0, rows.length);
        list.map((elm, index) => {
            let foundIndex= -1;
            for (let index = 0; index < listClass.length; index++) {
                if(listClass[index].id == elm.classId) {
                    foundIndex = index;
                    break;
                }
            }
            if(foundIndex == -1) alert("Something went wrong !!!");
            else
            rows.push(createData(elm.testId, elm.testName, elm.scheduleDatetime, elm.duration, listClass[foundIndex].code, elm.classId));
        })

        setQuizTestList(rows)
    }

    useEffect(() => {
        getAllQuizTestByUser();
        return () => {
          
        }
    }, []);

    /* let body = {
        'testId': testId,
        'testName': quizName,
        'scheduleDatetime': selectedDate,
        'duration': duration,
        'courseId': selectedCourse,
        'classId': selectedClass
    }; */

    return (
        //<MuiThemeProvider theme>
        <Card>
          <CardContent>
            {/* <Grid container spacing={5} justify='flex-end' direction="row">
                    <Tooltip title="Thêm mới một đề thi" aria-label="Thêm mới một đề thi" placement="top">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { 
                                history.push('create-quiz-test');
                            }}
                        >
                            <AddIcon  style={{ color: 'white' }} fontSize='default' />
                            &nbsp;&nbsp;&nbsp;Thêm mới&nbsp;&nbsp;
                        </Button>
                    </Tooltip>
            </Grid> */}
            {nextLine}
            <MaterialTable
                title="Danh sách kỳ thi"
                columns={columns}
                data={quizTestList}
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
                    pageSize: 8,
                    tableLayout: "fixed"
                }}
                style={{
                    fontSize: 16
                }}

                actions={[
                    {
                        icon: () => { 
                            return <Tooltip title="Thêm mới một kỳ thi" aria-label="Thêm mới một kỳ thi" placement="top">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { 
                                            history.push('create-quiz-test');
                                        }}
                                    >
                                        <AddIcon  style={{ color: 'white' }} fontSize='default' />
                                        &nbsp;&nbsp;&nbsp;Thêm mới&nbsp;&nbsp;
                                    </Button>
                                </Tooltip> 
                        },
                        isFreeAction: true,
                    },
                ]}
              
            />

            </CardContent>
            
        </Card>
        //</MuiThemeProvider>
    )
}

export default QuizTestList;