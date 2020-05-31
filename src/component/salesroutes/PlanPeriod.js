import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form'
import { authPost, authGet } from "../../api";
import { useHistory, Link, useParams } from 'react-router-dom'
import moment from "moment"
import MaterialTable, { MTableToolbar } from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { Typography, Card, CardContent, Box } from "@material-ui/core";
import { IconButton, Toolbar } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import { FcViewDetails, FcRadarPlot } from 'react-icons/fc';
import { RiMenuAddLine } from 'react-icons/ri'
import { IconContext } from "react-icons/lib/cjs";
import SelectSalesmanDialog from './SelectSalesmanDialog'

function PlanPeriod(props){ 
    const history = useHistory()
    const id = props.location.state.salesRoutePlanningPeriodId
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    // Select Salesman Modal
    const [salesmans, setSalesmans] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false);

    // Table
    const [data, setData] = useState([]);
    const columns = [
        {
            field:"retailOutletCode", 
            title: "Mã ĐLBL",
            filtering: false
        },
        {
            field:"retailOutletName", 
            title: "Tên ĐLBL",
            filtering: false
        },
        {
            field:"salesmanName", 
            title: "NVBH"
        },
        {
            field:"distributorName", 
            title: "Tên NPP",
            filtering: false
        },
        {
            field:"visitFrequency", 
            title: "Tần suất thăm",
            filtering: false
        },
        {
            field:"visitConfig", 
            title: "Cấu hình thăm",
            filtering: false
        },
        {
            field:"repeatWeek", 
            title: "Tuần lặp",
            filtering: false
        }
    ]

    const getSalesroutesConfigRetailOutlets = () => {
        authGet(dispatch, token, "/get-sales-route-config-retail-outlets/" + id)
            .then(res => {
                // Filter salesman
                // Solution 1: use map
                const output = [];
                const map = new Map();
                
                for (const item of res) {
                    if(!map.has(item.salesmanName)){
                        map.set(item.salesmanName, true);    // set any value to Map, 
                        output.push({
                            salesmanName: item.salesmanName,
                            partySalesmanId: item.partySalesmanId
                        });
                    }
                }

                setSalesmans(output)

                // Solution 2: use filter method
                // setSalesmans( res.filter((saleman, index, self) => (
                //     index === self.findIndex(s => (s.salesmanName === saleman.salesmanName)     
                // ))))

                // Solution 3: use third-party library: ramda,...

                console.log(res)
                setData(res)
            })
    }

    const onClickDetailButton = () => {
        history.push({
            pathname: "/salesroutes/plan/period/detail",
            state: {"salesRoutePlanningPeriodId": id,
                    "fromDate": props.location.state.fromDate,
                    "toDate": props.location.state.toDate
            }
        })
    }

    const onClickGSRDButton = () => {
        setDialogOpen(true)
    }

    const onClickCreatButton = () => {
        history.push({
            pathname: "/salesroutes/plan/period/add/visit-confirguration",
            state: {"salesRoutePlanningPeriodId": id,
                    "fromDate": props.location.state.fromDate,
                    "toDate": props.location.state.toDate
            }
        })
    }

    const handleDialogClose = partySalesmanId => {
        setDialogOpen(false);

        if (partySalesmanId !== undefined) {
            authPost(
                dispatch, 
                token, 
                "/generate-sales-route-detail", 
                {
                    partySalesmanId: partySalesmanId,
                    salesRoutePlanningPeriodId: id
                }
            )
                .then(res => res.json())
                    .then(() => {
                        onClickDetailButton()
                    })
        }
      };

    useEffect(() => {
        getSalesroutesConfigRetailOutlets()
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
                            Thiết lập cấu hình viếng thăm cho đại lý bán lẻ
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
                                title="Danh sách cấu hình viếng thăm"
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
                                actions={[
                                    rowData => ({
                                    icon: 'edit',
                                    tooltip: 'Sửa',
                                    isFreeAction: true,
                                    onClick: rowData => history.push("/salesroutes/plan") 
                                    })
                                ]}
                                options={{
                                    search: false,
                                    filtering: true,
                                    actionsColumnIndex: -1
                                }}
                                components={{
                                    Toolbar: props => (
                                        <div>
                                            <MTableToolbar {...props} />                                                                      
                                                <Box
                                                    display='flex'
                                                    justifyContent='flex-end'
                                                    width='98%'
                                                >
                                                    <IconButton 
                                                        children={  <IconContext.Provider>
                                                                        <FcViewDetails style={{fontSize: 24}}/>
                                                                    </IconContext.Provider>}
                                                        size='medium'
                                                        tooltip='Xem chi tiết tuyến'
                                                        style={{marginLeft: 25}}
                                                        onClick={onClickDetailButton}
                                                    />
                                                    <IconButton 
                                                        children={  <IconContext.Provider>
                                                                        <FcRadarPlot style={{fontSize: 24}}/>
                                                                    </IconContext.Provider>}
                                                        size='medium'
                                                        tooltip='Sinh chi tiết tuyến'
                                                        onClick={onClickGSRDButton}
                                                    />
                                                    <IconButton 
                                                        children={  <IconContext.Provider>
                                                                        <RiMenuAddLine style={{fontSize: 24}}/>
                                                                    </IconContext.Provider>}
                                                        size='medium'
                                                        tooltip='Thêm mới'
                                                        onClick={onClickCreatButton}
                                                    />
                                                </Box>                                                                
                                        </div>
                                    )
                                }}
                            />
                            <SelectSalesmanDialog 
                                items={salesmans}
                                open={dialogOpen} 
                                onClose={handleDialogClose}
                            />
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    );
}

export default PlanPeriod;