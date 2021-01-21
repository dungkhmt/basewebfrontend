import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import MaterialTable from "material-table";
import {
    localization
} from '../../../utils/MaterialTableUtils';
import { authGet } from "../../../api";
import { errorNoti } from "../../../utils/Notification";
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}
const columns = [
    { label: "Mã bưu cục", id: "postOfficeId", minWidth: 150 },
    { label: "Tên bưu cục", id: "postOfficeName", minWidth: 200 },
    { label: "", id: "planning", minWidth: 150 },
];

const columns1 = [
    { title: "Mã bưu cục", field: "postOfficeId" },
    { title: "Tên bưu cục", field: "postOfficeName" },
    {
        title: "", field: "",
        render: (row) => {
            return (
                <Link
                    to={{
                        pathname: "/postoffice/pickanddeliverydetail",
                        state: { postOfficeId: row.postOfficeId }

                    }}
                >
                    Tạo mới kế hoạch
                </Link>
            )
        }
    },
    {
        title: "Trạng thái", field: "status",
        lookup: {
            true: 'Có đơn cần xử lý',
            false: 'Không có đơn',
        },
        render: (row) => {
            {
                return row.status
                    ? <Tooltip title={'Có đơn cần xử lý'}><NotificationsActiveIcon style={{ color: 'red' }} /></Tooltip >
                    : <Tooltip title={'Hôm nay không có đơn nào'}><NotificationsIcon /></Tooltip >
            }
        }
    }
];

function formatDate(date) {
    return date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + date.getFullYear();
}

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

export default function PickAndDelivery(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const handleFromDateChange = (date) => {
        setFromDate(date);
        loadData(date, toDate);
    }
    const handleToDateChange = (date) => {
        setToDate(date);
        loadData(fromDate, date);
    }
    const loadData = (fromDate, toDate) => {
        authGet(dispatch, token, "/get-all-post-office-and-order-status?fromDate=" + formatDate(fromDate) + "&toDate=" + formatDate(toDate) + "&from=" + true)
            .then((response) => {
                setData(response);
            })
            .catch(err => errHandling(err))
    }
    useEffect(() => {
        loadData(fromDate, toDate);
    }, data);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Typography variant="h5" component="h2" align="center">
                Danh sách bưu cục
            </Typography>
            <br />
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
            <br />
            <MaterialTable
                className={classes.table}
                title="Danh sách người vận chuyển"
                columns={columns1}
                options={{
                    filtering: true,
                    search: false,
                    actionsColumnIndex: -1,
                }}
                localization={localization}
                data={data}
            />
        </MuiPickersUtilsProvider>
    );
}
