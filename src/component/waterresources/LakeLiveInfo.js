import React, { useEffect, useState, Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../api";
import { API_URL } from "../../config/config";
import { Card, CardContent, CardHeader, CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import Grid from "@material-ui/core/Grid";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Geocoder from "react-native-geocoding";
import { useParams } from "react-router-dom";
import MaterialTable from "material-table";
import { tableIcons } from "../../utils/iconutil";
import { Line } from "react-chartjs-2";



const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
}));

const style = {
  width: "40%",
  height: "60%",
};

function LakeLiveInfo(props) {
  const { lakeId } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);

  const classes = useStyles();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [centerLat, setCenterLat] = useState();
  const [centerLng, setCenterLng] = useState();
  const [lake, setLake] = useState({});

  const mapClicked = (mapProps, map, event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log("lat ", lat);
    console.log("lng ", lng);
    setLng(lng);
    setLat(lat);
  };

  // Table.
  const columns =[{
    field: 'attribute',
    title: 'Chỉ số'
  },
  {
    field: 'value',
    title: 'Giá trị'
  }]

  const [data, setData] = useState([])
  const [mucNuocLuKiemTraHistory, setMucNuocLuKiemTraHistory] = useState([]);
  const [luuLuongXaLuKiemTraHistory, setLuuLuongXaLuKiemTraHistory] = useState([]);

  const dataChart = {
    labels: ['1', '2', '3', '4', '5', '6','7','8','9','10'],
    datasets: [
      {
        label: 'mực nước lũ',
        data: mucNuocLuKiemTraHistory,
        fill: false,
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y-axis-1',
      },
      {
        label: '#lưu lượng xả lũ',
        data: luuLuongXaLuKiemTraHistory,
        fill: false,
        backgroundColor: 'rgb(54, 162, 235)',
        borderColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y-axis-2',
      },
    ],
  }
  
  const optionsChart = {
    scales: {
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  }
  
  useEffect(() => {
    authGet(dispatch, token, "/lake/" + lakeId).then(
      res => {
        let lakeData = res;
        setLake(lakeData);
        console.log('lake detail = ', lake);
        setCenterLat(lakeData.latitude)
        setCenterLng(lakeData.longitude)
        console.log("center = " + centerLat + "," + centerLng);
      },
    );

      ///navigator.geolocation.getCurrentPosition(position => {
        //setCenterLat(position.coords.latitude)
        //setCenterLng(position.coords.longitude)
        //setCenterLat(lake.latitude)
        //setCenterLng(lake.longitude)
        //console.log("center = " + centerLat + "," + centerLng);
      //})


    }, []
  )

  const getData = async () => {
      const res = await fetch(API_URL + "/lakeinfolive/" + lakeId, {
        method: "GET",
        headers: {
          "X-Auth-Token": token,
        },
      });

      const data = await res.json();
      console.log("GOT data " + data);
      setLake(data)
      

      //setData([{'attribute': 'Diện tích lưu vực', value: data.dienTichLuuVuc},
      //{'attribute': 'Mức đảm bảo tưới', value: data.mucDamBaoTuoi}])
    
  }

  useEffect(() => {
    try {
      var refreshIntervalId=setInterval(async () =>{
        const res = await fetch(API_URL + "/lakeinfolive/" + lakeId, {
          method: "GET",
          headers: {
            "X-Auth-Token": token,
          },
        });
  
        const data = await res.json();
        console.log("GOT data " + data);
        setLake(data.lake);
        setLuuLuongXaLuKiemTraHistory(data.luuLuongXaLuKiemTraHistory) ; 
        setMucNuocLuKiemTraHistory(data.mucNuocLuKiemTraHistory);

        //setData([{'attribute': 'Diện tích lưu vực', value: data.dienTichLuuVuc},
        //{'attribute': 'Mức đảm bảo tưới', value: data.mucDamBaoTuoi}])
      
    }, 3000);
    } catch (e) {
      console.log("FOUND exception", e);
    }

    return function cleanInterval() {
      clearInterval(refreshIntervalId);
    };
  }, []);

  //if (lake != undefined) return <div>{JSON.stringify(lake)} in {Date.now()}</div>;
  //else return <div>LIVE</div>;

  
  //if(lake != undefined)
  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          

          <Typography variant="h2" component="h2">
            {lake.lakeName}
          </Typography>
          <br/>

<Card>
  <CardHeader/>
  <CardContent>
    <Grid container md={12}>
      <Grid item md={8} direction='column'>
          <Typography > Diện tích lưu vực: </Typography>
          <Typography > Mức đảm bảo tưới:  </Typography>
          <Typography > Diện tích tưới:  </Typography>
          <Typography > Mực nước chết:  </Typography>
          <Typography > Mực nước dâng bình thường:  </Typography>
          <Typography > Mực nước lũ thiết kế:  </Typography>
          <Typography > Mực nước lũ kiểm tra:  </Typography>
          <Typography > Dung tích toàn bộ:  </Typography>
          <Typography > Dung tích hữu ích:  </Typography>
          <Typography > Dung tích chết:  </Typography>
          <Typography > Lưu lượng xả lũ thiết kế:  </Typography>
          <Typography > Lưu lượng xả lũ kiểm tra:  </Typography>
      </Grid>
      <Grid item md={4} direction='column'>
          <Typography>{lake.dienTichLuuVuc}</Typography>
          <Typography>{lake.mucDamBaoTuoi}</Typography>
          <Typography>{lake.dienTichTuoi}</Typography>
          <Typography>{lake.mucNuocChet}</Typography>
          <Typography>{lake.mucNuocDangBinhThuong}</Typography>
          <Typography>{lake.mucNuocLuThietKe}</Typography>
          <Typography>{lake.mucNuocLuKiemTra}</Typography>
          <Typography>{lake.dungTichHuuIch}</Typography>
          <Typography>{lake.dungTichChet}</Typography>
          <Typography>{lake.luuLuongXaLuThietKe}</Typography>
          <Typography>{lake.luuLuongXaLuKiemTra}</Typography>

      </Grid>
    </Grid>
  </CardContent>
</Card>
          {/*<MaterialTable
          title="Thông tin"
          columns={columns}
          data={data}
          icons={tableIcons}
          />

           <Typography variant="h8" component="h8">
            Diện tích lưu vực: {lake.dienTichLuuVuc}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Mức đảm bảo tưới: {lake.mucDamBaoTuoi}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Diện tích tưới: {lake.dienTichTuoi}
          </Typography>
          <br/>
          <Typography variant="h8" component="h8">
            Mực nước chết: {lake.mucNuocChet}
          </Typography>
          <br/>   */}

        </Grid>
        <Grid item xs={6}>
          <Map
            google={props.google}
            zoom={11}
            style={style}
            initialCenter={{
              lat: centerLat,
              lng: centerLng,
            }}
            center={{
              lat: centerLat,
              lng: centerLng,
            }}
            onClick={mapClicked}
          >
            <Marker
              title={'Geolocation'}
              position={{
                lat: lat,
                lng: lng,
              }}
            />


          </Map>
        </Grid>
        <Grid item xs={5}>
              <Card>
                <CardHeader>
                  Bieu do
                </CardHeader>
                <CardContent>
                <Line data={dataChart} options={optionsChart} />
                </CardContent>
              </Card>
        </Grid>
      </Grid>
    
    </div>
    ); 
    
    //else return <div>LIVE</div>;
    
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(LakeLiveInfo);
