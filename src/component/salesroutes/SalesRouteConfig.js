import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from 'react-hook-form'
import { authPost } from "../../api";

import MaterialTable, { MTableToolbar } from "material-table";
import {tableIcons} from "../../utils/iconutil";
import { useSnackbar } from "notistack";
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

function SalesRouteConfig(){
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    
    // Modal
    const [creationDialogOpen, setCreationDialogOpen] = useState(false)
    const {register, handleSubmit} = useForm()
    
    // Snackbar
    const {enqueueSnackbar} = useSnackbar()
    const anchorOrigin= {
        vertical: 'bottom',
        horizontal: 'right',
    }

    // Table
    const [data, setData] = useState([{}]);
    const columns = [
        {
            field:"salesRouteConfigId", 
            title: "Mã cấu hình",
        },
        {
            field:"days", 
            title: "Ngày",
        },
        {
            field:"repeatWeek", 
            title: "Lặp tuần"
        }
    ]

    // Functions
    const getListSalesRouteConfig = () => {
        authPost(dispatch, token, "/get-list-sales-route-config", {"statusId": null})
            .then(res => res.json())    
                .then(res => {
                        for(let i=0; i<res.length;i++) {
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
    };
    
    const onClickSaveButton = data => {
        
        setCreationDialogOpen(false)
        
        enqueueSnackbar("Đang xử lý...", {
            variant: "info",
            anchorOrigin: anchorOrigin,
            autoHideDuration: 2000
        })

        authPost(
            dispatch,
            token,
            "/create-sales-route-config",
            {
                "days": data["Days"],
                "repeatWeek": data["RepeatWeek"]
            })
            .then(res => res.json())    
                .then(res => {
                    let variant;
                    let message;
                    
                    if (res["status"]===undefined) {
                        message = "Đã thêm"
                        variant = "success"
                    } else {
                        message = "Đã xảy ra lỗi :(("
                        variant = "error"
                    }
                    
                    enqueueSnackbar(message, {
                        variant: variant,
                        anchorOrigin: anchorOrigin,
                        autoHideDuration: 2000
                    })

                    getListSalesRouteConfig()
                })
    }

    useEffect(() => {
        getListSalesRouteConfig()
    }, [])

    return(
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
                                                <IconButton
                                                    children={  <IconContext.Provider>
                                                                    <RiMenuAddLine style={{fontSize: 24}}/>
                                                                </IconContext.Provider>}
                                                    size='medium'
                                                    tooltip='Thêm mới'
                                                    onClick={() => setCreationDialogOpen(true)}
                                                />
                                            </Box>                                                                
                                    </div>
                                )
                            }}
                        />
                        <Dialog open={creationDialogOpen} onClose={onDialogClose}>
                            <DialogTitle>Thêm mới cấu hình viếng thăm</DialogTitle>
                            <form onSubmit={handleSubmit(onClickSaveButton)}>
                                <DialogContent>
                                    <TextField
                                        required
                                        multiline
                                        margin="normal"
                                        label="Ngày"
                                        name="Days"
                                        inputRef={register({required: true})}
                                        fullWidth
                                    />
                                    <TextField
                                        required
                                        multiline
                                        margin="normal"
                                        label="Lặp tuần"
                                        name="RepeatWeek"
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

export default SalesRouteConfig;