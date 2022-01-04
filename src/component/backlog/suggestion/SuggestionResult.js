import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import "chartjs-plugin-datalabels";
import MaterialTable from "material-table";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../../api";
import { localization } from "../../../utils/MaterialTableUtils";
import { TASK_STATUS } from "../BacklogConfig";
import UserItem from "../components/UserItem";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDialogContent-root": {
      padding: "0px",
      minWidth: "720px",
      maxWidth: "70vw",
      height: "720px",
    },
    "& .MuiDialog-paperWidthXs, .MuiDialog-paperWidthMd, .MuiDialog-paperWidthSm, .MuiDialog-paperWidthLg":
      {
        maxWidth: "100%",
        maxHeight: "100%",
      },
  },
}));

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

export default function SuggestionResult(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const {
    open,
    onClose,
    suggestData,
    setSuggestChartData,
    suggestChartData,
    setSuggestData,
    applyCallback,
  } = props;

  const suggestionChartOpt = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Khối lượng công việc (Ngày)",
            fontSize: 13,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: function (context) {
          return context.dataset.data[context.dataIndex] !== 0;
        },
      },
    },
  };

  const resultColumns = [
    { title: "Công việc", field: "taskName", editable: "never" },
    {
      title: "Phân công",
      field: "assign",
      render: (rowData) => {
        return rowData.assign ? (
          <Select
            value={rowData.assign ? rowData.assign.partyId : ""}
            onChange={(event) => {
              handleChangeAssign(event, rowData.tableData.id);
            }}
            style={{ width: "250px" }}
          >
            {rowData.assignable.map((item) => (
              // <MenuItem key={item.partyId} value={item.partyId}>{item.userLoginId}</MenuItem>
              <MenuItem key={item.partyId} value={item.partyId}>
                <UserItem user={item} />
              </MenuItem>
            ))}
          </Select>
        ) : null;
      },
      customFilterAndSearch: (value, rowData) => {
        if (rowData.assign == null) return false;
        value = value.toLowerCase();
        const user = rowData.assignable.find(
          (e) => e.partyId === rowData.assign.partyId
        );
        const fullName = (
          user.person
            ? user.person.firstName +
              " " +
              user.person.middleName +
              " " +
              user.person.lastName
            : ""
        ).toLowerCase();
        if (fullName.includes(value) || user.userLoginId.includes(value))
          return true;
      },
    },
  ];

  const onChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handleChangeAssign = (event, rowIndex) => {
    let data = [...suggestData];
    let labels = suggestChartData.labels;
    let chartData = [...suggestChartData.datasets[0].data];

    const taskHasChanged = data[rowIndex];
    const newAssign = data[rowIndex].assignable.find(
      (e) => e.partyId === event.target.value
    ).userLoginId;

    let newIndex = labels.findIndex((e) => e === newAssign);
    console.log(newIndex, newAssign);
    if (newIndex < 0) {
      newIndex = labels.length;
      labels.push(newAssign);
      chartData.push(0);
    }
    let oldIndex = labels.findIndex(
      (e) => e === taskHasChanged.assign.userLoginId
    );
    chartData[oldIndex] = chartData[oldIndex] - taskHasChanged.duration;
    chartData[newIndex] = chartData[newIndex] + taskHasChanged.duration;

    labels = labels.filter((e, index) => chartData[index] > 0);
    chartData = chartData.filter((e) => e > 0);

    console.log(labels, chartData);

    setSuggestChartData({
      ...suggestChartData,
      labels: labels,
      datasets: [{ ...suggestChartData.datasets[0], data: chartData }],
    });

    data[rowIndex].assign = data[rowIndex].assignable.find(
      (e) => e.partyId === event.target.value
    );
    setSuggestData(data);
  };

  const applySuggestion = () => {
    let addAssignmentBody = [];
    suggestData.forEach((e) => {
      addAssignmentBody.push({
        backlogTaskId: e.taskId,
        assignedToPartyId: [e.assign.partyId],
        statusId: TASK_STATUS.DEFAULT_ID_ASSIGNED,
      });
    });
    // console.log(addAssignmentBody);
    authPost(
      dispatch,
      token,
      "/backlog/add-multi-task-assignments",
      addAssignmentBody
    );

    // clear data
    setSuggestData({});
    setSuggestChartData({});
    onClose();
    applyCallback();
  };

  return (
    <Dialog
      // fullScreen
      className={classes.root}
      open={open}
      onClose={onClose}
      disableBackdropClick={true}
    >
      <DialogContent>
        <AppBar position="sticky" color="primary">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" style={{ flex: 1 }}>
              Kết quả gợi ý phân công
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={applySuggestion}
            >
              Phê duyệt
            </Button>
          </Toolbar>
          <Tabs
            value={tab}
            onChange={onChangeTab}
            style={{ backgroundColor: "#757ce8" }}
          >
            <Tab label="Bảng kết quả" />
            <Tab label="Biểu đồ" />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <MaterialTable
            title="Kết quả gợi ý"
            columns={resultColumns}
            data={suggestData}
            options={{ search: false, filtering: true, thirdSortClick: false }}
            localization={localization}
          />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Bar
            data={suggestChartData}
            width={100}
            height={50}
            options={suggestionChartOpt}
          />
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}
