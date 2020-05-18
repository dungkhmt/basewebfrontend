import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { authPost } from "../../api";
import {Link} from 'react-router-dom'
import { Card } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import {  CardContent } from "@material-ui/core";

function ListSalesman(){
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    // Table
    const [data, setData] = useState([{
        salesmanCode: "SM00001",
        salesmanName: "Nguyen Van A",
        noRetailOutlets: 3,
        noDistributors: 2
    }]);
    const columns = [
        {
            field:"salesmanCode", 
            title: "Mã NVBH",
            render: rowData => <Link to={'/salesroutes/salesman/detail/' + rowData['salesmanCode']}>{rowData['salesmanCode']}</Link>
        },
        {
            field:"salesmanName", 
            title: "Tên NVBH",
        },
        {
            field:"noRetailOutlets", 
            title: "Số ĐLBL"
        },
        {
            field:"noDistributors", 
            title: "Số NPP"
        }
    ]

    return(
        <div>
           <MuiThemeProvider>
                <Card>
                    <CardContent>
                        <MaterialTable
                            title="Danh sách nhân viên bán hàng"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            options={{
                                search: false,
                                actionsColumnIndex: -1
                            }}
                            localization={{
                                header: {
                                    actions: ''
                                },
                                body: {
                                    emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                                }
                            }} 
                        />
                    </CardContent>
                </Card>
           </MuiThemeProvider>
           
        </div>
    );
}

export default ListSalesman;