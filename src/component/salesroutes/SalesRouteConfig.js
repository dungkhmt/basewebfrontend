import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from 'react-hook-form'
import {authPost} from "../../api";

import MaterialTable, {MTableToolbar} from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { MuiThemeProvider } from "material-ui/styles";
import { RiMenuAddLine } from 'react-icons/ri'
import { IconContext } from "react-icons/lib/cjs";
import { IconButton } from "material-ui";
import { 
    Card, 
    CardContent, 
    Box, Button, 
    TextField, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle } 
from "@material-ui/core";
import { Save, Cancel } from '@material-ui/icons';
import SelectWeekdays from "./SelectWeekdays";
import { processingNoti, updateSuccessNoti, updateErrorNoti } from "./Notification";
import {object, array, string} from 'yup'
import { DevTool } from "react-hook-form-devtools";

function SalesRouteConfig(){
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    
    // Modal
    const [creationDialogOpen, setCreationDialogOpen] = useState(false)
    
    // Form
    const schema = object().shape({
        days: array().min(1, "Vui lòng chọn ít nhất một mục"),
        repeatWeek: string().required("Vui lòng điền vào trường này")
    });
    
    const {register, handleSubmit, control, errors, reset} = useForm({
        defaultValues: {
            days: []
        },
        validationSchema: schema
    })
    
    // Snackbar
    const toastId = React.useRef(null);

    // Table
    const [data, setData] = useState([{}]);
    const columns = [
        {
            field: "salesRouteConfigId",
            title: "Mã cấu hình",
        },
        {
            field: "days",
            title: "Ngày",
        },
        {
            field: "repeatWeek",
            title: "Lặp tuần"
        }
    ]

    // Functions
    const getListSalesRouteConfig = () => {
        authPost(dispatch, token, "/get-list-sales-route-config", {"statusId": null})
            .then(res => res.json())
                .then(res => {
                    for (let i = 0; i < res.length; i++) {
                        res[i] = {
                            "salesRouteConfigId": res[i].salesRouteConfigId,
                            "days": res[i].days,
                            "repeatWeek": res[i].repeatWeek
                        }
                    }
                    
                    setData(res)
                })
    }

    const onDialogClose = () => {
        setCreationDialogOpen(false);
        reset({days: []})
    };
    
    const onClickSaveButton = data => {
        setCreationDialogOpen(false)
        processingNoti(toastId)

        data.days.sort((a, b) => a-b)
        let days = data.days[0].toString()

        for(let i=1; i<data.days.length; i++) {
            days += ", " + data.days[i]
        }

        authPost(
            dispatch,
            token,
            "/create-sales-route-config",
            {
                "days": days,
                "repeatWeek": data["repeatWeek"]
            }
        )
            .then(res => res.json())    
                .then(res => {
                    if (res["status"]===undefined) {
                        updateSuccessNoti(toastId, "Đã thêm")
                    } else {
                        updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((")
                    }

                    getListSalesRouteConfig()
                })
    }

    useEffect(() => {
      getListSalesRouteConfig()
    }, [])

    return (
        <div>
           <MuiThemeProvider>
                <Card>
                    <CardContent>
                        <MaterialTable
                            title="Cấu hình viếng thăm"
                            columns={columns}
                            data={data}
                            icons={tableIcons}
                            localization={{
                                header: {
                                    actions: ''
                                },
                                body: {
                                    emptyDataSourceMessage: 'Không có bản ghi nào để hiển thị',
                                }
                            }}
                            options={{
                                search: false,
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
                                    </div>
                                )
                            }}
                        />
                        <Dialog open={creationDialogOpen} onClose={onDialogClose} >
                            <DialogTitle>Thêm mới cấu hình viếng thăm</DialogTitle>
                            <form onSubmit={handleSubmit(onClickSaveButton)}>
                                <DialogContent style={{width: '330px'}}>
                                    {/* <TextField
                                        required
                                        multiline
                                        margin="normal"
                                        label="Ngày"
                                        name="Days"
                                        inputRef={register({required: true})}
                                        fullWidth
                                    /> */}
                                    <SelectWeekdays errors={errors} control={control} />
                                    <TextField
                                        error={!!errors.repeatWeek}
                                        multiline
                                        margin="normal"
                                        label="Lặp tuần"
                                        name="repeatWeek"
                                        helperText={errors.repeatWeek?.message}
                                        inputRef={register}
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
                        <DevTool control={control} />
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    );
}

export default SalesRouteConfig;
