import {
    Button, Card, CardActions, CardContent, TextField, Typography, IconButton,
    MenuItem, Checkbox, Grid, Tooltip
  } from "@material-ui/core/";
import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MaterialTable from "material-table";
//import IconButton from '@material-ui/core/IconButton';
import { withStyles, makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Delete } from "@material-ui/icons";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

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

let count = 0;

export default function QuizTestGroupList(props) {

    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [selectedAll, setSelectedAll] = useState(false);

    const theme = createMuiTheme({
        palette: {
            primary: green,
        },
    });

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
            width: "40%"
        },
        {
            field: "numStudent",
            title: "Số sinh viên",
            ...headerProperties,
            type: 'numeric',
        },
        {
            field: "numQuestion",
            title: "Số câu hỏi",
            ...headerProperties,
            type: 'numeric',
        },
        {
            field: "selected",
            title: "    Chọn",
            ...headerProperties,
            width: "10%",
            type: 'numeric',
            render: (rowData) => (
                <Checkbox checked={rowData.selected} onChange={(e) => {
                    rowData.selected = e.target.checked; 
                    if(rowData.selected == false)
                    {
                        count--;
                        setSelectedAll(false);
                    }
                    else
                    {
                        count++;
                    }
                    if(count == groupList.length)
                    {
                        setSelectedAll(true);
                    }
                    forceUpdate();
                }}/>
            ),
            
        },
        
    ]

    let testId = props.testId;

    const [groupList, setGroupList] = useState([]);

    async function getStudentList() {
        request(token, history,"GET", '/get-test-groups-info?testId=' + testId, (res) => {
            let temp = [];
            res.data.map((elm, index) => {
                temp.push({ groupCode : elm.groupCode, note: elm.note, 
                    numStudent: elm.numStudent, numQuestion: elm.numQuestion,
                    quizGroupId: elm.quizGroupId,
                    selected: false });
            })
            setGroupList(temp);
            console.log(res.data);
        })
        count = 0;
    }

    const handleGenerateQuizGroup = (e) => {
        //alert("Thêm đề");
        let datasend = {'quizTestId' : testId,'numberOfQuizTestGroups':1}
        request(
            token,
            history,
            "post",
            "generate-quiz-test-group",
            (res) => {
                console.log(res);
                alert("Thêm đề thành công");
            },
            { 401: () => {} },
            datasend
          );  
        console.log(datasend)

    }

    const handleDeleteQuizGroup = (e) => {

        if(!window.confirm('Bạn có chắc muốn xóa những đề thi này không ???')) {
            return;
        }

        let acceptList = [];
        groupList.map((v, i) => {
            if(v.selected == true) {
                acceptList.push(v.quizGroupId);
            }
        })
        

        if(acceptList.length != 0) {
            let result = -1;
            let formData = new FormData();
            formData.append("testId", testId);
            formData.append("quizTestGroupList", acceptList.join(';'));
            request(token, history, "POST", "/delete-quiz-test-groups", 
                (res) => {
                    result = res.data;

                    if(result >= 0) {
                        let temp = groupList.filter( (el) => !acceptList.includes(el.userLoginId) );
                        setGroupList(temp);
                        count = 0;
                    }

                }, 
                {}, 
                formData
            );
        }
    }

    useEffect(() => {
        getStudentList();
        return () => {
          
        }
    }, []);

    return(
        <div style={{width: '105%', marginLeft: '-2.5%'}}>
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
                    pageSize: 8,
                    tableLayout: "fixed",
                    //selection: true
                }}
                style={{
                    fontSize: 16
                }}

                actions={[
                    {
                        icon: () => { 
                            return <Tooltip title="Thêm đề mới" 
                                        aria-label="Thêm đề mới" placement="top">
                                    <ThemeProvider theme={theme} style={{color: 'white'}}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => { 
                                                handleGenerateQuizGroup(e);
                                            }}
                                            style={{ color: 'white' }}
                                        >
                                            <AddCircleOutlineIcon style={{ color: 'white' }} fontSize='default' />
                                            &nbsp;&nbsp;&nbsp;Thêm đề&nbsp;&nbsp;
                                        </Button>
                                    </ThemeProvider>
                                </Tooltip> 
                        },
                        isFreeAction: true,
                    },
                    {
                        icon: () => { 
                            return <Tooltip title="Xóa đề được chọn" 
                                        aria-label="Xóa đề được chọn" placement="top">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={(e) => { 
                                            handleDeleteQuizGroup(e);
                                        }}
                                    >
                                        <Delete  style={{ color: 'white' }} fontSize='default' />
                                        &nbsp;&nbsp;&nbsp;Xóa&nbsp;&nbsp;
                                    </Button>
                                </Tooltip> 
                        },
                        isFreeAction: true,
                    },
                    {
                        icon: () => { 
                            return <Tooltip title="Chọn tất cả" 
                                        aria-label="Chọn tất cả" placement="top">

                                        <Checkbox checked={selectedAll} onChange={(e) => {
                                            let tempS = e.target.checked;
                                            setSelectedAll(e.target.checked);

                                            if(tempS) count = groupList.length;
                                            else count = 0;

                                            groupList.map((value, index) => {
                                                value.selected = tempS;
                                            })
                                        }}/>
                                        {/* <div>&nbsp;&nbsp;&nbsp;Chọn tất cả&nbsp;&nbsp;</div> */}
                                            
                                </Tooltip> 
                        },
                        isFreeAction: true,
                    },
                ]}
              
            />
        </div>
    )
}