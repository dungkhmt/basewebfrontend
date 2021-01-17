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
import { API_URL } from "../../../config/config";
import { Link } from "react-router-dom";
const columns = [
    { label: "Mã bưu cục", id: "postOfficeId", minWidth: 150 },
    { label: "Tên bưu cục", id: "postOfficeName", minWidth: 200 },
    { label: "", id: "planning", minWidth: 150 },
];

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

export default function ShipAndDelivery(props) {
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

    useEffect(() => {
        fetch(API_URL + "/get-all-post-office", {
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
                Danh sách bưu cục
            </Typography>
            <br />
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
                                                    {column.id === "planning" ? (
                                                        <Link
                                                            to={{
                                                                pathname: "/postoffice/shipanddeliverydetail",
                                                                state: { postOfficeId: row.postOfficeId }

                                                            }}
                                                        >
                                                            Tạo mới kế hoạch
                                                        </Link>
                                                    ) : (
                                                            value
                                                        )}
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
        </Paper >
    );
}
