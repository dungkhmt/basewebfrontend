import React, {Component, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../../api";
import {failed} from "../../../action";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import {tableIcons} from "../../../utils/iconutil";

function DepotContainerList(props) {

    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const columns = [
        {field: "depotContainerId", title:"Mã bãi"},
        {field: "depotContainerName", title: "Tên bãi"},
        {field: "address", title: "Địa chỉ "}
    ]
    const [isRequesting, setIsRequesting] = useState(false);



    return (

        <div>
            <MaterialTable
                title="Danh sách bãi container "
                columns={columns}
                options={{
                    filtering: true,
                    search: false
                }}
                data={query =>
                    new Promise((resolve, reject) => {
                        console.log(query);
                        let sortParam="";
                        if(query.orderBy!==undefined){
                            sortParam="&sort="+query.orderBy.field+','+query.orderDirection;
                        }
                        let filterParam="";
                        if(query.filters.length>0){
                            let filter=query.filters;
                            filter.forEach(v=>{
                                filterParam=v.column.field+"="+v.value+"&"
                            })
                            filterParam="&"+filterParam.substring(0,filterParam.length-1);
                        }

                        authGet(
                            dispatch,
                            token,
                            "/get-list-depot-container-page" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
                        ).then(
                            res => {

                                resolve({
                                    data: res.content,
                                    page: res.number,
                                    totalCount: res.totalElements

                                });

                            },
                            error => {
                                console.log("error");
                            }
                        );
                    })
                }
                icons={tableIcons}
                onRowClick={(event    , rowData) => {
                    console.log("select ",rowData);
                }}
            />
            <CardActions>
                <Link to={"/depotcontainerfunc/create"}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        {isRequesting ? <CircularProgress /> : "Thêm mới"}
                    </Button>
                </Link>

                <Link to={"/depotcontainerfunc/googleMap"}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        {isRequesting ? <CircularProgress /> : "Xem trên bản đồ"}
                    </Button>
                </Link>

            </CardActions>

        </div>


    );

}

export default DepotContainerList;