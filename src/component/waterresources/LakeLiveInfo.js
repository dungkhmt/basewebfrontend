import { Card, CardContent, CardHeader } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { authGet } from "../../api";
import { API_URL } from "../../config/config";

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
/*~~~~~~~~~~~~~~need fix~~~~~~~~~~*/
const style = {
  marginTop: "26px",
  width: "46.8%",
  height: "360px",
};

function LakeLiveInfo(props) {
  const { lakeId } = useParams();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  // const [isRequesting, setIsRequesting] = useState(false);

  const classes = useStyles();
  const [lake, setLake] = useState({});

  /*const mapClicked = (mapProps, map, event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("lat ", lat);
        console.log("lng ", lng);
        setLng(lng);
        setLat(lat);
    };*/

  // Table.
  // const columns = [
  //   {
  //     field: "attribute",
  //     title: "Chỉ số",
  //   },
  //   {
  //     field: "value",
  //     title: "Giá trị",
  //   },
  // ];

  // const [data, setData] = useState([]);
  const [mucNuocLuKiemTraHistory, setMucNuocLuKiemTraHistory] = useState([]);
  const [luuLuongXaLuKiemTraHistory, setLuuLuongXaLuKiemTraHistory] = useState(
    []
  );

  const dataChart = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        label: "mực nước lũ",
        data: mucNuocLuKiemTraHistory,
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
        yAxisID: "y-axis-1",
      },
      {
        label: "#lưu lượng xả lũ",
        data: luuLuongXaLuKiemTraHistory,
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.2)",
        yAxisID: "y-axis-2",
      },
    ],
  };

  const optionsChart = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  };

  useEffect(() => {
    authGet(dispatch, token, "/lake/" + lakeId).then((res) => {
      //res is lakeData
      setLake(res);
    });
  }, []);

  const getData = async () => {
    const res = await fetch(API_URL + "/lakeinfolive/" + lakeId, {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
      },
    });

    const data = await res.json();
    console.log("GOT data " + data);
    setLake(data);

    //setData([{'attribute': 'Diện tích lưu vực', value: data.dienTichLuuVuc},
    //{'attribute': 'Mức đảm bảo tưới', value: data.mucDamBaoTuoi}])
  };

  useEffect(() => {
    try {
      var refreshIntervalId = setInterval(async () => {
        const res = await fetch(API_URL + "/lakeinfolive/" + lakeId, {
          method: "GET",
          headers: {
            "X-Auth-Token": token,
          },
        });

        const data = await res.json();
        console.log("GOT data " + data);
        setLake(data.lake);
        setLuuLuongXaLuKiemTraHistory(data.luuLuongXaLuKiemTraHistory);
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
  return (
    <div>
      <Grid container spacing={5}>
        <Grid item xs={5}>
          <Typography variant="h2" component="h2">
            {lake.lakeName}
          </Typography>
          <br />

          <Card>
            <CardHeader />
            <CardContent>
              <Grid container md={12}>
                <Grid item md={8} direction="column">
                  <Typography> Diện tích lưu vực: </Typography>
                  <Typography> Mức đảm bảo tưới: </Typography>
                  <Typography> Diện tích tưới: </Typography>
                  <Typography> Mực nước chết: </Typography>
                  <Typography> Mực nước dâng bình thường: </Typography>
                  <Typography> Mực nước lũ thiết kế: </Typography>
                  <Typography> Mực nước lũ kiểm tra: </Typography>
                  <Typography> Dung tích toàn bộ: </Typography>
                  <Typography> Dung tích hữu ích: </Typography>
                  <Typography> Dung tích chết: </Typography>
                  <Typography> Lưu lượng xả lũ thiết kế: </Typography>
                  <Typography> Lưu lượng xả lũ kiểm tra: </Typography>
                </Grid>
                <Grid item md={4} direction="column">
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
        </Grid>
        <Grid item xs={6}>
          <Grid container justify="flex-end">
            <Button
              color={"primary"}
              variant={"contained"}
              style={{ marginTop: "30px" }}
              onClick={() =>
                history.push({
                  pathname: "/lake/edit/" + lakeId,
                  state: { lake },
                })
              }
            >
              Chỉnh sửa
            </Button>
          </Grid>
          <Map
            google={props.google}
            zoom={11}
            style={style}
            center={{
              lat: lake.latitude,
              lng: lake.longitude,
            }}
          >
            <Marker
              position={{
                lat: lake.latitude,
                lng: lake.longitude,
              }}
            />
          </Map>
        </Grid>
        <Grid item xs={5}>
          <Card>
            <CardHeader>Bieu do</CardHeader>
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
