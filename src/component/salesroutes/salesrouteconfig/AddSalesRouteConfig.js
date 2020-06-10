import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useForm, Controller} from 'react-hook-form'
import {authPost, authGet} from "../../../api";

import { MuiThemeProvider } from "material-ui/styles";
import { MenuItem } from "material-ui";
import { 
    Card, 
    CardContent, 
    Button, 
    TextField, 
    Typography } 
from "@material-ui/core";
import { Save, Cancel } from '@material-ui/icons';
import SelectWeekdays from "./SelectWeekdays";
import { processingNoti, updateSuccessNoti, updateErrorNoti } from "../Notification";
import {object, array, string, mixed} from 'yup'
import { DevTool } from "react-hook-form-devtools";
import { useHistory } from "react-router";

function AddSalesRouteConfig(){
    const history = useHistory()
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();

    // Form
    const [frequencies, setFrequencies] = useState([])
    const schema = object({
        frequency: string().required("Trường này được yêu cầu"),
        days: array().min(1, "Trường này được yêu cầu"),
        repeatWeek: string().required("Trường này được yêu cầu")
    });
    
    const {register, handleSubmit, control, errors, setError, getValues} = useForm({
        defaultValues: {
            days: []
        },
        validationSchema: schema
    })
    
    // Snackbar
    const toastId = React.useRef(null);

    // Functions
    const getVisitFrequencies = () => {
        authGet(
            dispatch, 
            token, 
            "/get-list-sales-route-visit-frequency",
        )           
            .then(res => {
                setFrequencies(res)
            })
    }

    const onChangeFrequency = () => {
        // setPayLoad(() => ({...payLoad, 'visitFrequencyId': child.key}))
    }

    const onClickCancelButton = () => {
        history.goBack()
    };
    
    const onClickSaveButton = data => {
        let char = data['frequency'].slice(2, 3)
        char = (char === 'W')?1:Number(char)
        
        if (data.days.length !== char) {
            setError('days', 'length', `Vui lòng chọn đúng ${char} mục`)
        } else {
            processingNoti(toastId, false)

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
                    "visitFrequencyId": data["frequency"],
                    "days": days,
                    "repeatWeek": data["repeatWeek"]
                }
            )
                .then(res => res.json())    
                    .then(res => {
                        if (res["status"]===undefined) {
                            updateSuccessNoti(toastId, "Đã thêm")
                            history.goBack()
                        } else {
                            updateErrorNoti(toastId, "Rất tiếc! Đã xảy ra lỗi :((")
                        }                
                    })
        }           
    }

    useEffect(() => {
        getVisitFrequencies()
    }, [])

    return (
        <div>
           <MuiThemeProvider>
                <Card>
                    <CardContent>
                        {/* Title */}
                        <Typography 
                            variant='h6' 
                            style={{marginLeft: 10}}
                        >
                            Thêm mới cấu hình viếng thăm
                        </Typography>
                        <br/>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit(onClickSaveButton)}>
                            <Controller
                                as={<TextField
                                        select
                                        error={!!errors.frequency}
                                        id="frequency"
                                        label="Tần suất thăm*"
                                        value={getValues('frequency')}
                                        helperText={errors.frequency?.message}
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {frequencies.map(f =>   <MenuItem 
                                                                    key={f.visitFrequencyId}
                                                                    value={f.visitFrequencyId}
                                                                >
                                                                    {f.description}
                                                                </MenuItem>)}
                                    </TextField>}
                                name="frequency"
                                control={control}
                                onChange={e => {
                                    onChangeFrequency(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/>
                            <br/>
                            <SelectWeekdays 
                                errors={errors} 
                                control={control} 
                                style={{minWidth: '200px', marginLeft: '30px'}}
                            />
                            <br/>
                            <TextField
                                error={!!errors.repeatWeek}
                                multiline
                                margin="normal"
                                label="Lặp tuần*"
                                name="repeatWeek"
                                helperText={errors.repeatWeek?.message}
                                inputRef={register}
                                style={{minWidth: '200px', marginLeft: '30px'}}
                            />
                            <br/>
                            <br/>
                            <Button 
                                variant="contained"
                                size="medium"
                                color="primary"
                                startIcon={<Cancel/>}
                                onClick={onClickCancelButton}
                                style={{
                                    background: 'grey', 
                                    color: 'white', 
                                    margin:'0px 10px 0px 30px'
                                }}
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
                        </form>                        
                        <DevTool control={control} />
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    );
}

export default AddSalesRouteConfig;
