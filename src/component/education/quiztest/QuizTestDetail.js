import React, { useState, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet, authPostMultiPart, request } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import {
    Button, Card, CardActions, CardContent, TextField, Typography, IconButton,
    MenuItem, Checkbox, Grid, Tooltip, Tab, Tabs, Box
} from "@material-ui/core/";
import { makeStyles, useTheme } from '@material-ui/core/styles';

import PropTypes from 'prop-types';
//import SwipeableViews from 'react-swipeable-views';


const nextLine = 
<pre>
</pre>

const lineBreak = 
<pre style={{userSelect: "none"}}>{
  ' '
}</pre>;

const styles = {
    label: {
        fontSize: "20px", 
        fontWeight: "lighter",
    },

    descStyle: {
        fontSize: "20px",
        fontWeight: "lighter",
    },

    ansStyle: {
        fontSize: "18px",
        fontWeight: "lighter",
        paddingTop: "15px",
        paddingBottom: "30px",
        paddingLeft: "30px"
    },

    subAnsStyle: {
        fontSize: "18px",
        fontWeight: "lighter",
        paddingBottom: "10px"
    },

    tabStyle: {
        //border: '1px solid',
        borderStyle: 'none solid none none',
        borderWidth: '3px',
        borderColor: 'whitesmoke',
        color: 'black',
        backgroundColor: 'rgb(230, 230, 230)',
        fontSize: 16
    }
};

const tempTestInfo = {
    'testId': 'DTS01',
    'testName': 'Đề thi số 01',
    'scheduleDatetime': '2021-05-14T21:56:52.668',
    'duration': 90,
    'courseId': 'courseId',
    'classId': '123456'
};

const tempCourseInfo = {
    'id': 'IT3011',
    'courseName': 'Cấu trúc dữ liệu và giải thuật',
    'credit': '3'
}

const tempStudentList = [
    {
        'MSSV': '20180000',
        'name': 'Nguyễn Văn A',
        'emal': 'abcAAA@gmail.com'
    },
    {
        'MSSV': '20180001',
        'name': 'Nguyễn Văn B',
        'emal': 'abcBBB@gmail.com'
    },
    {
        'MSSV': '20180002',
        'name': 'Nguyễn Văn C',
        'emal': 'abcCCC@gmail.com'
    },
    {
        'MSSV': '20180003',
        'name': 'Nguyễn Văn D',
        'emal': 'abcDDD@gmail.com'
    },
]

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
    >
        {value === index && (
        <Box p={3}>
            <Typography>{children}</Typography>
        </Box>
        )}
    </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

export default function QuizTestDetail(props) {
    let param = useParams();

    const history = useHistory();
    //const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);

    const [studentList, setStudentList] = useState([]);
    const [testInfo, setTestInfo] = useState([]);
    const [courseInfo, setCourseInfo] = useState([]);

    const [tab, setTab] = React.useState(0);
    const theme = useTheme();

    const handleChangeTab = (event, newValue) => {
        setTab(newValue);
    };

    const handleChangeIndex = (index) => {
        setTab(index);
    };

    async function getQuizTestDetail() {
        //do something to get test info from param.id
        tempTestInfo.scheduleDatetime = tempTestInfo.scheduleDatetime.replace('T', ' ');
        let index = tempTestInfo.scheduleDatetime.indexOf('.');
        if(index != -1)
            tempTestInfo.scheduleDatetime 
            = tempTestInfo.scheduleDatetime.substring(0, index);
            
        setTestInfo(tempTestInfo);

        //do something to get course info from testInfo.courseId
        setCourseInfo(tempCourseInfo);

        //do something to get studentList from testInfo.testId
        setStudentList(tempStudentList);

        request(token, history,"GET", '/get-all-student-in-test?testId=\'' + param.id + '\'', (res) => {
            console.log(res)
        })

        /* let students = await authGet(dispatch, token, '/get-all-student-in-test?testId=\'' + param.id + '\'');
        console.log(students) */
        
    }

    useEffect(() => {
        getQuizTestDetail();
        return () => {
          
        }
    }, []);



    return (
        <div>
            QuizTestDetail
            {param.id}
            <Card>
                <CardContent style={{padding: '8% 5% 5% 5%'}}> 
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >

                        <Grid item xs={2} >
                            <div style={styles.label}>Tên kỳ thi:</div>
                        </Grid>

                        <Grid item xs={3}>
                            <div style={styles.label}><strong>{testInfo.testName}</strong></div>
                        </Grid>

                        <Grid item xs={7}>
                            <div style={styles.label}>Môn học:&nbsp;
                                <strong>{courseInfo.id + ' - ' + courseInfo.courseName}</strong>
                            </div>
                        </Grid>
                    </Grid>
                    {nextLine}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Grid item xs={2}>
                            <div style={styles.label}>Bắt đầu:</div>
                        </Grid>

                        <Grid item xs={3}>
                            <div style={styles.label}>
                                <strong>{testInfo.scheduleDatetime}</strong>
                            </div>
                        </Grid>

                        <Grid item xs={7}>
                        </Grid>
                    </Grid>
                    {nextLine}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Grid item xs={2}>
                            <div style={styles.label}>Thời gian làm bài:</div>
                        </Grid>

                        <Grid item xs={3}>
                            <div style={styles.label}><strong>{testInfo.duration}&nbsp;phút</strong></div>
                        </Grid>

                    </Grid>
                    {lineBreak}
                    {lineBreak}
                    <Tabs
                        value={tab}
                        onChange={handleChangeTab}
                        indicatorColor="primary"
                        textColor="primary"
                        variant='standard'
                        aria-label="full width tabs example"
                        //variant="scrollable"
                        scrollButtons="auto"
                        style={{
                            //backgroundColor: 'rgb(240, 240, 240)',
                            borderWidth: '1px',
                            borderLeftStyle: 'solid',
                            borderColor: styles.tabStyle.borderColor,
                            marginLeft: '-1px',
                            
                            //backgroundColor: 'rgb(25, 118, 210)'
                        }}
                    >
                        <Tab label="Thí sinh" {...a11yProps(0)} style={styles.tabStyle}/>
                        <Tab label="Thí sinh đăng ký" {...a11yProps(1)} style={styles.tabStyle}/>
                        <Tab label="Đề" {...a11yProps(2)} 
                            style={{
                                ...styles.tabStyle,
                                minWidth: 135,
                            }} 
                        />
                        <Tab label="Phân đề cho thí sinh" {...a11yProps(3)} style={styles.tabStyle}/>
                        <Tab label="Đề chưa được phân" {...a11yProps(4)} style={styles.tabStyle}/>
                        <Tab label="Kết quả" {...a11yProps(5)} style={styles.tabStyle}/>
                    </Tabs>
                    
                    <TabPanel value={tab} index={0} dir={theme.direction}>
                        Thí sinh
                    </TabPanel>
                    <TabPanel value={tab} index={1} dir={theme.direction}>
                        Thí sinh đăng ký
                    </TabPanel>
                    <TabPanel value={tab} index={2} dir={theme.direction}>
                        Đề
                    </TabPanel>
                    <TabPanel value={tab} index={3} dir={theme.direction}>
                        Phân đề cho thí sinh
                    </TabPanel>
                    <TabPanel value={tab} index={4} dir={theme.direction}>
                        Những đề chưa được phân
                    </TabPanel>
                    <TabPanel value={tab} index={5} dir={theme.direction}>
                        Kết quả
                    </TabPanel>
                    
                </CardContent>
            </Card>
        </div>
    )
}