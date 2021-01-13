import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import TabPanel from "../TabPanel";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MaterialTable from "material-table";
import {
    localization
} from '../../../utils/MaterialTableUtils';
import { errorNoti, infoNoti } from "../../../utils/Notification";
import { authPost, authGet } from "../../../api";
import AlertDialog from "../../../utils/AlertDialog";
import { Link } from "react-router-dom";

const postmanColumns = [
    { title: "Mã người dùng", field: "postmanId", editable: false },
    { title: "Họ tên", field: "postmanName" },
    {
        title: "Mã bưu cục", field: "postOfficeId",
        render: postman => postman.postOfficeId ? postman.postOfficeId : null
    },
    {
        title: "Tên bưu cục", field: "postOffice.postOfficeName",
        editable: false,
    }
]
const postDriverColumns = [
    { title: "Mã người dùng", field: "postDriverId", editable: false },
    { title: "Họ tên", field: "postDriverName" },
    {
        title: "Chi tiết", field: "", editable: false, filtering: false,
        render:  postDriver =>
            (<Link
                to={
                    "/postoffice/post-driver-detail/" +
                    postDriver.postDriverId
                }
            >
                Xem chi tiết chuyến xe
            </Link>), filtering: false
    },
]
const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}


export default function ManagePostman(props) {
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);
    const [postmanData, setPostmanData] = useState([]);
    const [postDriverData, setPostDriverData] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [postmanTableRef, setPostmanTableRef] = useState();
    const [postDriverTableRef, setPostDriverTableRef] = useState();
    const dispatch = useDispatch();
    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        title: undefined,
        message: undefined
    })

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const loadData = async () => {
        await Promise.all([
            authGet(dispatch, token, "/get-postman-list/", {})
                .then((response) => {
                    setPostmanData(response);
                }),
            authGet(dispatch, token, "/get-post-driver-list/", {})
                .then((response) => {
                    setPostDriverData(response);
                })
        ]).catch(err => errHandling(err))
    }

    useEffect(() => {
        loadData();
    }, []);

    const postmanUpdate = ((newData, oldData) => {
        authPost(dispatch, token, "/update-postman", {
            postmanId: oldData.postmanId,
            postmanName: newData.postmanName,
            postOfficeId: newData.postOfficeId
        })
            .then((response) => {
                if (response.status == 'ERROR') {
                    setAlertAction({
                        open: true,
                        message: 'Không có mã bưu cục này, vui lòng kiểm tra lại.',
                        title: 'Thông báo'
                    })
                    return
                }
                const dataUpdate = [...postmanData];
                const index = oldData.tableData.id;
                newData.postOffice = response.postman.postOffice
                dataUpdate[index] = newData;
                setPostmanData([...dataUpdate]);
                setAlertAction({
                    open: true,
                    message: 'Cập nhật thông tin thành công',
                    title: 'Thông báo'
                })

            })
            .catch(err => errHandling(err))
    })

    return (
        <Paper className={classes.root}>
            <AppBar position="static">
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                    <Tab label="Bưu tá" />
                    <Tab label="Lái xe" />
                </Tabs>
            </AppBar>
            <TabPanel value={tabValue} index={0}>
                <MaterialTable
                    className={classes.table}
                    title="Danh sách bưu tá"
                    columns={postmanColumns}
                    options={{
                        filtering: true,
                        search: true,
                        actionsColumnIndex: -1,
                        selection: false,
                    }}
                    localization={localization}
                    data={postmanData}
                    tableRef={(ref) => setPostmanTableRef(ref)}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                postmanUpdate(newData, oldData);
                                resolve();
                            })
                    }}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <MaterialTable
                    className={classes.table}
                    title="Danh sách lái xe"
                    columns={postDriverColumns}
                    options={{
                        filtering: true,
                        search: true,
                        actionsColumnIndex: -1,
                        selection: false,
                    }}
                    localization={localization}
                    data={postDriverData}
                    tableRef={(ref) => setPostDriverTableRef(ref)}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                postmanUpdate(newData, oldData);
                                resolve();
                            })
                    }}
                />
            </TabPanel>
            <AlertDialog
                open={alertAction.open}
                setOpen={() => setAlertAction({
                    open: false,
                })}
                title={alertAction.title}
                message={alertAction.message}
            />
        </Paper >
    );
}

