import React, {useEffect, useState} from "react";
import {HorizontalBar} from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import {authPost} from "../api";
import {useDispatch, useSelector} from "react-redux";

export default function Home(props) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const [vehicle, setVehicle] = useState([]);
  const [distance, setDistance] = useState([]);

  const [dateRevenue, setDateRevenue] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };

  const dataRevenue = {
    labels: dateRevenue,
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: revenue
      }
    ]
  };

  const dataVehicleDistance = {
    labels: vehicle,
    datasets: [
      {
        label: 'Distance of vehicle',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: distance
      }
    ]
  };


  function getRevenueDateRecent() {
    console.log("getRevenueDateRecent");
    authPost(dispatch, token, '/report-date-based-revenue-recent', {"nbDays": 15}
    ).then(
      response => response.json()
    ).then(response => {
      console.log('response = ', response);
      let listRev = response.revenueElements;
      //setVehicleDistance(response);
      let arrDates = [];
      let arrRevenues = [];
      listRev.forEach(r => {
        arrDates.push(r.date);
        arrRevenues.push(r.revenue);
      });
      setDateRevenue(arrDates);
      setRevenue(arrRevenues);
      //dataVehicleDistance.labels = vehicle;
      //dataVehicleDistance.datasets[0].data = distance;
      //console.log('dataVehicleDistance.vehicle = ', dataVehicleDistance.labels);
      //console.log('dataVehicleDistance.distance = ', dataVehicleDistance.datasets[0].data);
      console.log('revenue = ', revenue);
    }).catch(console.log);


  }

  function getVehicleDistance() {
    console.log("getVehicleDistance");
    authPost(dispatch, token, '/statistic-vehicle-distance', {"fromDate": "", "thruDate": ""}
    ).then(
      response => response.json()
    ).then(response => {
      console.log('response = ', response);
      //setVehicleDistance(response);
      let vehicle = [];
      let distance = [];
      response.forEach(vh => {
        vehicle.push(vh.vehicleId);
        distance.push(vh.distance);
      });
      setVehicle(vehicle);
      setDistance(distance);
      //dataVehicleDistance.labels = vehicle;
      //dataVehicleDistance.datasets[0].data = distance;
      console.log('dataVehicleDistance.vehicle = ', dataVehicleDistance.labels);
      console.log('dataVehicleDistance.distance = ', dataVehicleDistance.datasets[0].data);
    }).catch(console.log);

  }

  useEffect(() => {
    getVehicleDistance();
    getRevenueDateRecent();
  }, []);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h2>Thống kê doanh số</h2>
          <HorizontalBar data={dataRevenue}/>
        </Grid>
        <Grid item xs={6}>
          <h2>Thống kê khoảng cách di chuyển các xe</h2>
          <HorizontalBar data={dataVehicleDistance}/>
        </Grid>
      </Grid>
    </div>
  );


}
