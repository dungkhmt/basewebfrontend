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
import MaterialTable from "material-table";
import {
  localization
} from '../../../utils/MaterialTableUtils';
import { authDelete } from "../../../api";
import { errorNoti } from "../../../utils/Notification";
import { useDispatch } from "react-redux";

function errHandling(err) {
  if (err.message == "Unauthorized")
    errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
  else
    errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
  console.trace(err);
}
const columns = [
  { title: "Mã bưu cục", field: "postOfficeId" },
  { title: "Tên bưu cục", field: "postOfficeName" },
  { title: "Địa chỉ", field: "postalAddress.address" },
  { title: "Cấp bưu cục", field: "postOfficeLevel" },
  {
    title: "Chi tiết",
    render: (row) => {
      return <Link
        to={
          "/geo/location/map/" +
          row.postalAddress.contactMechId
        }
      >
        Xem địa chỉ
    </Link>
    }
  }
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function PostOfficeList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);

  const deletePostOffice = (postOffice) => {
    authDelete(dispatch, token, "/delete-post-office/" + postOffice.postOfficeId)
      .catch(err => errHandling(err));
    props.callback(props.postOffice.postOfficeId);
  }

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
      <Button
        component={Link}
        to={{ pathname: "/postoffice/viewallpostoffice", state: { data: data } }}
        variant="contained"
        color="primary"
        style={{ margin: 10, float: "right" }}
      >
        Xem tất cả
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
      <Upload
        url={'upload-post-office-list'}
        token={token}
        buttonTitle={'Tải lên danh sách bưu cực'}
        style={{ margin: 10, float: "right" }}
        handleSaveCallback={() => window.location.reload()}
      />
      <br />
      <MaterialTable
        className={classes.table}
        title="Danh sách bưu cục"
        columns={columns}
        options={{
          filtering: true,
          search: false,
          actionsColumnIndex: -1,
        }}
        localization={localization}
        data={data}
        actions={[
          (postOffice) => ({
            icon: 'delete',
            tooltip: 'Xóa',
            onClick: (event, postOrder) => deletePostOffice(postOffice)
          })
        ]}
      />
    </Paper>
  );
}

