import React, { useEffect, useState } from "react";
import { tableIcons } from "../../utils/iconutil";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { authGet } from "../../api";

import { useHistory } from "react-router-dom";

export default function SalesmanCheckinRoutesHistory(){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const columns = [
        {title: "Salesman", field:"userLoginId"},
        {title: "Customer", field:"partyCustomer.customerName"},
        {title: "Location", field:"location"},
        {title: "Time-Point", field:"timePoint", defaultSort:"desc",type:"datetime"}
    ];

    return (
        <MaterialTable
        title="Orders"
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
              "/salesman-checkin-history" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
            ).then(
                
              res => {
                  console.log(res);
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
        onRowClick={(event, rowData) => {
          console.log("select ",rowData);
        }}
      />
    );
}