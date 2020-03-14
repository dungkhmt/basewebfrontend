import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";

import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { makeStyles } from '@material-ui/core/styles';







function ProductList(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();







    const columns = [
        {field:'productId',title:'Id'},
        {field:'productName',title: 'Name'},
        {field:'productTypeDescription',title:'Type'},
        {field:'uomDescription',title:'Uom'}

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
                        "/get-list-product-frontend" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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

export default ProductList;