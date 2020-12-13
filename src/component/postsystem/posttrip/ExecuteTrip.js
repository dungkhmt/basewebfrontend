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
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
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

    const cell = (column, value) => {
        if (column.type === 'statusIcon') {
            switch (data.status) {
                case 'WAITING':
                    return <Button
                        onClick={() => {
                            setAlertAction(
                                {
                                    open: true,
                                    handleSuccess: () => {
                                        data[column.postOfficeFixedTripId].status = 'ASSIGNED'
                                    },
                                    content: 'bắt đầu chuyến xe'
                                }
                            )
                        }}><PauseCircleOutlineIcon /></Button>
                case 'ASSIGNED':
                    return <Button
                        onClick={() => {
                            setAlertAction(
                                {
                                    open: true,
                                    handleSuccess: () => {
                                        data[column.postOfficeFixedTripId].status = 'ARRIVED'
                                    },
                                    content: 'hoàn thành chuyến xe'
                                }
                            )
                        }}><AlarmOnIcon /></Button>
                case 'ARRIVED':
                    return <Button
                        disabled
                    ><DoneIcon /></Button>
                default:
                    return <Button
                        onClick={() => {
                            setAlertAction(
                                {
                                    open: true,
                                    handleSuccess: () => {
                                        data[column.postOfficeFixedTripId].status = 'WATING'
                                    },
                                    content: 'thực thi chuyến xe',
                                    title: 'Thực thi chuyến xe'
                                }
                            )
                        }}><PlayArrowIcon style={{ color: 'red' }} /></Button>
            }
        }
        else if (column.type === 'orderIcon') {
            if (column.order && column.order.size() > 0) {
                return <Button
                    onClick={() => {

                    }}><NotificationsActiveIcon color="red" /></Button>
            }
            else {
                return <Button disabled><NotificationsIcon /></Button>
            }
        }
        else return value;
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
        <Paper className={classes.root}>
            <Typography variant="h5" component="h2" align="center">
                Danh sách chuyến xe
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                    style={{ float: 'right' }}
                />
            </MuiPickersUtilsProvider>

            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {cell(column, value)}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                labelRowsPerPage="Số hàng"
                rowsPerPageOptions={[10, 20, 50, { value: -1, label: "Tất cả" }]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <AlerDialog
                alertAction={alertAction}
                setAlertAction={setAlertAction}
            />
        </Paper>
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