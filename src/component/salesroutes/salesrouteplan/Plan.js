import React, { useEffect, useState, forwardRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form'
import { authPost } from "../../../api";
import {Link} from 'react-router-dom'
import moment from 'moment'
import MomentUtils from '@date-io/moment'
import { Save, Cancel } from '@material-ui/icons';
import { IconButton, Card } from "material-ui";
import { MuiThemeProvider } from "material-ui/styles";
import { RiMenuAddLine } from 'react-icons/ri'
import { IconContext } from "react-icons/lib/cjs";
import MaterialTable, { MTableToolbar } from "material-table";
import { toast } from 'react-toastify';
import {tableIcons} from "../../../utils/iconutil";
import { GiInfo } from 'react-icons/gi'
import { FiCheckCircle } from 'react-icons/fi'
import { MdCancel } from 'react-icons/md'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import { 
    Button,
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    Box, 
    CardContent,
    Slide } 
from "@material-ui/core";
import { processingNoti, updateSuccessNoti, updateErrorNoti } from "../Notification";

// const Transition = forwardRef((props, ref) => <Slide direction="down" ref={ref} {...props}/>);

function Plan(){
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    
    // Modal
    const [creationDialogOpen, setCreationDialogOpen] = useState(false)
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const {register, handleSubmit} = useForm()
    
    // Snackbar
    const toastId = React.useRef(null);
    
    // Table
    const [plans, setPlans] = useState([{}]);
    const columns = [
        {
            field:"salesRoutePlanningPeriodId", 
            title: "Mã giai đoạn",
            render: rowData => 
            <Link 
                to={{
                    pathname: '/salesroutes/plan/period',
                    state: {'salesRoutePlanningPeriodId': rowData['salesRoutePlanningPeriodId'],
                            'fromDate': rowData['fromDate'],
                            'toDate': rowData['toDate']
                    }
                }}
            >
                {rowData['salesRoutePlanningPeriodId']}
            </Link>
        },
        {
            field:"description", 
            title: "Mô tả",
        },
        {
            field:"fromDate", 
            title: "Ngày bắt đầu",
        },
        {
            field:"toDate", 
            title: "Ngày kết thúc",
        }
    ]

    const getListSalesRoutePlanningPeriod = () => {
        authPost(dispatch, token, "/get-list-sales-route-planning-period", {"statusId": null})
            .then(res => res.json())    
                .then(res => {                   
                    for(let i=0; i<res.length; i++) {
                        res[i] = {
                            ...res[i], 
                            "fromDate": moment(res[i].fromDate).format('YYYY-MM-DD'),
                            "toDate": moment(res[i].toDate).format('YYYY-MM-DD') 
                        }   
                    }
                    
                    setPlans(res); 
                }
          );
    }

    const onDialogClose = () => {
        setCreationDialogOpen(false);
        setFromDate(new Date())
        setToDate(new Date())
    };
    
    const onClickSaveButton = data => {
        
        setCreationDialogOpen(false)
        processingNoti(toastId, false)

        authPost(
            dispatch,
            token,
            "/create-sales-route-planning-period",
            {
                fromDate,
                toDate,
                "description": data["Description"]
            })
            .then(res => res.json())    
                .then(res => {
                    if (res["status"]===undefined) {
                        updateSuccessNoti(toastId, "Đã thêm")
                    } else {
                        updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((")
                    }
                    
                    getListSalesRoutePlanningPeriod()
                })
    }

    useEffect(() => {
        getListSalesRoutePlanningPeriod();
    }, []);

    return(
        <div>
           <MuiThemeProvider>
                <Card>
                    <CardContent>
                        <MaterialTable
                            title="Kế hoạch tuyến bán hàng"
                            columns={columns}
                            data={plans}
                            icons={tableIcons}
                            options={{
                                search: false,
                                actionsColumnIndex: -1
                            }}
                            components={{
                                Toolbar: props => (
                                    <div>
                                        <MTableToolbar {...props} />
                                        <MuiThemeProvider>
                                            <Box
                                                display='flex'
                                                justifyContent='flex-end'
                                                width='98%'
                                            >
                                                <Button
                                                    variant='contained'
                                                    color='primary'
                                                    onClick={() => setCreationDialogOpen(true)}
                                                >
                                                    Thêm mới
                                                </Button>
                                                {/* <IconButton
                                                    children={  <IconContext.Provider>
                                                                    <RiMenuAddLine style={{fontSize: 24}}/>
                                                                </IconContext.Provider>}
                                                    size='medium'
                                                    tooltip='Thêm mới'
                                                    onClick={() => setCreationDialogOpen(true)}
                                                /> */}
                                            </Box>  
                                        </MuiThemeProvider>                                    
                                    </div>
                                ),
                            }}
                        />
                        <Dialog 
                            open={creationDialogOpen} 
                            onClose={onDialogClose} 
                            // TransitionComponent={Transition}
                        >
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
                        </Dialog> 
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    );
}

export default Plan;
