import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";

import {authGet, authPost} from "../../api";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import {failed} from "../../action";
import jsPDF from 'jspdf'
import 'jspdf-autotable'








function ProductList(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [productList,setProductList] = new useState([]);


    const doc = new jsPDF({
        unit: 'pt',
        orientation: 'p',
        //lineHeight: 1.2
    });



    const createData = (id,name,type,uom)=>{
        return {id,name,type,uom};
    }





    const columns = [
        {field:'productId',title:'Id'},
        {field:'productName',title: 'Name'},
        {field:'productTypeDescription',title:'Type'},
        {field:'uomDescription',title:'Uom'}

    ];

    const handleSubmit = ()=>{






        doc.save('table.pdf')

    }

    return (

        <div>
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
                                console.log("res",res.content);
                                doc.setFont('courier', 'italic');

                                doc.autoTable({
                                    head: [['Id','Name', 'Type', 'Uom']],
                                    body:
                                        res.content.map(p=>[p.productId,p.productName,p.productTypeDescription,p.uomDescription])


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
            <button onClick={handleSubmit}>generatepdf</button>
        </div>

    );


}

export default ProductList;