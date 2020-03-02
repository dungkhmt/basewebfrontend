import React, { useEffect, useState } from "react";
import { tableIcons } from "../../utils/iconutil";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { authGet } from "../../api";
import {connect} from "react-redux";
//import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import { CircularProgress } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
function OrderList(props){
    const dispatch = useDispatch();
    const token = useSelector(state => state.auth.token);
    const history = useHistory();
    
    const [isRequesting, setIsRequesting] = useState(false);
    const columns = [
        {title: "orderId", field:"orderId",  render: rowData => <Link to={"/orders/"+rowData.orderId} >{rowData.orderId}</Link>},
        {title: "order date", field:"orderDate", defaultSort:"desc",type:"datetime"},
        {title: "salesman", field:"salesmanName"},
        {title: "customer", field:"customerName"},
        {title: "vendor", field:"vendorName"},
        {title: "Total", field:"total"}
    ];

    const handleSubmit = () => {
      history.push("/orders/create");
    }
    return (
        <div>
        <CardActions>
          <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {isRequesting ? <CircularProgress /> : "Thêm mới"}
          </Button>
        </CardActions>

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
              "/orders" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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

        </div>
    );
}

const mapStateToProps = state => ({
    token: state.auth.token
  });
  
  const mapDispatchToProps = dispatch => ({});
  
  export default connect(mapStateToProps, mapDispatchToProps)(OrderList);