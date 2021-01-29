import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authPost, authGet } from "../../../api";
import { makeStyles } from '@material-ui/core/styles';
import {
    CircularProgress, FormControlLabel, Button,
    IconButton, Dialog, DialogTitle, DialogContent
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { GoogleApiWrapper, Map, Marker, Polyline } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaterialTable from "material-table";
import {
    localization
} from '../../../utils/MaterialTableUtils';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { errorNoti } from "../../../utils/Notification";
import AlertDialog from "../../../utils/AlertDialog";
function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}
const colorList = [
    '#00ffff', '#39AECA', '#8429B1', '#CCAFF0', '#A6EA38', '#1B4C44', '#980414', '#D8661D', '#298D2B', '#826230', '#46101C', '#C53A6D', '#C5C318', '#111A49', '#1B7E57'
]
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));

function extendBoundRecursive(bounds, map, elements) {
    elements.forEach((child) => {
        if (child && child.type === Marker && child.props.visible) {
            bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            return;
        } else if (Array.isArray(child)) {
            extendBoundRecursive(bounds, map, child);
        }
    })
}
function formatDate(date) {
    return date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();
}

function moveItem(data, from, to) {
    // remove `from` item and store it
    // console.log('before', data, from, to)
    data = JSON.parse(JSON.stringify(data))
    let temp = data[from].order;
    data[from].order = data[to].order;
    data[to].order = temp;
    var f = data.splice(from, 1)[0];
    // insert stored item into position `to`
    data.splice(to, 0, f);
    // console.log('after', data, from, to);
    return data;
}
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function distance(a1, a2) {
    let r = 6371000;
    let lat1 = a1.latitude, lat2 = a2.latitude, lng1 = a1.longitude, lng2 = a2.longitude;
    let dLat = deg2rad(lat2 - lat1);
    let dLng = deg2rad(lng2 - lng1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(r * c);
}
const style = {
    width: '100%',
    height: '100%'
}
function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function PickAndDeliveryDetail(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [postOffice, setPostOffice] = useState();
    const [fromPostOrder, setFromPostOrder] = useState([]);
    const [pickVisible, setPickVisible] = useState(false);
    const [pickMarkerVisible, setPickMarkerVisible] = useState(false);
    const [map, setMap] = useState();
    const [postmen, setPostmen] = useState([]);
    const [activePostman, setActivePostman] = useState();
    const handlePickVisibleChange = (event) => {
        setPickVisible(event.target.checked);
    }
    const { postOfficeId } = props.location.state;
    const [isSolved, setSolved] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [isSolving, setSolving] = useState(false);
    const [distances, setDistances] = useState([]);
    const [open, setOpen] = useState(false);
    const [orderOpen, setOrderOpen] = useState(false);
    const [backupPostmen, setBackupPostmen] = useState([]);
    const [backupPostorders, setBackupPostorders] = useState([]);
    const [postmanTableRef, setPostmanTableRef] = useState();
    const [solvingPostmen, setSolvingPostmen] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        title: undefined,
        message: undefined
    })
    const handleFromDateChange = (date) => {
        setFromDate(date);
        refreshPostOrders(date, toDate);
    }
    const handleToDateChange = (date) => {
        setToDate(date);
        refreshPostOrders(fromDate, date);
    }

    const handleViewRouteChange = (i, value) => {
        let newPostmen = postmen.slice();
        newPostmen[i].viewRoute = value;
        setPostmen(newPostmen);
    }
    const handleCancelDialog = () => {
        setOpen(false);
    };

    const handleOpenDialog = (postman) => {
        setActivePostman(postman);
        setOpen(true);
    };
    const geoPointsGen = (postman) => {
        postman.geoPoints = []
        postman.distance = 0
        if (postman.postOrders.length > 0) {
            postman.geoPoints.push(postOffice.postalAddress.geoPoint);
            postman.postOrders.forEach(postOrder => {
                postman.distance += distance(postOrder.fromCustomer.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                postman.geoPoints.push(postOrder.fromCustomer.postalAddress.geoPoint);
            })
            postman.distance += distance(postOffice.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
            postman.geoPoints.push(postOffice.postalAddress.geoPoint);
        }
        return postman;
    }
    const submitSolver = () => {
        setSolving(true);
        authPost(dispatch, token, "/post-office-vrp-solve", {
            "postOfficeId": postOfficeId,
            "postmanIds": solvingPostmen,
            "postOrderIds": fromPostOrder.map(postOrder => postOrder.postShipOrderId),
            "type": "pick"
        })
            .then(res => {
                if (res.solutionFound) {
                    setRoutes(res.geoPoints);
                    setPickMarkerVisible(true);
                    setDistances(res.distance);
                    let newPostmen = postmen.slice();
                    let solvedPostOrderId = [];
                    solvingPostmen.forEach((solvingPostmanId, i) => {
                        newPostmen.forEach(postman => {
                            if (postman.postmanId == solvingPostmanId) {
                                postman.weight = 0;
                                postman.distance = 0;
                                if (res.routes[i].length > 0) {
                                    postman.viewRoute = true;
                                    postman.distance = res.distance[i];
                                    postman.geoPoints = [];
                                    postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                                    let order = 0;
                                    res.routes[i].forEach(postOrder => {
                                        solvedPostOrderId.push(postOrder.postShipOrderId);
                                        postman.distance += distance(postOrder.fromCustomer.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                        postman.geoPoints.push(postOrder.fromCustomer.postalAddress.geoPoint);
                                        postOrder['order'] = order++;
                                        postman.weight += postOrder.weight;
                                    })
                                    postman.distance += distance(postOffice.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                    postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                                    postman.postOrders = res.routes[i];
                                    postman.isSolved = res.solutionFound;
                                }
                            }
                        })
                    })
                    setPostmen(newPostmen);
                    setSolved(true);
                    setFromPostOrder(fromPostOrder.filter(postOrder => !solvedPostOrderId.includes(postOrder.postShipOrderId)))
                }
                setSolving(false);
            })
            .catch(err => errHandling(err))
    }
    const submitSolution = () => {
        let requestbody = postmen.map(postman => {
            return {
                postmanId: postman.postmanId, postOrderIds: postman.postOrders.map(postOrder => {
                    return postOrder.postShipOrderId
                })
            }
        })
        authPost(dispatch, token, "/submit-postman-assign/?pick=" + true, requestbody)
            .then(res => {
                if (res.status == "SUCCESS") {
                    setAlertAction(
                        {
                            open: true,
                            message: "Lập kế hoạch thu gom thành công !",
                            title: 'Thông báo'
                        }
                    )
                }
            })
            .catch(err => errHandling(err))
    }
    useEffect(() => {
        authGet(dispatch, token, "/get_office_order_detail/" + postOfficeId + '?fromDate=' + formatDate(fromDate) + '&toDate=' + formatDate(toDate))
            .then(
                res => {
                    setPostOffice(res.postOffice)
                    setFromPostOrder(res.fromPostOrders);
                    setBackupPostorders(copyObj(res.fromPostOrders));
                    authGet(dispatch, token, "/get-postman-list-order-bydate/" + postOfficeId + '?fromDate=' + formatDate(fromDate) + '&toDate=' + formatDate(toDate) + '&from=' + true)
                        .then(
                            res1 => {
                                res1.forEach(postman => {
                                    postman.viewRoute = false;
                                    postman.color = colorList[Math.floor(Math.random() * (colorList.length + 1))];
                                    postman.isSolved = false;
                                    postman.geoPoints = []
                                    postman.weight = 0;
                                    postman.distance = 0;
                                    if (postman.postOrders.length > 0) {
                                        postman.isSolved = true;
                                        postman.geoPoints.push(res.postOffice.postalAddress.geoPoint);
                                        let order = 0;
                                        postman.postOrders.forEach(postOrder => {
                                            postOrder['order'] = order++;
                                            postman.distance += distance(postOrder.fromCustomer.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                            postman.geoPoints.push(postOrder.fromCustomer.postalAddress.geoPoint);
                                            postman.weight += postOrder.weight;
                                        })
                                        postman.distance += distance(res.postOffice.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                        postman.geoPoints.push(res.postOffice.postalAddress.geoPoint);
                                    }
                                })
                                setPostmen(res1);
                                setBackupPostmen(copyObj(res1));
                            }
                        )
                })
            .catch(err => errHandling(err))
    }, [])

    useEffect(() => {
        if (map === undefined) return;
        const bounds = new window.google.maps.LatLngBounds();
        extendBoundRecursive(bounds, map, map.props.children);
        map.map.fitBounds(bounds);
    })
    const taskListColumn = [
        { field: 'postmanId', hidden: true },
        { title: "Tên", field: "postmanName" },
        {
            title: "Số đơn",
            render: postman => {
                return (postman.postOrders ? postman.postOrders.length : 0);
            }
        },
        {
            title: "Khối lượng",
            render: postman => {
                return (postman.weight ? postman.weight : 0) + " kg"
            }
        },
        {
            title: "Quãng đưòng",
            render: postman => {
                return Math.round((postman.distance ? postman.distance : 0) / 1000) + " km"
            }
        },
        {
            title: "Hiện đường đi", field: "",
            render: postman => {
                return (
                    <IconButton color="primary"
                        onClick={e => { handleViewRouteChange(postman.tableData.id, !postman.viewRoute) }}
                        disabled={!postman.isSolved}
                    >
                        {postman.viewRoute ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                )
            }
        },
        {
            title: "Xem đơn hàng", field: "",
            render: postman => {
                return (
                    <IconButton color="primary"
                        onClick={() => handleOpenDialog(postman)}
                        disabled={!postman.isSolved}>
                        <MoreHorizIcon />
                    </IconButton>
                )
            }
        }
    ]
    const orderColumn = [
        { title: 'Thứ tự', field: 'order', customSort: (a, b) => { return a.order - b.order }, defaultSort: 'asc' },
        { title: "Mã đơn hàng", field: "postShipOrderId", sorting: false },
        { title: "Người gửi", field: "fromCustomer.postCustomerName", sorting: false },
        { title: "Người nhận", field: "toCustomer.postCustomerName", sorting: false },
        { title: "Số điện thoại người gửi", field: "fromCustomer.phoneNum", sorting: false },
        { title: "Số điện thoại người nhận", field: "toCustomer.phoneNum" },
        { title: "Địa chỉ Người gửi", field: "fromCustomer.postalAddress.address", sorting: false },
        { title: "Địa chỉ người nhận", field: "toCustomer.postalAddress.address", sorting: false },
        {
            title: "Chuyển cho", field: "",
            render: postOrder => {
                return (
                    <Autocomplete
                        id="combo-box-demo"
                        options={postmen.filter(postman => postman.postmanId != activePostman.postmanId)}
                        getOptionLabel={(option) => option.postmanName}
                        style={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Chuyển cho" variant="outlined" />}
                        onChange={(event, value) => moveToPostman(value.postmanId, postOrder.postShipOrderId)}
                    />
                )
            }
        }
    ]
    const allOrderColumn = [
        { title: "Mã đơn hàng", field: "postShipOrderId", sorting: false },
        { title: "Người gửi", field: "fromCustomer.postCustomerName", sorting: false },
        { title: "Người nhận", field: "toCustomer.postCustomerName", sorting: false },
        { title: "Số điện thoại người gửi", field: "fromCustomer.phoneNum", sorting: false },
        { title: "Số điện thoại người nhận", field: "toCustomer.phoneNum" },
        { title: "Địa chỉ Người gửi", field: "fromCustomer.postalAddress.address", sorting: false },
        { title: "Địa chỉ người nhận", field: "toCustomer.postalAddress.address", sorting: false },
        {
            title: "Chuyển cho", field: "",
            render: postOrder => {
                return (
                    <Autocomplete
                        id="combo-box-demo"
                        options={postmen}
                        getOptionLabel={(option) => option.postmanName}
                        style={{ width: 200 }}
                        renderInput={(params) => <TextField {...params} label="Chuyển cho" variant="outlined" />}
                        onChange={(event, value) => moveToPostman(value ? value.postmanId : undefined, postOrder.postShipOrderId)}
                    />
                )
            }
        }
    ]
    const moveOrder = (postman, orderNum, direction) => {
        let newPostmen = JSON.parse(JSON.stringify(postmen))
        newPostmen.forEach(_postman => {
            if (_postman.postmanId == postman.postmanId) {
                let newPostOrders = moveItem(_postman.postOrders, orderNum, orderNum + direction);
                _postman.postOrders = newPostOrders;
                // let newGeoPoints = moveItem(_postman.geoPoints, orderNum + 1, orderNum + 1 + direction)
                _postman = geoPointsGen(_postman)
                setActivePostman(_postman)
            }
        })
        setPostmen(newPostmen)
    }
    const deleteOrder = (postOrder) => {
        let newPostmen = JSON.parse(JSON.stringify(postmen))
        newPostmen.forEach(_postman => {
            if (_postman.postmanId == activePostman.postmanId) {
                _postman.postOrders = _postman.postOrders.filter(_postOrder => _postOrder.postShipOrderId != postOrder.postShipOrderId)
                _postman.weight -= postOrder.weight
                if (_postman.postOrders.length == 0) _postman.isSolved = false
                _postman = geoPointsGen(_postman)
                setActivePostman(_postman)
            }
        })
        setPostmen(newPostmen)
        setFromPostOrder([...fromPostOrder, postOrder])
    }
    const moveToPostman = (toPostmanId, postOrderId) => {
        let newPostmen = JSON.parse(JSON.stringify(postmen))
        let newActivePostman = activePostman ? JSON.parse(JSON.stringify(activePostman)) : activePostman
        if (activePostman) {
            newPostmen.forEach(_postmanSource => {
                if (_postmanSource.postmanId == activePostman.postmanId) {
                    newPostmen.forEach(_postmanTarget => {
                        if (_postmanTarget.postmanId == toPostmanId) {
                            _postmanSource.postOrders.forEach(postOrder => {
                                if (postOrder.postShipOrderId == postOrderId) {
                                    _postmanTarget.postOrders.push(postOrder)
                                    _postmanTarget.weight += postOrder.weight
                                    _postmanSource.weight -= postOrder.weight
                                }
                            })
                            _postmanTarget = geoPointsGen(_postmanTarget);
                        }
                    })
                    let newPostOrders = _postmanSource.postOrders.filter(postOrder => postOrder.postShipOrderId != postOrderId)
                    _postmanSource.postOrders = newPostOrders
                    newActivePostman.postOrders = newPostOrders
                    _postmanSource = geoPointsGen(_postmanSource);
                }
            })
            setActivePostman(newActivePostman)
        }
        else {
            newPostmen.forEach(_postmanTarget => {
                if (_postmanTarget.postmanId == toPostmanId) {
                    fromPostOrder.forEach(postOrder => {
                        if (postOrder.postShipOrderId == postOrderId) {
                            _postmanTarget.postOrders.push(postOrder)
                            _postmanTarget.weight += postOrder.weight
                            _postmanTarget.isSolved = true;
                            let newFromPostOrder = fromPostOrder.filter((postOrder) => postOrder.postShipOrderId != postOrderId)
                            setFromPostOrder(newFromPostOrder);
                        }
                    })
                    _postmanTarget = geoPointsGen(_postmanTarget);
                }
            })
        }
        setPostmen(newPostmen)
    }
    const handleOnSelectionChange = (rows) => {
        if (rows) {
            setSolvingPostmen(postmanTableRef.state.data.filter(x => x.tableData.checked).map(postman => postman.postmanId))
        }
    };
    const refreshPostOrders = (fromDate, toDate) => {
        authGet(dispatch, token, "/get_office_order_detail/" + postOfficeId + '?fromDate=' + formatDate(fromDate) + '&toDate=' + formatDate(toDate))
            .then(
                res => {
                    setPostOffice(res.postOffice)
                    setFromPostOrder(res.fromPostOrders);
                    setBackupPostorders(copyObj(res.fromPostOrders));
                    authGet(dispatch, token, "/get-postman-list-order-bydate/" + postOfficeId + '?fromDate=' + formatDate(fromDate) + '&toDate=' + formatDate(toDate) + '&from=' + true)
                        .then(
                            res1 => {
                                res1.forEach(postman => {
                                    postman.viewRoute = false;
                                    postman.color = colorList[Math.floor(Math.random() * (colorList.length + 1))];
                                    postman.isSolved = false;
                                    postman.geoPoints = [];
                                    postman.weight = 0;
                                    postman.distance = 0;
                                    if (postman.postOrders.length > 0) {
                                        postman.isSolved = true;
                                        postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                                        let order = 0;
                                        postman.postOrders.forEach(postOrder => {
                                            postOrder['order'] = order++;
                                            postman.distance += distance(postOrder.fromCustomer.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                            postman.geoPoints.push(postOrder.fromCustomer.postalAddress.geoPoint);
                                            postman.weight += postOrder.weight;
                                        })
                                        postman.distance += distance(postOffice.postalAddress.geoPoint, postman.geoPoints[postman.geoPoints.length - 1]);
                                        postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                                    }
                                })
                                setPostmen(res1);
                                setBackupPostmen(copyObj(res1));
                            }
                        )
                })
            .catch(err => errHandling(err));
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={5}>
                <Grid item xs={5}>
                    <Typography variant="h5" component="h2">
                        Phân chia bưu tá
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {postOffice ? ('Mã bưu cục: ' + postOffice.postOfficeId + ' - ' + postOffice.postOfficeName) : ''}
                    </Typography>
                    <br />
                    <Typography variant="h6" component="h2">
                        Còn {fromPostOrder.length} đơn hàng chưa phân công
                    </Typography>
                    <div>
                        <KeyboardDatePicker
                            id="fromDate"
                            label="Từ ngày"
                            style={{ width: 400, margin: 5 }}
                            required={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            format='dd/MM/yyyy'
                            onChange={handleFromDateChange}
                            value={fromDate}
                        />
                    </div>
                    <div>
                        <KeyboardDatePicker
                            id="toDate"
                            label="Đến ngày"
                            style={{ width: 400, margin: 5 }}
                            required={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            format='dd/MM/yyyy'
                            onChange={handleToDateChange}
                            value={toDate}
                        />
                    </div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pickVisible}
                                onChange={handlePickVisibleChange}
                                color="primary"
                                name="checkedB"
                            />
                        }
                        label="Hiện tất cả đơn hàng"
                    />
                    <br />
                    <Button
                        color='primary'
                        onClick={() => { setOrderOpen(true) }}
                        variant='outlined'
                    >
                        Lập kế hoạch
                    </Button>
                    <br />
                    <br />
                    <MaterialTable
                        className={classes.table}
                        title="Danh sách người vận chuyển"
                        columns={taskListColumn}
                        options={{
                            filtering: true,
                            search: false,
                            selection: true,
                            actionsColumnIndex: -1,
                            selection: true,
                            selectionProps: postman => {
                                let isDisabled = postman.postOrders.length > 0 || isSolved
                                postman.tableData.disabled = isDisabled
                                return {
                                    disabled: isDisabled,
                                    color: 'primary'
                                }
                            }
                        }}
                        localization={localization}
                        data={postmen}
                        onSelectionChange={rows => { handleOnSelectionChange(rows) }}
                        tableRef={(ref) => setPostmanTableRef(ref)}
                    />
                    <br />
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={submitSolver}
                    >
                        {isSolving ? <CircularProgress /> : "Gợi ý"}
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={submitSolution}
                        style={{ marginLeft: 5 }}
                    >
                        Lưu
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                            setPostmen(copyObj(backupPostmen));
                            setPickMarkerVisible(false);
                            setSolved(false);
                            setFromPostOrder(copyObj(backupPostorders));
                        }}
                        style={{ marginLeft: 5 }}
                    >
                        Hủy
                    </Button>
                </Grid>

                <Grid item xs={7}>
                    <div classname="map" style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '10px', overflow: 'hidden' }}>
                        <Map
                            google={props.google}
                            zoom={14}
                            style={style}
                            initialCenter={{
                                lat: 21.0227788,
                                lng: 105.8194541
                            }}
                            ref={(ref) => { setMap(ref) }}
                            onClick={(mapProps, map, event) => { console.log(event.latLng.lat(), event.latLng.lng()) }}
                        >
                            {postOffice ?
                                <Marker
                                    title={'Bưu cục'}
                                    position={{
                                        lat: postOffice.postalAddress.geoPoint.latitude,
                                        lng: postOffice.postalAddress.geoPoint.longitude,
                                    }}
                                    icon={{
                                        url: 'https://www.google.com/maps/vt/icon/name=assets/icons/poi/tactile/pinlet_shadow_v3-2-medium.png,assets/icons/poi/tactile/pinlet_outline_v3-2-medium.png,assets/icons/poi/tactile/pinlet_v3-2-medium.png,assets/icons/poi/quantum/pinlet/postoffice_pinlet-2-medium.png&highlight=ff000000,ffffff,ea4335,ffffff?scale=1'
                                    }}
                                    visible={true}
                                />
                                : undefined
                            }
                            {pickVisible ?
                                fromPostOrder.map((order) => {
                                    return (
                                        <Marker
                                            title={order.fromCustomer.postCustomerName}
                                            position={{
                                                lat: order.fromCustomer.postalAddress.geoPoint.latitude,
                                                lng: order.fromCustomer.postalAddress.geoPoint.longitude,
                                            }}
                                            visible={pickVisible || pickMarkerVisible}
                                        />
                                    )
                                })
                                : undefined
                            }
                            {pickVisible ?
                                fromPostOrder.map((order) => {
                                    return (
                                        <Polyline
                                            path={
                                                [
                                                    { lat: postOffice.postalAddress.geoPoint.latitude, lng: postOffice.postalAddress.geoPoint.longitude },
                                                    { lat: order.fromCustomer.postalAddress.geoPoint.latitude, lng: order.fromCustomer.postalAddress.geoPoint.longitude }
                                                ]
                                            }
                                            options={{
                                                strokeColor: '#00ffff',
                                                strokeOpacity: 1,
                                                strokeWeight: 2
                                            }}
                                        />
                                    )
                                })
                                : undefined
                            }
                            {
                                postmen.map(postman => {
                                    let color = postman.color
                                    const arrow = {
                                        path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
                                        fillColor: color,
                                        fillOpacity: 1.0,
                                        strokeColor: color,
                                        strokeWeight: 1,
                                    };
                                    if (postman.viewRoute) {
                                        return postman.geoPoints.map((geoPoint, i) => {
                                            return postman.geoPoints[i + 1]
                                                ?
                                                <Polyline
                                                    path={
                                                        [
                                                            { lat: geoPoint.latitude, lng: geoPoint.longitude },
                                                            { lat: postman.geoPoints[i + 1].latitude, lng: postman.geoPoints[i + 1].longitude }
                                                        ]
                                                    }
                                                    icons={
                                                        [{
                                                            icon: arrow,
                                                            offset: '100%',
                                                        }]
                                                    }
                                                    options={{
                                                        strokeColor: color,
                                                        strokeOpacity: 1,
                                                        strokeWeight: 2
                                                    }}
                                                    title={distances[i]}
                                                />
                                                :
                                                undefined
                                        })
                                    }
                                })
                            }
                            {
                                postmen.map(postman => {
                                    return postman.postOrders.map(order => {
                                        return postman.viewRoute ?
                                            <Marker
                                                title={order.fromCustomer.postCustomerName}
                                                position={{
                                                    lat: order.fromCustomer.postalAddress.geoPoint.latitude,
                                                    lng: order.fromCustomer.postalAddress.geoPoint.longitude,
                                                }}
                                                visible={true}
                                            />
                                            : undefined
                                    })
                                })
                            }
                        </Map>
                    </div>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleCancelDialog} fullWidth maxWidth>
                <DialogTitle>{"Danh sách đơn hàng của " + (activePostman ? activePostman.postmanName : null)}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        className={classes.table}
                        title={"Danh sách đơn hàng của " + (activePostman ? activePostman.postmanName : null)}
                        columns={orderColumn}
                        options={{
                            filtering: false,
                            search: false,
                            selection: false,
                            actionsColumnIndex: -1,
                            selection: false,
                            sorting: true,
                            draggable: true

                        }}
                        localization={localization}
                        data={activePostman ? activePostman.postOrders : []}
                        onSelectionChange={rows => { handleOnSelectionChange(rows) }}
                        actions={[
                            (postOrder) => ({
                                icon: () => <ExpandLessIcon />,
                                tooltip: 'Chuyển lên',
                                onClick: (event, postOrder) => moveOrder(activePostman, postOrder.order, -1),
                                disabled: postOrder.tableData.id == 0,
                                iconProps: {
                                    cursor: 'crosshair'
                                }
                            }),
                            (postOrder) => ({
                                icon: () => <ExpandMoreIcon />,
                                tooltip: 'Chuyển xuống',
                                onClick: (event, postOrder) => moveOrder(activePostman, postOrder.order, 1),
                                disabled: postOrder.tableData.id == activePostman.postOrders.length - 1
                            }),
                            (postOrder) => ({
                                icon: 'delete',
                                tooltip: 'Xóa',
                                onClick: (event, postOrder) => deleteOrder(postOrder)
                            })
                        ]}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={orderOpen} onClose={() => setOrderOpen(false)} fullWidth maxWidth>
                <DialogTitle>{"Danh sách tất cả đơn hàng"}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        className={classes.table}
                        title={"Danh sách tất cả đơn hàng"}
                        columns={allOrderColumn}
                        options={{
                            filtering: false,
                            search: false,
                            selection: false,
                            actionsColumnIndex: -1,
                            selection: false,
                            sorting: true,
                            draggable: true

                        }}
                        localization={localization}
                        data={fromPostOrder}
                    />
                </DialogContent>
            </Dialog>
            <AlertDialog
                open={alertAction.open}
                setOpen={() => setAlertAction({
                    open: false,
                })}
                title={alertAction.title}
                message={alertAction.message}
            />
        </MuiPickersUtilsProvider >
    );

}


export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(PickAndDeliveryDetail);
