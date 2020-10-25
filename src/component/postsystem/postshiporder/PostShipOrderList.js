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
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import { API_URL } from "../../../config/config";
import { Link } from "react-router-dom";

const columns = [
    { label: "Mã đơn hàng", id: "postShipOrderId", minWidth: 150, type: 'normal' },
    { label: "Người gửi", id: "fromCustomer.postCustomerName", minWidth: 200, type: 'normal' },
    { label: "Người nhận", id: "toCustomer.postCustomerName", minWidth: 200, type: 'normal' },
    { label: "Tên hàng", id: "packageName", minWidth: 200, type: 'normal' },
    { label: "Khối lượng", id: "weight", minWidth: 150, type: 'normal' },
    { label: "Địa chỉ", id: "toCustomer.postalAddress", minWidth: 150, type: 'address' },
    { label: "Mô tả", id: "description", minWidth: 150, type: 'normal' },
    { label: "Trạng thái", id: "statusItem.description", minWidth: 150, type: 'normal' },
];

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

export default function PostShipOrderList(props) {
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deleteCallBack = (callbackData) => {
        let new_data = data.map((row) => {
            if (row.postShipOrderId == callbackData.postShipOrderId) return callbackData;
            else return row;
        })
        setData(new_data);
    };

    useEffect(() => {
        fetch(API_URL + "/get-list-order", {
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
                Danh sách đơn hàng
      </Typography>
            <Button
                component={Link}
                to={{ pathname: "/postoffice/viewallshiporder", state: { data: data } }}
                variant="contained"
                color="primary"
                style={{ margin: 10, float: "right" }}
            >
                Xem trên bản đồ
        </Button>
            <Button
                component={Link}
                to={"/postoffice/create"}
                variant="contained"
                color="primary"
                style={{ margin: 10, float: "right" }}
            >
                Thêm mới
        </Button>
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
                                            let value;
                                            column.id.split(".").reduce((prev, cur) => {
                                                if (prev) {
                                                    return value = prev[cur];
                                                }
                                                else {
                                                    return value = row[cur];
                                                }
                                            }, undefined)
                                            console.log(value)
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.type == "address" ? (
                                                        <Link
                                                            to={
                                                                "/geo/location/map/" +
                                                                value.contactMechId
                                                            }
                                                        >
                                                            Xem địa chỉ
                                                        </Link>
                                                    ) : (
                                                            value
                                                        )}
                                                </TableCell>
                                            );
                                        })}
                                        <TableCell>
                                            <DeleteButton
                                                data={row}
                                                callback={deleteCallBack}
                                            />
                                        </TableCell>
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
        </Paper>
    );
}

function DeleteButton(props) {
    const [open, setOpen] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const handleRemove = () => {
        setOpen(false);
        fetch(API_URL + "/delete-post-ship-order/" + props.data.postShipOrderId, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "X-Auth-Token": token,
            },
        });
        props.data.statusItem.statusId = 'ORDER_CANCELLED';
        props.data.statusItem.description = 'đã hủy';
        props.callback(props.data);
    };

    const handleCancel = (event) => {
        setOpen(false);
    };
    const handleDeleteClick = (event) => {
        console.log(event.currentTarget.value);
        if (event.currentTarget.value === 'ORDER_CANCELLED') {
            alert('Đơn hàng này đã huỷ.')
            return;
        }
        setOpen(true);
    };

    return (
        <div>
            <IconButton
                value={props.data.statusItem.statusId}
                aria-label="delete"
                align="right"
                onClick={handleDeleteClick}
            >
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={handleCancel}>
                <DialogTitle>{"Huỷ đơn hàng?"}</DialogTitle>
                <DialogContent>
                    {"Xác nhận huỷ đơn hàng đến " + props.data.toCustomer.postCustomerName}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRemove} color="primary">
                        Xóa
                    </Button>
                    <Button onClick={handleCancel} color="primary">
                        Hủy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
