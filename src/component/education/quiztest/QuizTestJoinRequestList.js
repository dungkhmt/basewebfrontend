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

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

const theme = createMuiTheme({
    palette: {
        primary: green,
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

export default function QuizTestJoinRequest(props) {

    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const [selectedAll, setSelectedAll] = useState(false);

    const columns = [
        {
            field: "userLoginId",
            title: "MSSV",
            ...headerProperties,
        },
        {
            field: "fullName",
            title: "Họ và tên",
            ...headerProperties,
            width: "40%"
        },
        {
            field: "email",
            title: "Email",
            ...headerProperties
        },
        {
            field: "selected",
            title: "Chọn",
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
                    if(count == studentList.length)
                    {
                        setSelectedAll(true);
                    }
                    forceUpdate();
                }}/>
            ),
            
        },
        
    ]

    let testId = props.testId;

    const [studentList, setStudentList] = useState([]);

    async function getStudentList() {
        request(token, history,"GET", '/get-all-student-in-test?testId=\'' + testId + '\'', (res) => {
            let temp = [];
            res.data.map((elm, index) => {
                if(elm.statusId == 'STATUS_REGISTERED')
                    temp.push({ userLoginId : elm.userLoginId, fullName: elm.fullName, email: elm.email, selected: false });
            })
            setStudentList(temp);
        })
        count = 0;
    }

    const handleAcceptStudent = (e) => {
        let acceptList = [];
        studentList.map((v, i) => {
            if(v.selected == true) {
                acceptList.push(v.userLoginId);
            }
        })
        

        if(acceptList.length != 0) {
            let result = -1;
            let formData = new FormData();
            formData.append("testId", testId);
            formData.append("studentList", acceptList.join(';'));
            request(token, history, "POST", "/accept-students-in-test", 
                (res) => {
                    result = res.data;

                    if(result >= 0) {
                        let temp = studentList.filter( (el) => !acceptList.includes(el.userLoginId) );
                        setStudentList(temp);
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
                data={studentList}
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
                            return <Tooltip title="Loại thí sinh khỏi kì thi" 
                                        aria-label="Loại thí sinh khỏi kì thi" placement="top">
                                    <ThemeProvider theme={theme} style={{color: 'white'}}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => { 
                                                handleAcceptStudent(e);
                                            }}
                                            style={{ color: 'white' }}
                                        >
                                            <CheckCircleOutlineIcon  style={{ color: 'white' }} fontSize='default' />
                                            &nbsp;&nbsp;&nbsp;Phê duyệt&nbsp;&nbsp;
                                        </Button>
                                    </ThemeProvider>
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

                                            if(tempS) count = studentList.length;
                                            else count = 0;

                                            studentList.map((value, index) => {
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