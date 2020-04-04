import React, { Component } from 'react';
import MaterialTable from "material-table";
import {authGet} from "../../api";
import {tableIcons} from "../../utils/iconutil";
import {useDispatch, useSelector} from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";


function GeoListDistanceInfo(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const columns = [
        {field: 'addressStart', title: 'Địa chỉ đầu'},
        {field: 'addressEnd', title: 'Địa chỉ cuối'},
        {field: 'distance', title: 'Khoảng cách'},
        {field: 'travelTime', title: 'Thời gian di chuyển'},
        {field: 'travelTimeMotobike', title: 'Thời gian đi bằng xe máy'},
        {field: 'travelTimeTruck', title: 'Thời gian đi bằng xe tải'},
        {field: 'enumId', title:'Nguồn'},
        {title: '', render: rowData => <Link to={"/geo/change/distance-detail/"+rowData.idStart+"/"+rowData.idEnd}><Button color="primary" variant="contained">Sửa</Button></Link>}

    ];

    return (

        <div>
            <MaterialTable
                title="Bảng thông tin khoảng cách "
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
                            "/get-list-distance-info" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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
        </div>

    );

}


export default GeoListDistanceInfo;

