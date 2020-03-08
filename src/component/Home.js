import AppBar from "@material-ui/core/AppBar";
import Collapse from "@material-ui/core/Collapse";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import StarBorder from "@material-ui/icons/StarBorder";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import SigninContainer from "../container/SignInContainer";
import {HorizontalBar} from "react-chartjs-2";
import Grid from "@material-ui/core/Grid";
import {authGet, authPost} from "../api";
import {useDispatch, useSelector} from "react-redux";

export default function Home(props) {
	const dispatch = useDispatch();
  	const token = useSelector(state => state.auth.token);

    const [vehicle, setVehicle] = useState([]);
	const [distance, setDistance] = useState([]);
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
	  
	  function getVehicleDistance(){
		console.log("getVehicleDistance");
		authPost(dispatch, token, '/statistic-vehicle-distance',{"fromDate":"","thruDate":""}
		).then(
			response => response.json()
		).then(response => {
			console.log('response = ',response);
			//setVehicleDistance(response);	
			response.forEach(vh =>{
				vehicle.push(vh.vehicleId);
				distance.push(vh.distance);
			});
			//dataVehicleDistance.labels = vehicle;
			//dataVehicleDistance.datasets[0].data = distance;
			console.log('dataVehicleDistance.vehicle = ',dataVehicleDistance.labels);
			console.log('dataVehicleDistance.distance = ',dataVehicleDistance.datasets[0].data);

		}).catch(console.log);
	
	  }
	  useEffect(() => {
		getVehicleDistance();
	  }, []);

		return (
		<div>
			<Grid container spacing={3}>
      			<Grid item xs={6}>
				  <h2>Horizontal Bar Example</h2>
        			<HorizontalBar data={data} />
     			 </Grid>
				  <Grid item xs={6}>
				  <h2>Thống kê khoảng cách di chuyển các xe</h2>
        			<HorizontalBar data={dataVehicleDistance} />
     			 </Grid>
    		</Grid>
		</div>
    );
    
	
}
