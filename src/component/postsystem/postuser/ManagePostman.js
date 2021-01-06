import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { API_URL } from "../../../config/config";
import TabPanel from "../TabPanel";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import {
    localization
} from '../../../utils/MaterialTableUtils';
import { errorNoti, infoNoti } from "../../../utils/Notification";
const columns = [
    { title: "Mã khách hàng", field: "postCustomerId" },
    { title: "Họ tên", field: "postCustomerName" },
    { title: "Số điện thoại", field: "phoneNum" },
    {
        title: "Địa chỉ", field: "postalAddress",
        render: postCustomer =>
        (<Link
            to={
                "/geo/location/map/" +
                postCustomer.postalAddress.contactMechId
            }
        >
            Xem địa chỉ
        </Link>), filtering: false
    }
]

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 440,
    },
});

export default function PostCustomerList(props) {
    const classes = useStyles();
    const token = useSelector((state) => state.auth.token);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [tableRef, setTableRef] = useState();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        fetch(API_URL + "/get-customer-list", {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "X-Auth-Token": token,
            },
        })
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
                setData(response);
            });
    }, data);

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
                    title="Danh sách khách hàng"
                    columns={columns}
                    options={{
                        filtering: true,
                        search: true,
                        actionsColumnIndex: -1,
                        selection: false,
                    }}
                    localization={localization}
                    data={data}
                    tableRef={(ref) => setTableRef(ref)}
                />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>


        </Paper >
    );
}

