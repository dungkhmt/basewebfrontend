import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import {FlatButton} from "material-ui";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {failed} from "../../action";


function DetailSalesman(props){
    const { partyId } = useParams();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();

    const handleDelete = (Id)=>{
        //authGet(dispatch,token,"/delete-customer-distributor-salesman/"+Id)
        authGet(dispatch,token,"/delete-retail-outlet-distributor-salesman/"+Id)
            .then(
                res => {
                    console.log(res);
                    if (res.status === 401) {
                        dispatch(failed());
                        throw Error("Unauthorized");
                    } else if (res.status === 409) {
                        alert("Id exits!!");
                    } else if (res.status === 201) {
                        return res.json();
                    }
                },
                error => {
                    console.log(error);
                }
            )
        window.location.reload();
    }

    const columns = [
        {title: "Mã đại lí bán lẻ", field: "partyId"},
        {title: "Tên đại lí bán lẻ", field: "retailOutletName"},
        {title: "Địa chỉ", field: "address"},
        {title: "Tên nhà phân phối", field: "partyDistributorName"},
        {title: "", render: rowData => <Button color="primary" variant="contained" onClick={() => handleDelete(rowData.retailOutletSalesmanVendorId)}>Xoa</Button> }
    ]







    return (

        <div>
            <Button
                type="submit"
                color="primary"
                variant="contained"
                component={Link}
                to={process.env.PUBLIC_URL + "/sales/add/"+partyId}
            >
                Thêm mới
            </Button>
            <MaterialTable
                title="Danh sách cửa hàng và nhà phân phối phụ trách"
                columns={columns}
                options={{
                    filtering: false,
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
                            "/salesman-detail/"+ partyId+"?size=" + query.pageSize + "&page=" + query.page+sortParam+filterParam
                        ).then(
                            res => {
                                console.log("res.content = ",res.content);
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

export default DetailSalesman;