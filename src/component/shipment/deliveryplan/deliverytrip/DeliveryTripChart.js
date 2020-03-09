import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {HorizontalBar} from "react-chartjs-2";
import {authGet, authPost} from "../../../../api";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function DeliveryTripChart() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const {deliveryPlanId} = useParams();

  const [deliveryTripInfo,] = useState({});

  const [weightRateData,] = useState([]);
  const [distanceData,] = useState([]);

  const [, rerender] = useState([]);

  function getAllDeliveryTrips() {
    authGet(dispatch, token, '/delivery-trip/' + deliveryPlanId + '/all').then(response => {
      response.map(e => deliveryTripInfo[e['deliveryTripId']] = {});
      getAllDeliveryTripInfo();
    }).catch(console.log);
  }

  function getAllDeliveryTripInfo() {
    authPost(dispatch, token, '/delivery-trips/chart-info',
      Object.keys(deliveryTripInfo)).then(response => response.json()).then(response => {
      response.forEach(deliveryTrip => {
        let id = deliveryTrip['deliveryTripId'];
        deliveryTripInfo[id]['totalDistance'] = deliveryTrip['totalDistance'];
        deliveryTripInfo[id]['capacity'] = deliveryTrip['maxVehicleCapacity'];
        deliveryTripInfo[id]['totalWeight'] = deliveryTrip['totalWeight'];
        deliveryTripInfo[id]['vehicleId'] = deliveryTrip['vehicleId'];
      });
      initData();
    }).catch(console.log);
  }

  function initData() {
    Object.keys(deliveryTripInfo).forEach(id => {
      let deliveryTrip = deliveryTripInfo[id];
      weightRateData.push({
        label: deliveryTrip['vehicleId'], value: deliveryTrip['totalWeight'] / deliveryTrip['capacity']
      });
      distanceData.push({
        label: deliveryTrip['vehicleId'], value: deliveryTrip['totalDistance']
      });
    });
    rerender([]);
  }

  useEffect(() => {
    getAllDeliveryTrips();
  }, []);

  return <div>
    {
      <Link to={'/delivery-plan/' + deliveryPlanId}>
        <Button variant={'outlined'} startIcon={<ArrowBackIosIcon/>}>
          Back</Button>
      </Link>
    }
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <HorizontalBarChart
          data={weightRateData}
          datasetLabel={'Tỉ lệ lấp đầy tải trọng xe các chuyến'}
        />
      </Grid>
      <Grid item xs={6}>
        <HorizontalBarChart
          data={distanceData}
          datasetLabel={'Tổng quãng đường di chuyển các chuyến'}
        />
      </Grid>
    </Grid>
  </div>;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function convertHex(hex, opacity) {
  hex = hex.substring(1);
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

function HorizontalBarChart(props) {
  const {
    data = [{
      label: '',
      value: 0,
    }],
    datasetLabel = null,
    bodyWidth = 1
  } = props;

  const [chartData, setChartData] = useState({});

  function initChartData() {
    let backgroundColors = [];
    let borderColors = [];
    for (let i = 0; i < data.length; i++) {
      let color = getRandomColor();
      backgroundColors.push(convertHex(color, 0.2));
      borderColors.push(convertHex(color, 1));
    }
    console.log(backgroundColors);
    setChartData(
      {
        labels: data.map(e => e['label']),
        datasets: [{
          data: data.map(e => e['value']),
          label: datasetLabel,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: bodyWidth
        }]
      }
    );
  }

  useEffect(() => {
    initChartData();
  }, [props]);

  const options = {
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  return (
    <div>
      <HorizontalBar data={chartData} options={options}/>
    </div>
  );
}