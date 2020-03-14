import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { makeStyles } from '@material-ui/core/styles';



function CustomerList(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const columns =[
        {field:'partyId',title:'Party Id'},
        {field:'type',title:'Type'},
        {field:'customerCode', title:'Customer Code'},
        {field:'customerName', title:'Customer Name'}
    ];

    return (
        <MaterialTable
            title="List product"
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
                        "/customers" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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
    );
}

export default  CustomerList;