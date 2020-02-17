import React, { useEffect, useState } from "react";
import { tableIcons } from "../../utils/iconutil";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { authGet } from "../../api";

import { useHistory, Link } from "react-router-dom";

export default function UserList() {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = useSelector(state => state.auth.token);
  const columns = [
    { title: "Full Name", field: "fullName" },
    { title: "Status", field: "status", lookup: { 'PARTY_ENABLED': 'PARTY_ENABLED', 'PARTY_DISABLED': 'PARTY_DISABLED' }},
    { title: "Type", field: "partyType"},
    { title: "Created Date", field: "createdDate", type:'date' },
    { title: "User Name", field: "userLoginId",  render: rowData => <Link to={"/userlogin/"+rowData.partyId} >{rowData.userLoginId}</Link>},
    { title: "Party Code", field: "partyCode" },

  ];
  return (
    <MaterialTable
      title="List Users"
      columns={columns}
      options={{
        //filtering: true,
        search: true
      }}
      data={query =>
        new Promise((resolve, reject) => {
          console.log(query);
          let sortParam="";
          if(query.orderBy!==undefined){
            sortParam="&sort="+query.orderBy.field+','+query.orderDirection;
          }
          let filterParam="";
          //if(query.filters.length>0){
          //    let filter=query.filters;
          //    filter.forEach(v=>{
          //      filterParam=v.column.field+":"+v.value+","
          //    })
          //    filterParam="&filtering="+filterParam.substring(0,filterParam.length-1);
          //}
          filterParam = "&search=" + query.search;
          authGet(
            dispatch,
            token,
            "/users" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+ filterParam
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
      
    />
  );
}
