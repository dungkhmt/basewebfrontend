
import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { makeStyles } from '@material-ui/core/styles';
import { API_URL } from "../../config/config";

function RetailOutletList(props){
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    const [retailoutlets, setRetailoutlets] = useState([]);

    const columns =[
        {field:'partyId',title:'Party Id'},
        {field:'retailOutletCode', title:'Mã Đại lí bán lẻ'},
        {field:'retailOutletName', title:'Tên Đại lí bán lẻ'}
    ];
    const requestOptionsGet = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',"X-Auth-Token": token}
    };

    function getListRetailOutlets(){
        fetch(API_URL + '/get-retail-outlets-of-userlogin-salesman', requestOptionsGet)
        .then(response => response.json())
        .then(response =>{
			console.log(response);
			let arr = [];
			response.forEach(d => {
				arr.push(d);
			});
            setRetailoutlets(arr);
            //console.log('getDepartmentList = ',departments);
        });      
    }
    useEffect(() => {
        getListRetailOutlets();
    },[] );

    return(
        <div>
            <MaterialTable 
                options={{search: false, filtering:false}} 
                title={"Danh sách đại lí bán lẻ"} 
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
                            "/get-page-retail-outlets-of-userlogin-salesman" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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

export default RetailOutletList;