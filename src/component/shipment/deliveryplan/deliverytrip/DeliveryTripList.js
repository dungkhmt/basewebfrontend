import {Box, Button, Grid, IconButton, Paper, Table, Typography} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
  mdiArrowLeft,
  mdiCancel,
  mdiChartBar,
  mdiDeveloperBoard,
  mdiFileExcel,
  mdiReceipt,
  mdiRobotIndustrial,
  mdiTruckFast
} from "@mdi/js";
import Icon from "@mdi/react";
import MaterialTable from "material-table";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";
import {authGet} from "../../../../api";
import {toFormattedDateTime} from "../../../../utils/dateutils";
import {tableIcons} from "../../../../utils/iconutil";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2)
  },
  table: {
    minWidth: "50%",
    maxWidth: "80%"
  }
}));
export default function DeliveryTripList() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const columns = [
    // {title: "Thứ tự lời giải", field: "deliveryPlanSolutionSeqId"},
    {
      title: "Mã chuyến giao",
      field: "deliveryTripId",
      render: rowData => (
        <Link to={"/delivery-trip/" + rowData["deliveryTripId"]}>
          {rowData["deliveryTripId"]}
        </Link>
      )
    },
    {title: "Ngày thực hiện", field: "executeDate", type: "date"},
    {
      title: "Tổng khoảng cách",
      field: "totalDistance",
      render: rowData => Math.round(rowData['totalDistance'] * 100) / 100
    },
    {
      title: "Tổng khối lượng (kg)",
      field: "totalWeight",
      render: rowData => Math.round(rowData['totalWeight'] * 100000) / 100
    },
    {title: "Tổng số pallet", field: "totalPallet"},
    {title: "Tổng thời gian", field: "totalExecutionTime"},
    {title: "Tổng số điểm", field: "totalLocation"},
    {title: "Mã xe", field: "vehicleId"},
    {
      title: "Tải trọng tối đa của xe (kg)",
      field: "maxVehicleCapacity",
      render: rowData => Math.round(rowData['maxVehicleCapacity'] * 100000) / 100
    },
    {title: 'Mã trạng thái', field: 'statusId'},
    {title: "Mã tài xế", field: "userLoginId"}
  ];

  const {deliveryPlanId} = useParams();

  const [deliveryPlan, setDeliveryPlan] = useState(null);

  const getDeliveryPlanInfo = () => {
    authGet(dispatch, token, "/delivery-plan/" + deliveryPlanId).then(
      response =>
        setDeliveryPlan({
          deliveryPlanId,
          deliveryPlanDate: toFormattedDateTime(response["deliveryDate"]),
          description: response["description"],
          createdByUserLoginId: response["createdByUserLoginId"],
        })
    );
  };

  const [dataTable, setDataTable] = useState([]);

  const [deliveryPlanDetailInfo, setDeliveryPlanDetailInfo] = useState({});

  async function getDataTable() {
    const [dataTable, allShipmentItems] = await Promise.all(
      [authGet(dispatch, token, "/delivery-trip/" + deliveryPlanId + "/all"),
        authGet(dispatch, token, "/shipment-item-delivery-plan/" + deliveryPlanId + "/all")]);
    setDataTable(dataTable);

    let totalWeight = 0;
    allShipmentItems.forEach(shipmentItem => totalWeight += shipmentItem['weight']);
    totalWeight = Math.round(totalWeight * 100000) / 100;

    let totalWeightScheduled = 0;
    dataTable.forEach(deliveryTrip => totalWeightScheduled += deliveryTrip['totalWeight']);
    totalWeightScheduled = Math.round(totalWeightScheduled * 100000) / 100;

    setDeliveryPlanDetailInfo({numberTrips: dataTable.length, totalWeight, totalWeightScheduled});
  }

  const [solveWaiting, setSolveWaiting] = useState(false);

  useEffect(() => {
    getDeliveryPlanInfo();
    getDataTable().then(r => r);
  }, []);

  function handleSolve() {
    setSolveWaiting(true);
    authGet(dispatch, token, "/solve/" + deliveryPlanId).then(response => {
      if (!response) {
        alert("Đã có lỗi xảy ra...");
      }
      setSolveWaiting(false);
      window.location.reload();
    }).catch(console.log);
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h5" component="h2" align="left">
              Chi tiết đợt giao hàng {deliveryPlanId}
              <IconButton
                size="small"
                style={{float: "left"}}
                onClick={() => history.push("/delivery-plan-list")}
              >
                <Icon
                  path={mdiArrowLeft}
                  title="Danh sách đợt giao hàng"
                  size={1}
                />
              </IconButton>
              <IconButton
                style={{float: "right"}}
                //onClick={() => handlePopup(true)}
                onClick={() =>
                  history.push(
                    '/vehicle-delivery-plan/' + deliveryPlanId + '/list'
                  )
                }
                component="span"
              >
                <Icon path={mdiTruckFast} title="Danh sách xe" size={1}/>
              </IconButton>
              <IconButton
                style={{float: "right"}}
                onClick={() =>
                  history.push(
                    "/shipment-item-delivery-plan/" + deliveryPlanId + "/list"
                  )
                }
                component="span"
              >
                <Icon
                  path={mdiReceipt}
                  title="Danh sách đơn hàng"
                  size={1}
                  color="blue"
                />
              </IconButton>
              <IconButton
                style={{float: "right"}}
                //onClick={() => handlePopup(true)}
                aria-label=""
                component="span"
              >
                <Icon
                  path={mdiFileExcel}
                  title="Xuất excel"
                  size={1}
                  color="green"
                />
              </IconButton>
              <IconButton
                style={{float: "right"}}
                onClick={() =>
                  history.push("/delivery-trip-chart/" + deliveryPlanId)
                }
                component="span"
              >
                <Icon
                  path={mdiChartBar}
                  title="Biểu đồ các chuyến"
                  size={1}
                  color="blue"
                />
              </IconButton>
              <IconButton
                style={{float: "right"}}
                //onClick={() => handlePopup(true)}

                component="span"
              >
                <Icon
                  path={mdiDeveloperBoard}
                  title="DS đơn hàng chưa được xếp chuyến"
                  size={1}
                  color="blue"
                />
              </IconButton>
              <IconButton
                style={{float: "right"}}
                onClick={() => handleSolve()}
                aria-label="Tự động xếp chuyến còn lại"
                component="span"
              >
                {solveWaiting ? (
                  <CircularProgress color={"secondary"}/>
                ) : (
                  <Icon
                    path={mdiRobotIndustrial}
                    title="Tự động xếp chuyến còn lại"
                    size={1}
                    color="green"
                  />
                )}
              </IconButton>
              <IconButton
                style={{float: "right"}}
                //onClick={() => handlePopup(true)}

                component="span"
              >
                <Icon
                  path={mdiCancel}
                  title="Hủy chuyến"
                  size={1}
                  color="red"
                />
              </IconButton>
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="description">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Mô tả
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {deliveryPlan === null
                          ? ""
                          : deliveryPlan["description"]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={6}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="deliveryPlanDate">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Ngày tạo
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {deliveryPlan === null
                          ? ""
                          : deliveryPlan["deliveryPlanDate"]}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="description">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Số chuyến
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {deliveryPlanDetailInfo ? deliveryPlanDetailInfo['numberTrips'] : ''}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={4}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="deliveryPlanDate">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Tổng khối lượng các đơn hàng
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {deliveryPlanDetailInfo ? deliveryPlanDetailInfo['totalWeight'] : ''}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={4}>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    <TableRow key="deliveryPlanDate">
                      <TableCell align="center">
                        <Box fontWeight="fontWeightBold" m={1}>
                          Tổng khối lượng các đơn hàng đã xếp chuyến
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {deliveryPlanDetailInfo ? deliveryPlanDetailInfo['totalWeightScheduled'] : ''}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button
            style={{float: "right"}}
            color="primary"
            variant="contained"
            onClick={() => history.push("/create-delivery-trip/" + deliveryPlanId)}
          >
            Tạo mới chuyến
          </Button>
        </Grid>
        <Grid item xs={12}>
          {
            dataTable.length > 0 ?
              <MaterialTable
                title={"Danh sách chuyến giao"}
                columns={columns}
                options={{search: false}}
                data={dataTable}
                icons={tableIcons}
              /> : <CircularProgress color={"secondary"}/>
          }
        </Grid>
      </Grid>
    </div>
  );
}
