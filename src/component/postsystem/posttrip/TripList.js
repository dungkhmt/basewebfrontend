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
import Upload from "../../../utils/Upload";
import Autocomplete from "@material-ui/lab/Autocomplete";
const columns = [
  {
    label: "Mã số chuyến",
    id: "postOfficeFixedTripId",
    minWidth: 150,
    type: "normal",
  },
  {
    label: "Xuất phát",
    id: "postOfficeTrip.fromPostOffice.postOfficeName",
    minWidth: 200,
    type: "normal",
  },
  {
    label: "Điểm đến",
    id: "postOfficeTrip.toPostOffice.postOfficeName",
    minWidth: 150,
    type: "normal",
  },
  { label: "Từ ngày", id: "fromDate", minWidth: 150, type: "date" },
  { label: "Đến ngày", id: "thruDate", minWidth: 150, type: "date" },
  {
    label: "Giờ đi",
    id: "scheduleDepartureTime",
    minWidth: 50,
    type: "normal",
  },
  { label: "Chi tiết", id: "postalAddress", minWidth: 150, type: "address" },
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
  var day = "0" + date.getDate();
  var month = "0" + (date.getMonth() + 1);
  var year = date.getFullYear();
  return day.substr(-2) + "-" + month.substr(-2) + "-" + year;
}

export default function TripList() {
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

  const deleteCallBack = (postOfficeFixedTripId) => {
    setData(
      data.filter((item) => item.postOfficeFixedTripId != postOfficeFixedTripId)
    );
  };

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
      <Button
        component={Link}
        to={{
          pathname: "/postoffice/viewallpostoffice",
          state: { data: data },
        }}
        variant="contained"
        color="primary"
        style={{ margin: 10, float: "right" }}
      >
        Xem tất cả
      </Button>
      <Button
        component={Link}
        to={"/postoffice/createtrip"}
        variant="contained"
        color="primary"
        style={{ margin: 10, float: "right" }}
      >
        Thêm mới
      </Button>
      <Upload
        url={"upload-post-office-list"}
        token={token}
        buttonTitle={"Tải lên danh sách bưu cực"}
        style={{ margin: 10, float: "right" }}
        handleSaveCallback={() => window.location.reload()}
      />
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
                          return (value = prev[cur]);
                        } else {
                          return (value = row[cur]);
                        }
                      }, undefined);
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.type === "address" ? (
                            <Link
                              to={{
                                pathname: "/postoffice/tripinfo",
                                state: {
                                  value: row,
                                },
                              }}
                            >
                              Xem địa chỉ
                            </Link>
                          ) : column.type === "date" ? (
                            formatDate(new Date(value))
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <DeleteButton postTrip={row} callback={deleteCallBack} />
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
    fetch(
      API_URL + "/delete-post-trip/" + props.postTrip.postOfficeFixedTripId,
      {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "X-Auth-Token": token,
        },
      }
    );
    props.callback(props.postTrip.postOfficeFixedTripId);
  };

  const handleCancel = (event) => {
    setOpen(false);
  };

  const handleDeleteClick = (event) => {
    console.log(event.currentTarget.value);
    setOpen(true);
  };

  return (
    <div>
      <IconButton
        value={props.postTrip}
        aria-label="delete"
        align="right"
        onClick={handleDeleteClick}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>{"Xóa chuyến xe?"}</DialogTitle>
        <DialogContent>
          {"Xác nhận chuyến xe " + props.postTrip.postOfficeFixedTripId}
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
