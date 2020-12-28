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
import { DialogContent, Tooltip } from "@material-ui/core";
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

const statusIcon = {
    'default': <PlayArrowIcon />,
    'WATING': <PauseCircleOutlineIcon />,
    'ASSIGNED': <AlarmOnIcon />,
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
      ASSIGNED: đã tiếp nhận
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
export default function ExecuteTrip() {
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [chooseDate, setChooseDate] = useState(new Date());
    const [tableRef, setTableRef] = useState();
    const dispatch = useDispatch();
    const taskListColumn = [
        { title: "Mã số chuyến", field: "postOfficeFixedTripId" },
        {
            title: "Xuất phát", field: "postOfficetrip.fromPostOffice.postOfficeName"
        },
        {
            title: "Điểm đến", field: "postOfficetrip.toPostOffice.postOfficeName"
        },
        {
            title: "Giờ chạy", field: "scheduleDepartureTime"
        },
    ]
    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        content: undefined,
        title: undefined
    });
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handlechooseDateChange = (date) => {
        setChooseDate(date);
    }

    const getIcon = (row) => {
        switch (row.status) {
            case 'WAITING':
                return <Tooltip title={getToolTip(row)}><PauseCircleOutlineIcon /></Tooltip >
            case 'ASSIGNED':
                return <Tooltip title={getToolTip(row)}><AlarmOnIcon /></Tooltip >
            case 'ARRIVED':
                return <Tooltip title={getToolTip(row)}><DoneIcon disabled /></Tooltip >
            default:
                return <Tooltip title={getToolTip(row)}><PlayArrowIcon style={{ color: 'red' }} /></Tooltip>
        }
    }

    const getNotificationIcon = (row) => {
        return <NotificationsActiveIcon />
    }


    const getToolTip = (row) => {
        switch (row.status) {
            case 'WAITING':
                return 'Bắt đầu chuyến xe'
            case 'ASSIGNED':
                return 'Chuyến xe đang thực thi'
            case 'ARRIVED':
                return 'Chuyến xe đến đích thành công'
            default:
                return 'Thực thi chuyến xe'
        }
    }
    const onClickNotificationActions = (row) => {

    }
    const onClickActions = (row) => {
        switch (row.status) {
            case 'WAITING':
                setAlertAction(
                    {
                        open: true,
                        handleSuccess: () => {
                            data[row.postOfficeFixedTripId].status = 'ASSIGNED'
                        },
                        content: 'bắt đầu chuyến xe'
                    }
                )
            case 'ASSIGNED':
                setAlertAction(
                    {
                        open: true,
                        handleSuccess: {},
                        content: 'Chuyến xe đang thực thi'
                    }
                )
            default:
                setAlertAction(
                    {
                        open: true,
                        handleSuccess: () => {
                            data[row.postOfficeFixedTripId].status = 'WATING'
                        },
                        content: 'thực thi chuyến xe',
                        title: 'Thực thi chuyến xe'
                    }
                )
        }
    }

    const executetrip = (row) => {
        authPost(dispatch, token, "/execute-trip", {
            "postOfficeFixedTripId": "baffe995-8134-4381-bf23-36ea30546b3d",
            "status": "WAITING",
            "postShipOrderFixedTripPostOfficeAssignmentIds": [
                "eb958553-b48a-4dbd-824d-8d4f8c67d71c"
            ]
        })
    }

    useEffect(() => {
        fetch(API_URL + "/get-post-trip-list", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "X-Auth-Token": token,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                setData(response);
            });
    }, data);

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
                    })
                ]}
            />
            <AlerDialog
                alertAction={alertAction}
                setAlertAction={setAlertAction}
            />
        </MuiPickersUtilsProvider>
    );
}

function AlerDialog({ alertAction, setAlertAction }) {
    const token = useSelector((state) => state.auth.token);

    const handleSuccess = () => {
        alertAction.handleSuccess();
    };

    const handleCancel = (event) => {
        setAlertAction({
            open: false,
            handleSuccess: undefined,
            content: undefined,
            title: undefined,
        })
    };

    return (
        <div>
            <Dialog open={alertAction.open} onClose={handleCancel}>
                <DialogTitle>{alertAction.title}</DialogTitle>
                <DialogContent>
                    {"Xác nhận " + alertAction.content + '?'}
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