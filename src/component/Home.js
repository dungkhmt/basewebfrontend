import { Box, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Doughnut, HorizontalBar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authPost, request } from "../api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 1030,
  },
  listSection: {
    backgroundColor: "inherit",
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0,
  },
  doughnutStyle: {
    maxHeight: 500,
    minHeight: 400,
  },
  sectionHeaderStyle: {
    color: "#666",
  },
  ganttChartStyle: {
    height: "600px",
  },
  avatar: {
    width: 36,
    height: 36,
  },
}));
const taskCounterOpt = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "Backlog",
    fontSize: 20,
    lineHeight: 1.5,
  },
  legend: {
    position: "bottom",
    align: "center",
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 10,
    },
  },
  plugins: {
    datalabels: {
      display: function (context) {
        return context.dataset.data[context.dataIndex] !== 0;
      },
    },
  },
};

export default function Home(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const taskCounterOption = taskCounterOpt;

  const [dataAllProject, setDataAllProject] = useState({});
  const [vehicle, setVehicle] = useState([]);
  const [distance, setDistance] = useState([]);

  const [dateRevenue, setDateRevenue] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const [dateStudentParticipation, setDateStudentParticipation] = useState([]);
  const [totalParticipation, setTotalParticipation] = useState([]);

  const [dateQuizParticipation, setDateQuizParticipation] = useState([]);
  const [totalQuizParticipation, setTotalQuizParticipation] = useState([]);

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  const dataRevenue = {
    labels: dateRevenue,
    datasets: [
      {
        label: "Rev.",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: revenue,
      },
    ],
  };

  const dataVehicleDistance = {
    labels: vehicle,
    datasets: [
      {
        label: "Dis.",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: distance,
      },
    ],
  };

  const dataStudentParticipation = {
    labels: dateStudentParticipation,
    datasets: [
      {
        label: "Part.",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        height: 300,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: totalParticipation,
      },
    ],
  };

  const dataQuizParticipation = {
    labels: dateQuizParticipation,
    datasets: [
      {
        label: "Quiz.",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: totalQuizParticipation,
      },
    ],
  };

  async function getStudentParticipation() {
    request(
      // token,
      // history,
      "post",
      "/get-class-participation-statistic",
      (res) => {
        let lst = res.data;
        let dates = [];
        let participations = [];

        console.log("getStudentParticipation, lst = ", lst);

        lst.forEach((r) => {
          dates.push(r.date);
          participations.push(r.count);
        });

        setDateStudentParticipation(dates);
        setTotalParticipation(participations);
      },
      { 401: () => {} },
      {
        fromDate: "",
        thruDate: "",
      }
    );
  }

  async function getQuizParticipation() {
    // // send multipart form
    // var formData = new FormData();
    // formData.append("file", null);

    // request(
    //   token,
    //   history,
    //   "post",
    //   "/get-quiz-participation-statistic",
    //   (res) => {
    //     let lst = res.data;
    //     let dates = [];
    //     let participations = [];

    //     console.log("getQuizParticipation, lst = ", lst);

    //     lst.forEach((r) => {
    //       dates.push(r.date);
    //       participations.push(r.count);
    //     });

    //     setDateQuizParticipation(dates);
    //     setTotalQuizParticipation(participations);
    //   },
    //   {},
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );
    request(
      // token,
      // history,
      "post",
      "/get-quiz-participation-statistic",
      (res) => {
        let lst = res.data;
        let dates = [];
        let participations = [];

        console.log("getQuizParticipation, lst = ", lst);

        lst.forEach((r) => {
          dates.push(r.date);
          participations.push(r.count);
        });

        setDateQuizParticipation(dates);
        setTotalQuizParticipation(participations);
      },
      { 401: () => {} },
      { fromDate: "", thruDate: "" }
    );
  }

  function getRevenueDateRecent() {
    console.log("getRevenueDateRecent");
    authPost(dispatch, token, "/report-date-based-revenue-recent", {
      nbDays: 15,
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response = ", response);
        let listRev = response.revenueElements;
        //setVehicleDistance(response);
        let arrDates = [];
        let arrRevenues = [];
        listRev.forEach((r) => {
          arrDates.push(r.date);
          arrRevenues.push(r.revenue);
        });
        setDateRevenue(arrDates);
        setRevenue(arrRevenues);
        //dataVehicleDistance.labels = vehicle;
        //dataVehicleDistance.datasets[0].data = distance;
        //console.log('dataVehicleDistance.vehicle = ', dataVehicleDistance.labels);
        //console.log('dataVehicleDistance.distance = ', dataVehicleDistance.datasets[0].data);
        console.log("revenue = ", revenue);
      })
      .catch(console.log);
  }

  function getVehicleDistance() {
    console.log("getVehicleDistance");
    authPost(dispatch, token, "/statistic-vehicle-distance", {
      fromDate: "",
      thruDate: "",
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response = ", response);
        //setVehicleDistance(response);
        let vehicle = [];
        let distance = [];
        response.forEach((vh) => {
          vehicle.push(vh.vehicleId);
          distance.push(vh.distance);
        });
        setVehicle(vehicle);
        setDistance(distance);
        //dataVehicleDistance.labels = vehicle;
        //dataVehicleDistance.datasets[0].data = distance;
        console.log(
          "dataVehicleDistance.vehicle = ",
          dataVehicleDistance.labels
        );
        console.log(
          "dataVehicleDistance.distance = ",
          dataVehicleDistance.datasets[0].data
        );
      })
      .catch(console.log);
  }
  async function getChartBackLog() {
    request(
      // token,
      // history,
      "get",
      "/backlog/get-all-dash-board",
      (res) => {
        //setTaskList(res);
        console.log(res);
        let [taskOpen, taskInprogress, taskResolved, taskclose] = [0, 0, 0, 0];
        Object.keys(res).map((key, index) => {
          // task counter data
          let listTask = res[key];
          listTask.forEach((task) => {
            switch (task.statusId) {
              case "TASK_OPEN":
                taskOpen++;
                break;
              case "TASK_INPROGRESS":
                taskInprogress++;
                break;
              case "TASK_RESOLVED":
                taskResolved++;
                break;
              case "TASK_CLOSED":
                taskclose++;
                break;
              default:
            }
          });
        });
        let data = {
          datasets: [
            {
              data: [taskOpen, taskInprogress, taskResolved, taskclose],
              backgroundColor: ["#e91e63", "#2196f3", "#4caf50", "#000000"],
              hoverBackgroundColor: [
                "#f50057",
                "#2979ff",
                "#00e676",
                "#56525c",
              ],
            },
          ],
          labels: ["Tạo mới", "Đang thực hiện", "Đã hoàn thành", "Đã đóng"],
        };
        setDataAllProject(data);
      },
      { 401: () => {} }
    );
  }
  useEffect(() => {
    getChartBackLog();
    getVehicleDistance();
    getRevenueDateRecent();
    //getStudentParticipation();
    //getQuizParticipation();
    getStudentParticipation();
    getQuizParticipation();
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h2>Cour.</h2>
          <HorizontalBar data={dataStudentParticipation} />
        </Grid>
        <Grid item xs={6}>
          <h2>Quiz.</h2>
          <HorizontalBar data={dataQuizParticipation} />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Box className={classes.doughnutStyle}>
              <Doughnut data={dataAllProject} options={taskCounterOption} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <h2>Rev.</h2>
          <HorizontalBar data={dataRevenue} />
        </Grid>
        <Grid item xs={6}>
          <h2>Dis.</h2>
          <HorizontalBar data={dataVehicleDistance} />
        </Grid>
      </Grid>
    </div>
  );
}
