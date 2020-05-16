import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form'
import { authPost } from "../../api";
import { useHistory } from 'react-router-dom'
import 'moment'
import MomentUtils from '@date-io/moment'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'

import MaterialTable, { MTableToolbar } from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Box, Typography } from "@material-ui/core";
import { Save, Cancel } from '@material-ui/icons';
import { useSnackbar } from "notistack";
import { IconButton } from "material-ui";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { MuiThemeProvider } from "material-ui/styles";
import { Link as RouterLink } from 'react-router-dom';

function SalesRoutesPlanningPeriod(props){
    const {enqueueSnackbar} = useSnackbar()
    const history = useHistory()
    
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const [plans, setPlans] = useState([{
        retailOutletCode: "C0001",
        retailOutletName: "VM1",
        salesman: "SM1",
        distributorName: "NPP1",
        visitFrequency: "1 tuần thăm 2 lần",
        visitConfig: 2,
        repeatWeek: 1
    }]);
    
    const [creationDialogOpen, setCreationDialogOpen] = useState(false)
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const {register, handleSubmit} = useForm()
    
    const anchorOrigin= {
        vertical: 'bottom',
        horizontal: 'right',
    }

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
            field:"salesman", 
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

    // const getListSalesRoutePlanningPeriod = () => {
    //     authPost(dispatch, token, "/get-list-sales-route-planning-period", {"statusId": null})
    //         .then(res => res.json())    
    //             .then(res => {                   
    //                 for(let i=0; i<res.length; i++) {
    //                     res[i] = {
    //                         ...res[i], 
    //                         "fromDate": new Date(res[i].fromDate), 
    //                         "toDate": new Date(res[i].toDate)}
    //                 }
                    
    //                 setPlans(res);        
    //                 },
    //                 error => {
    //                     setPlans([{}])
    //             }
    //       );
    // }

    // const onDialogClose = () => {
    //     setCreationDialogOpen(false);
    //     setFromDate(new Date())
    //     setToDate(new Date())
    // };
    
    // const onClickSaveButton = data => {
        
    //     setCreationDialogOpen(false)
        
    //     enqueueSnackbar("Đang xử lý...", {
    //         variant: "info",
    //         anchorOrigin: anchorOrigin,
    //         autoHideDuration: 2000
    //     })
        
    //     authPost(
    //         dispatch,
    //         token,
    //         "/create-sales-route-planning-period",
    //         {
    //             fromDate,
    //             toDate,
    //             "description": data["Description"]
    //         })
    //         .then(res => res.json())    
    //             .then(res => {
    //                 let variant;
    //                 let message;
                    
    //                 if (res["status"]===undefined) {
    //                     message = "Đã thêm"
    //                     variant = "success"
    //                 } else {
    //                     message = "Đã xảy ra lỗi :(("
    //                     variant = "error"
    //                 }
                    
    //                 enqueueSnackbar(message, {
    //                     variant: variant,
    //                     anchorOrigin: anchorOrigin,
    //                     autoHideDuration: 2000
    //                 })

    //                 getListSalesRoutePlanningPeriod()
    //             })
        
    // }

    // useEffect(() => {
    //     getListSalesRoutePlanningPeriod();
    // }, []);

    return(
        <div>
           <MaterialTable
                title="Thiết lập cấu hình viếng thăm cho đại lý bán lẻ"
                columns={columns}
                data={plans}
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
                      onClick: rowData => history.push("/salesroutes/planning") 
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
                            <Typography variant='subtitle1'>
                                Giai đoạn làm tuyến:
                            </Typography>
                            <br/>
                            <Button
                                variant='contained'
                                color='primary'
                            >
                                Chi tiết tuyến
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                            >
                                Sinh chi tiết tuyến
                            </Button>
                            <Button
                                variant='contained'
                                color='primary'
                            >
                                Thêm mới
                            </Button>                            
                        </div>
                    )
                }}
            />
            
            {/* <Dialog open={creationDialogOpen} onClose={onDialogClose}>
                <DialogTitle>Thêm mới kế hoạch tuyến bán hàng</DialogTitle>
                <form onSubmit={handleSubmit(onClickSaveButton)}>
                    <DialogContent>
                        <MuiPickersUtilsProvider utils={MomentUtils} >
                            <KeyboardDatePicker
                                margin="normal"
                                id="fromdate"
                                label="Ngày bắt đầu"
                                format="YYYY-MM-DD"
                                value={fromDate}
                                onChange={date => setFromDate(date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                            <br/>
                            <KeyboardDatePicker
                                margin="normal"
                                id="todate"
                                label="Ngày kết thúc"
                                format="YYYY-MM-DD"
                                value={toDate}
                                onChange={date => setToDate(date)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </MuiPickersUtilsProvider>
                        <TextField
                            required
                            multiline
                            margin="normal"
                            label="Mô tả"
                            name="Description"
                            inputRef={register({required: true})}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            variant="contained"
                            size="medium"
                            color="primary"
                            startIcon={<Cancel/>}
                            onClick={onDialogClose}
                            style={{background: 'grey', color: 'white'}}
                        >
                            HỦY
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            startIcon={<Save/>}  
                            type='submit' 
                        >
                            LƯU
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>  */}
        </div>
    );
}

export default SalesRoutesPlanningPeriod;