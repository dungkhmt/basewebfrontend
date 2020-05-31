import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { authGet } from "../../api";

import MaterialTable from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { Typography, Card, CardContent } from "@material-ui/core";
import { MuiThemeProvider } from "material-ui/styles";

function SalesRouteDetail(props){ 
    const id = props.location.state.salesRoutePlanningPeriodId
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    // table
    const [data, setData] = useState([]);
    const [] = useState({})
    const columns = [
        {
            field:"salesmanName", 
            title: "Nhân viên bán hàng"
        },
        {
            field:"executeDate", 
            title: "Ngày",
            filtering: false
        },
        {
            field:"retailOutletName", 
            title: "Đại lý bán lẻ"
        },
        {
            field:"distributorName", 
            title: "Tên nhà phân phối",
            filtering: false
        },
        {
            field:"orderOfVisit", 
            title: "Thứ tự thăm",
            filtering: false
        }
    ]

    const getSalesRouteDetailOfPlanPeriod = () => {
        authGet(dispatch, token, "/get-sales-route-detail-of-plan-period/" + id)
            .then(res => setData(res))
    }

    useEffect(() => {
        getSalesRouteDetailOfPlanPeriod()
    }, [])

    return(
        <div>
           <MuiThemeProvider>
                <Card>
                    <CardContent>
                        <Typography 
                            variant='h6' 
                            style={{marginLeft: 10}}
                        >
                            Chi tiết tuyến bán hàng
                        </Typography>
                        <Typography 
                            variant='subtitle1' 
                            style={{marginLeft: 24}}
                        >
                            Giai đoạn làm tuyến: SalesRoute 
                            {" " + props.location.state.fromDate} đến 
                            {" " + props.location.state.toDate}
                        </Typography>
                        <br/>
                        <MaterialTable
                                title=""
                                columns={columns}
                                data={data}
                                icons={tableIcons}
                                localization={{
                                    header: {
                                        actions: ''
                                    },
                                    body: {
                                        emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                                        filterRow: {
                                            filterTooltip: 'Lọc'
                                        }
                                    }
                                }}
                                options={{
                                    search: false,
                                    filtering: true,
                                }}
                            />
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    );
}

export default SalesRouteDetail;