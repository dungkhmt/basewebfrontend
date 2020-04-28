import React, { useEffect, useState } from "react";
import { tableIcons } from "../../../utils/iconutil";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { authGet } from "../../../api";

import { useHistory, Link } from "react-router-dom";

import Button from "@material-ui/core/Button";
import  {MTableToolbar} from "material-table";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

function DriverList(props) {

    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();


    const columns = [
        {title: "Mã Tài xế", field:"partyId", render: rowData => <Link to={"/driver/"+rowData.partyId}>{rowData.partyId}</Link>},
        {title: "Tên Tài xế", field:"fullName"}
        
    ]






    return (

        <div>
            <MaterialTable
                title="Danh sách tài xế"
                columns={columns}
                options={{
                    filtering: false,
                    search: false
                }}

                components={{
                    Toolbar: props => (
                      <div>
                        <MTableToolbar {...props} />
                        <Grid container spacing={3}>
                          <Grid item xs={8} style={{textAlign: 'left', padding: '0px 30px 20px 30px'}}>
                          </Grid>
                          <Grid item xs={4}
                                style={{verticalAlign: 'text-bottom', textAlign: 'right', padding: '0px 50px 10px 30px'}}>
                            <Link to={'/driver/create'}>
                              <Button color={'primary'} variant={'contained'} startIcon={<AddIcon/>}> Thêm mới </Button>
                            </Link>
                          </Grid>
                        </Grid>
                      </div>
                    )
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
                            "/get-all-drivers" + "?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
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
                onRowClick={(event    , rowData) => {
                    console.log("select ",rowData);
                }}
            />
        </div>

    );
}


export default DriverList;


