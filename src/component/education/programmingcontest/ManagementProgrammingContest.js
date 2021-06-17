import { CardContent } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { authGet } from "../../../api";
import ContestTable from "./ContestTable";
import ContestUserProblemTable from "./ContestUserProblemTable";
import ProgrammingContestUserRegistrationTable from "./ProgrammingContestUserRegistrationTable";
import ProgramSubmissionTable from "./ProgramSubmissionTable";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ManagementProgrammingContest() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [problems, setProblems] = useState([]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //const [programSubmissions, setProgramSubmissions] = useState([]);

  /*
    const columnSubmissions = [
      { title: 'ID bài tập', field: 'problemId', 
        render: rowData => (
          <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
          {rowData["problemId"]}
          </Link>
        )
      },
      { title: 'Tên bài tập', field: 'problemName' },
      { title: 'Người nộp', field: 'submittedByUserLoginId' },
      { title: 'Thời gian nộp', field: 'createdStamp' },      
      { title: 'ID', field: 'contestProgramSubmissionId', 
        render: rowData => (
          <Link to={"/edu/contest-program-submission/detail/" + rowData["contestProgramSubmissionId"]}>
          {rowData["contestProgramSubmissionId"]}
          </Link>
        )
      },
    ];
    */

  const columns = [
    {
      title: "ID bài tập",
      field: "problemId",
      render: (rowData) => (
        <Link to={"/edu/contest-problem/detail/" + rowData["problemId"]}>
          {rowData["problemId"]}
        </Link>
      ),
    },
    { title: "Tên bài tập", field: "problemName" },
    { title: "Level", field: "levelId" },
    { title: "Thể loại", field: "categoryId" },
  ];

  async function getContestProblemList() {
    let problemList = await authGet(dispatch, token, "/contest-problem-list");
    setProblems(problemList);
    console.log(problemList);
  }
  /*
    async function getContestProgramSubmissionList(){
      let submissions = await authGet(dispatch, token, '/get-all-contest-program-submissions');
      setProgramSubmissions(submissions);
     
    }
    */

  useEffect(() => {
    getContestProblemList();
    //getContestProgramSubmissionList();
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Contests" {...a11yProps(0)} />
          <Tab label="User registration" {...a11yProps(1)} />
          <Tab label="Standing" {...a11yProps(2)} />
          <Tab label="Submissions" {...a11yProps(3)} />
          <Tab label="Problems" {...a11yProps(4)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <ContestTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProgrammingContestUserRegistrationTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ContestUserProblemTable />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <ProgramSubmissionTable />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <CardContent>
          <MaterialTable
            title={"Danh sách Bài"}
            columns={columns}
            data={problems}
            actions={[
              {
                icon: () => {
                  return <AddIcon color="primary" fontSize="large" />;
                },
                tooltip: "Thêm bài thi",
                isFreeAction: true,
                onClick: () => {
                  history.push("create-contest-problem");
                },
              },
            ]}
          />
        </CardContent>
      </TabPanel>
    </div>
  );
}

export default ManagementProgrammingContest;
