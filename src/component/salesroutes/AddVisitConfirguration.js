import React, { useState, useEffect } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Card from 'material-ui/Card';
import MenuItem from 'material-ui/MenuItem';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { authPost, authGet } from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { Save, Cancel } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { DevTool } from 'react-hook-form-devtools';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Box } from '@material-ui/core';
import { IconContext } from 'react-icons/lib/cjs';
import { MdCancel } from 'react-icons/md';
import { CircularProgress } from 'material-ui';

function AddVisitConfirguration(props) {
    const history = useHistory()
    const dispatch = useDispatch()
    const token = useSelector((state) => state.auth.token);

    // Form
    const [salesmans, setSalesmans] = useState([])
    const [distributors, setDistributors] = useState([])
    const [retailOutlets, setRetailOutlets] = useState([])
    const [frequencies, setFrequencies] = useState([])
    const [configs, setConfigs] = useState([])
    const [respectiveConfigs, setRespectiveConfigs] = useState([])
    const {register, control, handleSubmit, errors, getValues, setValue, watch} = useForm({
        defaultValues: {
            'salesman': '',
            'distributor': '',
            'retailOutlet': '',
            'frequency': '',
            'config': '',
            'startWeek': ''
          }
    })
    const [payLoad, setPayLoad] = useState({ 'salesRouteConfigId': '' })

    // Util
    const [loadingDistributor, setLoadingDistributors] = useState(false)
    const [loadingRetailOutlet, setLoadingRetailOutlets] = useState(false)
    const LoadingIndicator = () => <CircularProgress size={30} style={{marginLeft: '85px'}}/>
    
    // Functions
    const getSalesmans = () => {
        authPost(
            dispatch, 
            token, 
            "/get-list-all-salesmans", 
            {"statusId": null}
        )
            .then(res => res.json())    
                .then(res => setSalesmans(res))
    }

    const getVisitFrequencies = () => {
        authGet(
            dispatch, 
            token, 
            "/get-list-sales-route-visit-frequency",
        )           
            .then(res => {
                console.log(res)
                setFrequencies(res)
            })
    }

    const getConfigs = () => {
        authPost(
            dispatch,
            token,
            "/get-list-sales-route-config",
            {statusId: null}
        )
            .then(res => res.json())    
                .then(res => {
                    console.log(res)
                    setConfigs(res)})
    }
    
    const onChangeSalesman = child => {
        setValue([{ distributor: ''}, { retailOutlet: ''}])
        setLoadingDistributors(true)
        setRetailOutlets([])
        
        authPost(
            dispatch,
            token, "/get-distributors-of-salesman", 
            {"partySalesmanId": child.key}
        )
            .then(res => res.json())    
                .then(res => {
                    console.log(res)
                    setLoadingDistributors(false)
                    setDistributors(res)
                    
                })
        
        setPayLoad(() => ({ ...payLoad, 'partySalesmanId': child.key }))
    }

    const onChangeDistributor = child => {
        setLoadingRetailOutlets(true)
        
        authPost(
            dispatch, 
            token, 
            "/get-list-retail-outlets-of-salesman-and-distributor", 
            {
                "partySalesmanId": payLoad.partySalesmanId, 
                "partyDistributorId": child.key
            }
        )
            .then(res => res.json())
                .then(res => {
                    setLoadingRetailOutlets(false)
                    setRetailOutlets(res)
                    console.log(res)
                })
        
        setPayLoad(() => ({...payLoad, 'partyDistributorId': child.key}))
    }

    const onChangeRetailOutlet = child => {
        setPayLoad(() => ({ ...payLoad, 'retailOutletSalesmanVendorId': child.key }))
    }

    const onChangeFrequency = child => {
        setPayLoad(() => ({...payLoad, 'visitFrequencyId': child.key}))
        setRespectiveConfigs(   [...configs.filter(c => c.salesRouteVisitFrequency.visitFrequencyId === child.key),
                                {
                                    "salesRouteConfigId": "None",
                                    "days": "None",
                                    "repeatWeek": 1,
                                    "statusId": null,
                                    "description": null
                                }]
        )
    }

    const onChangeConfig = child => {
        setValue('fromWeek', '')
        setPayLoad(() => ({...payLoad, 'salesRouteConfigId': child.key}))
    }

    const onClickCancelButton = () => {
        history.goBack()
    }

    const onSubmit = data => {
        console.log(data)
        // notify()
        
        authPost(
            dispatch,
            token,
            '/create-sales-route-config-retail-outlet',
            {
                'salesRouteConfigId': payLoad.salesRouteConfigId,
                'retailOutletSalesmanVendorId': payLoad.retailOutletSalesmanVendorId,
                'salesRoutePlanningPeriodId': props.location.state.salesRoutePlanningPeriodId,
                'visitFrequencyId': payLoad.visitFrequencyId,
                'startExecuteDate': ''
            }
        )
            .then(res => res.json())    
                .then(res => {
                    if (res["status"]===undefined) {
                        toast.dismiss()
                        history.goBack()
                    } else {
                        // errorNotification()
                        toast.error(<Box display='flex' alignItems='center'> 
                                        <IconContext.Provider>
                                            <MdCancel size={20} style={{marginRight: '5px'}}/>
                                        </IconContext.Provider>
                                        Rất tiếc! Đã xảy ra lỗi :((                                                             
                                    </Box>, 
                                    { 
                                        position: "bottom-right",
                                        autoClose: 2000,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                    }
    );
                    }
                })    
    }

    useEffect(() => {
        getSalesmans()
        getVisitFrequencies()
        getConfigs()
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
                            Thêm cấu hình viếng thăm
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
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                as={<TextField
                                        required
                                        select
                                        error={!!errors.salesman}
                                        id="salesman"
                                        label="Nhân viên bán hàng"
                                        value={getValues('salesman')} 
                                        helperText={errors.salesman?.message}                                      
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {/* {loadingDistributors?   <LoadingIndicator/>:*/}
                                        {           salesmans.map(s => <MenuItem 
                                                                            key={s.partyId}
                                                                            value={s.userLoginId}
                                                                        >
                                                                            {s.userLoginId}
                                                                        </MenuItem>)
                                        }
                                    </TextField>}
                                name="salesman"
                                rules={{ required: "Vui lòng chọn một mục" }}
                                control={control}
                                onChange={e => {
                                    onChangeSalesman(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/><br/>
                            <Controller
                                as={<TextField
                                        required
                                        select
                                        error={!!errors.distributor}
                                        id="distributor"
                                        label="Nhà phân phối"
                                        value={getValues('distributor')}
                                        helperText={errors.distributor?.message}
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {loadingDistributor?<LoadingIndicator/>:
                                                            distributors.map(d =>   <MenuItem 
                                                                                        key={d.partyId}
                                                                                        value={d.distributorName}
                                                                                    >
                                                                                        {d.distributorName}
                                                                                    </MenuItem>)
                                        }
                                    </TextField>}
                                name="distributor"
                                rules={{ required: "Vui lòng chọn một mục" }}
                                control={control}
                                onChange={e => {
                                    onChangeDistributor(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/><br/>
                            <Controller
                                as={<TextField
                                        required
                                        select
                                        error={!!errors.retailOutlet}
                                        id="retailOutlet"
                                        label="Đại lý bán lẻ"
                                        value={getValues('retailOutlet')}
                                        helperText={errors.retailOutlet?.message}
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {loadingRetailOutlet?<LoadingIndicator/>:
                                                            retailOutlets.map(ro => <MenuItem 
                                                                                        key={ro.retailOutletSalesmanVendorId}
                                                                                        value={ro.retailOutletName}
                                                                                    >
                                                                                        {ro.retailOutletName}
                                                                                    </MenuItem>)}
                                    </TextField>}
                                name="retailOutlet"
                                rules={{ required: "Vui lòng chọn một mục" }}
                                control={control}
                                onChange={e => {
                                    onChangeRetailOutlet(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/><br/>
                            <Controller
                                as={<TextField
                                        required
                                        select
                                        error={!!errors.frequency}
                                        id="frequency"
                                        label="Tần suất thăm"
                                        value={getValues('frequency')}
                                        helperText={errors.frequency?.message}
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {frequencies.map(f =>  <MenuItem 
                                                                    key={f.visitFrequencyId}
                                                                    value={f.description}
                                                                >
                                                                    {f.description}
                                                                </MenuItem>)}
                                    </TextField>}
                                name="frequency"
                                rules={{ required: "Vui lòng chọn một mục" }}
                                control={control}
                                onChange={e => {
                                    onChangeFrequency(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/><br/>
                            <Controller
                                as={<TextField
                                        select
                                        id="config"
                                        label="Cấu hình thăm"
                                        value={getValues('config')}
                                        style={{minWidth: '200px', marginLeft: '30px'}}
                                    >
                                        {respectiveConfigs.map(c => <MenuItem 
                                                                        key={c.salesRouteConfigId}
                                                                        value={c.days}
                                                                    >
                                                                        {c.days}
                                                                    </MenuItem>)}
                                    </TextField>}
                                name="config"
                                control={control}
                                onChange={e => {
                                    onChangeConfig(e[1])
                                    return e[1].props.value
                                }}
                            />
                            <br/><br/>
                            <TextField
                                disabled={watch('config')==='' || watch('config')==='None'}
                                id="fromWeek"
                                name='fromWeek'
                                label="Tuần bắt đầu"
                                helperText="Ví dụ: 1,2,3"
                                inputRef={register}
                                style={{minWidth: '200px', marginLeft: '30px'}}
                            />
                            <br/><br/>
                            <Button 
                                variant="contained"
                                size="medium"
                                color="primary"
                                startIcon={<Cancel/>}
                                onClick={onClickCancelButton}
                                style={{background: 'grey', color: 'white', marginRight: '10px'}}
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
                        <DevTool control={control}/>
                    </CardContent>
                </Card>
           </MuiThemeProvider>
        </div>
    )
}

export default AddVisitConfirguration
