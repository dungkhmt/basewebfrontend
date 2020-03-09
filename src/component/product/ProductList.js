import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import {authGet, authPost} from "../../api";
import {failed} from "../../action";
import MenuItem from "@material-ui/core/MenuItem";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import {TableRowColumn} from "material-ui";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
});



function ProductList(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [productFrontendInfos,setProductFrontendInfos] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);


    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
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