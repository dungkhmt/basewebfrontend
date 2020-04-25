
import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from "../../config/config";
import { Link } from "react-router-dom";

function DistributorList(props){
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    const [distributors, setDistributors] = useState([]);

    const columns =[
        {title:'Party Id',render: rowData => <Link to={'/distributor/' + rowData['partyId']}>{rowData['partyId']}</Link>},
        {field:'distributorCode', title:'Mã NPP'},
        {field:'distributorName', title:'Tên NPP'}
    ];
    const requestOptionsGet = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',"X-Auth-Token": token}
    };

    function getListDistributors(){
        fetch(API_URL + '/get-distributors-of-userlogin-salesman', requestOptionsGet)
        .then(response => response.json())
        .then(response =>{
			console.log(response);
			let arr = [];
			response.forEach(d => {
				arr.push(d);
			});
            setDistributors(arr);
            //console.log('getDepartmentList = ',departments);
        });      
    }
    useEffect(() => {
        getListDistributors();
    },[] );

    return(
        <div>
            <MaterialTable 
                options={{search: false, filtering:false}} 
                title={"Danh sách nhà phân phối"} 
                columns={columns}
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
                            "/get-page-distributors-of-userlogin-salesman" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
                        ).then(
                            res => {
                                console.log("res = ",res);
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

export default DistributorList;