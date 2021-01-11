import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleApiWrapper, Map, Marker, Polyline } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";
import { authPost, authGet, authDelete } from "../../../api";
import AlertDialog from "../../../utils/AlertDialog";
import { errorNoti, infoNoti } from "../../../utils/Notification";
import MaterialTable from "material-table";
import {
    localization, tableIcons
} from '../../../utils/MaterialTableUtils';
import { makeStyles } from "@material-ui/core/styles";
import ConfirmDialog from "../ConfirmDialog"
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}
const columns = [
    { title: "Mã đơn hàng", field: "postOrder.postShipOrderId", editable: false },
    {
        title: "Trạng thái", field: "statusId",
        lookup: {
            "POST_ORDER_ASSIGNMENT_PICKUP_WAITING": 'Chờ nhận hàng',
            "POST_ORDER_ASSIGNMENT_SHIP_WAITING": 'Chờ giao hàng',
            "POST_ORDER_ASSIGNMENT_PICKUP_SUCCESS": 'Nhận hàng thành công',
            "POST_ORDER_ASSIGNMENT_SHIP_SUCCESS": 'Giao hàng thành công',
        }
    },
]

const orderColumns = [
    { title: "Mã đơn hàng", field: "postShipOrderId" },
    { title: "Người gửi", field: "fromCustomer.postCustomerName" },
    { title: "Người nhận", field: "toCustomer.postCustomerName" },
    { title: "Số điện thoại người gửi", field: "fromCustomer.phoneNum" },
    { title: "Số điện thoại người nhận", field: "toCustomer.phoneNum" },
    { title: "Địa chỉ Người gửi", field: "toCustomer.postalAddress.address" },
    { title: "Địa chỉ người nhận", field: "fromCustomer.postalAddress.address" },
]

function formatDate(date) {
    return date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();
}

function extendBoundRecursive(bounds, map, elements) {
    if (!elements) return;
    elements.forEach((child) => {
        if (child && child.type === Marker) {
            bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            return;
        } else if (Array.isArray(child)) {
            extendBoundRecursive(bounds, map, child);
        }
    })
}

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 400,
    },
});

const style = {
    width: '100%',
    height: '100%'
}

function PostmanOrderAssignmentDetail(props) {
    const classes = useStyles();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [data, setData] = useState([]);
    const [map, setMap] = useState();
    const [tableRef, setTableRef] = useState();
    const [open, setOpen] = useState(false);
    const [postmanId, setPostmanId] = useState();
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [postOffice, setPostOffice] = useState();
    const [activePostOrder, setActivePostOrder] = useState([]);
    const [comfirmAction, setConfirmAction] = useState({
        open: false,
        handleSuccess: undefined,
        content: undefined,
        title: undefined
    });
    const [geoPoints, setGeoPoints] = useState([])
    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        title: undefined,
        message: undefined
    })
    const arrow = {
        path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
        fillColor: '#f00',
        fillOpacity: 1.0,
        strokeColor: '#f00',
        strokeWeight: 1,
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
        loadData(date, toDate);
    }

    const handleToDateChange = (date) => {
        setToDate(date);
        loadData(fromDate, date);
    }

    const loadData = async (fromDate, toDate) => {
        await Promise.all([
            authGet(dispatch, token, '/get-order-by-postman-and-date?fromDate=' + formatDate(fromDate) + '&toDate=' + formatDate(toDate), {})
                .then(res => {
                    authGet(dispatch, token, '/get-post-office-by-postman', {})
                        .then((res1) => {
                            let geoPoints = []
                            if (res.length > 0) {
                                geoPoints.push(res1.postalAddress.geoPoint);
                                res.forEach(assignment => {
                                    geoPoints.push(assignment.postOrder.fromCustomer.postalAddress.geoPoint);
                                })
                                geoPoints.push(res1.postalAddress.geoPoint);
                            }
                            setGeoPoints(geoPoints);
                            setData(res);
                            setPostOffice(res1);
                        })
                })
        ])
            .catch(err => errHandling(err))
    }

    useEffect(() => {
        loadData(fromDate, toDate)
    }, [])

    useEffect(() => {
        if (map === undefined) return;
        const bounds = new window.google.maps.LatLngBounds();
        extendBoundRecursive(bounds, map, map.props.children);
        if (map.props.children && map.props.children.length > 0) map.map.fitBounds(bounds);
    })

    const orderUpdate = (newData, oldData) => {
        authPost(dispatch, token, "/update-postman-post-order-assignment", {
            postShipOrderPostmanLastMileAssignmentId: oldData.postShipOrderPostmanLastMileAssignmentId,
            status: newData.statusId
        })
            .then((response) => {
                if (response.status == 'ERROR') {
                    setAlertAction({
                        open: true,
                        message: "Cập nhật không thành công.",
                        title: 'Thông báo'
                    })
                    return
                }
                const dataUpdate = [...data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setData([...dataUpdate]);
                setAlertAction({
                    open: true,
                    message: 'Cập nhật thông tin thành công',
                    title: 'Thông báo'
                })

            })
            .catch(err => errHandling(err))
    }

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container spacing={5}>
                <Grid item xs={5}>
                    <KeyboardDatePicker
                        id="fromDate"
                        label="Từ ngày"
                        style={{ margin: 5 }}
                        required={true}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        format='dd/MM/yyyy'
                        onChange={handleFromDateChange}
                        value={fromDate}
                    />
                    <KeyboardDatePicker
                        id="toDate"
                        label="Đến ngày"
                        style={{ margin: 5 }}
                        required={true}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        format='dd/MM/yyyy'
                        onChange={handleToDateChange}
                        value={toDate}
                    />
                    <MaterialTable
                        className={classes.table}
                        title="Danh sách đơn hàng"
                        columns={columns}
                        options={{
                            filtering: true,
                            Materisearch: true,
                            actionsColumnIndex: -1,
                            selection: false,
                        }}
                        localization={localization}
                        icons={tableIcons}
                        data={data}
                        tableRef={(ref) => setTableRef(ref)}
                        editable={{
                            onRowUpdate: (newData, oldData) =>
                                new Promise((resolve, reject) => {
                                    orderUpdate(newData, oldData);
                                    resolve();
                                })
                        }}
                        actions={[
                            (assignment) => ({
                                icon: () => <MoreHorizIcon />,
                                tooltip: 'Chi tiết',
                                onClick: (event, assignment) => {
                                    setActivePostOrder([assignment.postOrder]);
                                    setOpen(true)
                                },
                            })
                        ]}
                    />
                </Grid>
                <Grid item xs={7}>
                    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                        <Map
                            google={props.google}
                            zoom={14}
                            style={style}
                            ref={(ref) => { setMap(ref) }}
                            center={{
                                lat: 21.027763,
                                lng: 105.834160,
                            }}
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
                            {
                                data.map((assignment) => {
                                    let order = assignment.postOrder
                                    return (
                                        <Marker
                                            title={order.fromCustomer.postCustomerName}
                                            position={{
                                                lat: order.fromCustomer.postalAddress.geoPoint.latitude,
                                                lng: order.fromCustomer.postalAddress.geoPoint.longitude,
                                            }}
                                        />
                                    )
                                })
                            }
                            {
                                geoPoints.map((geoPoint, i) => {
                                    if (i == geoPoints.length - 1) return undefined
                                    return <Polyline
                                        path={
                                            [
                                                { lat: geoPoint.latitude, lng: geoPoint.longitude },
                                                { lat: geoPoints[i + 1].latitude, lng: geoPoints[i + 1].longitude }
                                            ]
                                        }
                                        icons={
                                            [{
                                                icon: arrow,
                                                offset: '100%',
                                            }]
                                        }
                                        options={{
                                            strokeColor: '#f00',
                                            strokeOpacity: 1,
                                            strokeWeight: 2
                                        }}
                                    />
                                })
                            }
                        </Map>
                    </div>
                </Grid>
            </Grid>
            <AlertDialog
                open={alertAction.open}
                setOpen={() => setAlertAction({
                    open: false,
                })}
                title={alertAction.title}
                message={alertAction.message}
            />
            <ConfirmDialog
                confirmAction={comfirmAction}
                setConfirmAction={setConfirmAction}
            />
            <Dialog open={open} onClose={() => { setOpen(false) }} fullWidth maxWidth>
                <DialogTitle>{"Chi tiết đơn hàng"}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        className={classes.table}
                        title={"Chi tiết đơn hàng"}
                        columns={orderColumns}
                        localization={localization}
                        data={activePostOrder}
                    />
                </DialogContent>
            </Dialog>
        </MuiPickersUtilsProvider>
    );

}


export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(PostmanOrderAssignmentDetail);
