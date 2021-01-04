import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent, Tooltip, IconButton } from "@material-ui/core";
import { API_URL } from "../../../config/config";
import { Link } from "react-router-dom";
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import DoneIcon from '@material-ui/icons/Done';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { authPost, authGet } from "../../../api";
import { KeyboardDatePicker, MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MaterialTable from "material-table";
import {
    localization
} from '../../../utils/MaterialTableUtils';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch, useSelector } from "react-redux";
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AlertDialog from "../../../utils/AlertDialog";
import { errorNoti, infoNoti } from "../../../utils/Notification";
function copyObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}
const statusIcon = {
    'default': <PlayArrowIcon />,
    'WATING': <PauseCircleOutlineIcon />,
    'EXECUTING': <AlarmOnIcon />,
    'ARRIVED': <DoneIcon />
}
const orderIcon = {
    'default': <PlayArrowIcon />,
}
const columns = [
    { label: "Mã số chuyến", id: "postOfficeFixedTripId", minWidth: 150 },
    { label: "Xuất phát", id: "fromPostOffice.postOfficeName", minWidth: 200 },
    { label: "Điểm đến", id: "toPostOffice.postOfficeName", minWidth: 150 },
    { label: "Giờ chạy", id: "schedule_departure_time", minWidth: 150, },
    { label: "Trạng thái", id: "status", minWidth: 150, icon: statusIcon, type: 'statusIcon' },
    /* trạng thái gồm: 
      NULL: chưa bắt đàu
      WAITING: chờ người tiếp nhận
      EXECUTING: đã tiếp nhận
      ARRIVED: đã đến
    */
    { label: "Đơn hàng", id: "order", minWidth: 150, icon: orderIcon, type: 'orderIcon' }
    /* trạng thái gồm: 
      SIZE=0: KO CÓ ĐƠN
      SIZE>0: CÓ ĐƠN
    */
];


const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});
function formatDate(date) {
    return date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();
}

function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}

export default function ExecuteTrip() {
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [chooseDate, setChooseDate] = useState(new Date());
    const [tableRef, setTableRef] = useState();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [activeTrip, setActiveTrip] = useState();
    const [orderTableRef, setOrderTableRef] = useState();
    const [availableAssignment, setAvailableAssignment] = useState({});
    const [activeAssignments, setActiveAssignments] = useState({});
    const [activePostTrip, setActivePostTrip] = useState();
    const [fixedTripExecutes, setFixedTripExecutes] = useState({});
    const taskListColumn = [
        { title: "Mã số chuyến", field: "postOfficeFixedTripId", customSort: (a, b) => { return a.havingOrder - b.havingOrder }, defaultSort: 'desc' },
        {
            title: "Xuất phát", field: "postOfficeTrip.fromPostOffice.postOfficeName"
        },
        {
            title: "Điểm đến", field: "postOfficeTrip.toPostOffice.postOfficeName"
        },
        {
            title: "Giờ chạy", field: "scheduleDepartureTime"
        },
    ]
    const [comfirmAction, setConfirmAction] = useState({
        open: false,
        handleSuccess: undefined,
        content: undefined,
        title: undefined
    });
    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        title: undefined,
        message: undefined
    })
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handlechooseDateChange = (date) => {
        setChooseDate(date);
        refreshAssignment(date);
    }
    const handleCancelDialog = () => {
        setOpen(false);
    };

    const handleOnSelectionChange = (rows) => {
        setActiveAssignments(orderTableRef.state.data.filter(x => x.tableData.checked))
    };
    const getIcon = (row) => {
        switch (row.status) {
            case 'WAITING':
                return <Tooltip title={getToolTip(row)}><PauseCircleOutlineIcon /></Tooltip >
            case 'EXECUTING':
                return <Tooltip title={getToolTip(row)}><AlarmOnIcon /></Tooltip >
            case 'ARRIVED':
                return <Tooltip title={getToolTip(row)}><DoneIcon disabled /></Tooltip >
            default:
                return <Tooltip title={getToolTip(row)}><PlayArrowIcon style={{ color: 'red' }} /></Tooltip>
        }
    }

    const getNotificationIcon = (row) => {
        if (!row.havingOrder) return <Tooltip title={"Không có đơn hàng"}><NotificationsIcon disabled /></Tooltip>
        return <Tooltip title={'Có đơn hàng cần xử lý'}><NotificationsActiveIcon style={{ color: 'red' }} /></Tooltip>
    }

    const getToolTip = (row) => {
        switch (row.status) {
            case 'WAITING':
                return 'Chuyến xe đang chờ thực thi'
            case 'EXECUTING':
                return 'Chuyến xe đang thực thi'
            case 'ARRIVED':
                return 'Chuyến xe đến đích thành công'
            default:
                return 'Thực thi chuyến xe'
        }
    }
    const onClickNotificationActions = (row) => {
        setActiveAssignments([]);
        let newPostTrip = copyObj(row);
        newPostTrip.assignment = [...newPostTrip.assignment, ...availableAssignment]
        newPostTrip.assignment.forEach(assignment => {
            if (assignment.tableData)
                assignment.tableData.checked = false;
        })
        console.log(newPostTrip)
        setActiveTrip(newPostTrip);
        setOpen(true);
    }
    const onClickActions = (row) => {
        switch (row.status) {
            case 'WAITING':
                setAlertAction(
                    {
                        open: true,
                        message: 'Chuyến xe đang chờ thực thi !',
                        title: 'Thông báo'
                    }
                )
                break
            case 'EXECUTING':
                setConfirmAction(
                    {
                        open: true,
                        handleSuccess: {},
                        content: 'Chuyến xe đang thực thi'
                    }
                )
                break
            case 'ARRIVED':
                break
            default:
                let row1 = row
                setConfirmAction(
                    {
                        open: true,
                        handleSuccess: () => {
                            authPost(dispatch, token, '/execute-trip', {
                                postOfficeFixedTripId: row1.postOfficeFixedTripId,
                                status: "WAITING",
                                postShipOrderTripPostOfficeAssignmentIds: row1.assignment.map(assignment => assignment.postShipOrderPostOfficeTripAssignmentId)
                            })
                                .then((res) => {
                                    let newFixedTripExecutes = copyObj(fixedTripExecutes)
                                    newFixedTripExecutes[row1.postOfficeFixedTripId] = res.postOfficeFixedTripExecuteId
                                    setFixedTripExecutes(newFixedTripExecutes)
                                    row1.status = 'WAITING';
                                    row1.postOfficeFixedTripExecuteId = res.postOfficeFixedTripExecuteId;
                                    setFixedTripExecutes(newFixedTripExecutes);
                                    setOpen(false);
                                    setConfirmAction({ open: false })
                                    setAlertAction({
                                        open: true,
                                        message: 'Thực thi chuyến xe thành công, đang chờ xác nhận',
                                        title: 'Thông báo'
                                    })
                                })
                        },
                        content: 'thực thi chuyến xe',
                        title: 'Thực thi chuyến xe'
                    }
                )
        }
    }

    const handleRemoveAssignmnet = (assignment => {
        assignment.choosen = false;
        let newAvailableAssignment = copyObj(availableAssignment)
        let newData = copyObj(data);
        let newActiveTrip = copyObj(activeTrip);
        newAvailableAssignment.push(assignment);
        newData.forEach(fixedtrip => {
            fixedtrip.assignment = fixedtrip.assignment.filter(x => {
                return x.postShipOrderPostOfficeTripAssignmentId != assignment.postShipOrderPostOfficeTripAssignmentId
            })
            newAvailableAssignment.forEach(assignment => {
                if (assignment.postOfficeTrip.postOfficeTripId == fixedtrip.postOfficeTrip.postOfficeTripId) {
                    fixedtrip.havingOrder = true
                }
            })

        })
        newActiveTrip.assignment.forEach(x => {
            if (x.postShipOrderPostOfficeTripAssignmentId == assignment.postShipOrderPostOfficeTripAssignmentId)
                x.choosen = false
        })
        console.log(newActiveTrip)
        setActiveTrip(newActiveTrip)
        setData(newData)
        setAvailableAssignment(newAvailableAssignment)
    })

    const handleAddAssignmnet = () => {
        let activeAssignmentIds = activeAssignments.map(x => x.postShipOrderPostOfficeTripAssignmentId)
        let newAvailableAssignment = availableAssignment.filter(assignment => {
            return !activeAssignmentIds.includes(assignment.postShipOrderPostOfficeTripAssignmentId)
        })
        setAvailableAssignment(newAvailableAssignment)
        let newData = copyObj(data)
        newData.forEach(fixedtrip => {
            activeAssignments.forEach(assignment => {
                if (fixedtrip.postOfficeTrip.postOfficeTripId == assignment.postOfficeTrip.postOfficeTripId && fixedtrip.postOfficeFixedTripId == activeTrip.postOfficeFixedTripId) {
                    assignment.choosen = true
                    fixedtrip.assignment.push(assignment)
                }
            })
        })
        newData.forEach(fixedtrip => {
            fixedtrip.havingOrder = false
            newAvailableAssignment.forEach(assignment => {
                if (assignment.postOfficeTrip.postOfficeTripId == fixedtrip.postOfficeTrip.postOfficeTripId) {
                    fixedtrip.havingOrder = true
                }
            })
            if (fixedtrip.assignment.length > 0) {
                fixedtrip.havingOrder = true
            }
        })
        setData(newData);
        setOpen(false)
    }

    const orderColumn = [
        { title: "Mã đơn hàng", field: "postOrder.postShipOrderId", sorting: false },
        { title: "Người gửi", field: "postOrder.fromCustomer.postCustomerName", sorting: false },
        { title: "Người nhận", field: "postOrder.toCustomer.postCustomerName", sorting: false },
        { title: "Số điện thoại người gửi", field: "postOrder.fromCustomer.phoneNum", sorting: false },
        { title: "Số điện thoại người nhận", field: "postOrder.toCustomer.phoneNum" },
        { title: "Địa chỉ Người gửi", field: "postOrder.fromCustomer.postalAddress.address", sorting: false },
        { title: "Địa chỉ người nhận", field: "postOrder.toCustomer.postalAddress.address", sorting: false },
        {
            title: "", field: "",
            render: assignment => {
                return (
                    <IconButton color="primary"
                        onClick={(e) => { handleRemoveAssignmnet(assignment) }}
                        disabled={!assignment.choosen}
                    >
                        <IndeterminateCheckBoxIcon />
                    </IconButton>
                )
            }
        }
    ]

    useEffect(() => {
        authGet(dispatch, token, "/get-post-trip-list", {})
            .then((response) => {
                setData(response)
                authGet(dispatch, token, "/get-order-by-trip?fromDate=" + formatDate(chooseDate) + "&toDate=" + formatDate(chooseDate), {})
                    .then(res => {
                        setAvailableAssignment(res)
                        let newData = copyObj(response);
                        newData.forEach(fixedtrip => {
                            fixedtrip.assignment = []
                            fixedtrip.havingOrder = false
                            res.forEach(assignment => {
                                if (assignment.postOfficeTrip.fromPostOfficeId == fixedtrip.postOfficeTrip.fromPostOfficeId && assignment.postOfficeTrip.toPostOfficeId == fixedtrip.postOfficeTrip.toPostOfficeId) {
                                    fixedtrip.havingOrder = true
                                }
                            })
                        })
                        return newData;
                    })
                    .then((newData) => {
                        authGet(dispatch, token, "/get-post-execute-trip-list?date=" + formatDate(chooseDate), {})
                            .then(res => {
                                let newFixedTripExecutes = copyObj(fixedTripExecutes)
                                res.forEach(fixedTripExecute => {
                                    newData.forEach(fixedtrip => {
                                        if (fixedtrip.postOfficeFixedTripId == fixedTripExecute.postOfficeFixedTripId) {
                                            fixedtrip.assignment = [...fixedtrip.assignment, ...fixedTripExecute.postShipOrderFixedTripPostOfficeAssignments.map(postShipOrderFixedTripPostOfficeAssignment => {
                                                let assignment = postShipOrderFixedTripPostOfficeAssignment.postShipOrderTripPostOfficeAssignment;
                                                assignment.choosen = true;
                                                return assignment
                                            })]
                                            fixedtrip.havingOrder = true
                                            fixedtrip.status = fixedTripExecute.status;
                                            fixedtrip.postOfficeFixedTripExecuteId = fixedTripExecute.postOfficeFixedTripExecuteId;
                                        }
                                    })
                                })
                                setData(newData)
                                setFixedTripExecutes(newFixedTripExecutes)
                            })
                            .catch(err => errHandling(err))
                    })
                    .catch(err => errHandling(err))
            })
            .catch(err => errHandling(err))
    }, []);
    const refreshAssignment = (newChooseDate) => {
        authGet(dispatch, token, "/get-order-by-trip?fromDate=" + formatDate(newChooseDate) + "&toDate=" + formatDate(newChooseDate), {})
            .then(res => {
                console.log("/get-order-by-trip?fromDate=" + formatDate(newChooseDate) + "&toDate=" + formatDate(newChooseDate))
                let newData = copyObj(data);
                newData.forEach(fixedtrip => {
                    fixedtrip.assignment = []
                    res.forEach(assignment => {
                        if (assignment.postOfficeTrip.fromPostOfficeId == fixedtrip.postOfficeTrip.fromPostOfficeId && assignment.postOfficeTrip.toPostOfficeId == fixedtrip.postOfficeTrip.toPostOfficeId) {
                            fixedtrip.assignment.push(assignment)
                        }
                    })
                })
                setData(newData)
            })
    }
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <br />
            <Typography>Chọn ngày</Typography>
            <KeyboardDatePicker
                id="chooseDate"
                label=""
                placeholder=""
                onChange={handlechooseDateChange}
                style={{ width: 400, margin: 5 }}
                InputLabelProps={{
                    shrink: true,
                }}
                value={chooseDate}
                format='dd/MM/yyyy'
            />
            <Button
                color="primary"
                variant="outlined"
                style={{ marginTop: 10 }}
                onClick={
                    () => {
                        console.log(fixedTripExecutes);
                    }
                }
            >
                Test
            </Button>

            <MaterialTable
                className={classes.table}
                title="Danh sách chuyến xe"
                columns={taskListColumn}
                options={{
                    filtering: true,
                    search: true,
                    actionsColumnIndex: -1,
                    selection: false,
                }}
                localization={localization}
                data={data}
                tableRef={(ref) => setTableRef(ref)}
                actions={[
                    (postTrip) => ({
                        icon: () => getIcon(postTrip),
                        onClick: (event, postOrder) => onClickActions(postOrder),
                    }),
                    (postTrip) => ({
                        icon: () => getNotificationIcon(postTrip),
                        onClick: (event, postOrder) => onClickNotificationActions(postOrder),
                        disabled: !postTrip.havingOrder
                    })
                ]}
            />
            <ConfirmDialog
                confirmAction={comfirmAction}
                setConfirmAction={setConfirmAction}
            />
            <AlertDialog
                open={alertAction.open}
                setOpen={() => setAlertAction({
                    open: false,
                })}
                title={alertAction.title}
                message={alertAction.message}
            />
            <Dialog open={open} onClose={handleCancelDialog} fullWidth maxWidth>
                <DialogTitle>{"Danh sách đơn hàng"}</DialogTitle>
                <DialogContent>
                    <MaterialTable
                        className={classes.table}
                        title={"Danh sách đơn hàng"}
                        columns={orderColumn}
                        options={{
                            filtering: false,
                            search: false,
                            actionsColumnIndex: -1,
                            selection: true,
                            sorting: true,
                            draggable: true,
                            isFreeAction: false,
                            selectionProps: postOrder => {
                                return {
                                    disabled: postOrder.choosen ? true : false,
                                    color: 'primary'
                                }
                            }
                        }}
                        localization={localization}
                        data={activeTrip ? activeTrip.assignment : []}
                        onSelectionChange={rows => { handleOnSelectionChange(rows) }}
                        tableRef={(ref) => setOrderTableRef(ref)}
                    />
                    <Button
                        color="primary"
                        variant="outlined"
                        style={{ marginTop: 10 }}
                        onClick={() => handleAddAssignmnet()}
                    >
                        Lưu
                    </Button>
                </DialogContent>
            </Dialog>
        </MuiPickersUtilsProvider>
    );
}

function ConfirmDialog({ confirmAction, setConfirmAction }) {
    const token = useSelector((state) => state.auth.token);

    const handleSuccess = () => {
        confirmAction.handleSuccess();
    };

    const handleCancel = (event) => {
        setConfirmAction({
            open: false,
            handleSuccess: undefined,
            content: undefined,
            title: undefined,
        })
    };

    return (
        <div>
            <Dialog open={confirmAction.open} onClose={handleCancel}>
                <DialogTitle>{confirmAction.title}</DialogTitle>
                <DialogContent>
                    {"Xác nhận " + confirmAction.content + '?'}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSuccess} color="primary">
                        Xác nhận
                    </Button>
                    <Button onClick={handleCancel} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
