import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import { failed } from "../../../action/Auth";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { authPost, authGet } from "../../../api";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Grid, Paper } from "@material-ui/core";
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DialogContent } from "@material-ui/core";
import { API_URL } from "../../../config/config";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Icon from "@material-ui/core/Icon";
const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200
        },
        backgroundColor: theme.palette.background.paper
    }
}));

function CreatePostShipOrder(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const history = useHistory();
    const [packageName, setPackageName] = useState();
    const [toCustomerId, setToCustomerId] = useState();
    const [toCustomerName, setToCustomerName] = useState();
    const [toCustomerAddress, setToCustomerAddress] = useState();
    const [toCustomerPhoneNum, setToCustomerPhoneNum] = useState();
    const [fromCustomerId, setFromCustomerId] = useState();
    const [fromCustomerName, setFromCustomerName] = useState();
    const [fromCustomerAddress, setFromCustomerAddress] = useState();
    const [fromCustomerPhoneNum, setFromCustomerPhoneNum] = useState();
    const [fromCustomerExist, setFromCustomerExist] = useState(false);
    const [toCustomerExist, setToCustomerExist] = useState(false);
    const [weight, setWeight] = useState();
    const [description, setDescription] = useState();
    const [postPackageTypeId, setPostPackageTypeId] = useState();
    const [packageTypeData, setPackageTypeData] = useState([])
    const [isRequesting, setIsRequesting] = useState(false);
    const classes = useStyles();
    const [map, setMap] = useState();
    const [fromCustomerLat, setFromCustomerLat] = useState(-1);
    const [fromCustomerLng, setFromCustomerLng] = useState(-1);
    const [toCustomerLat, setToCustomerLat] = useState(-1);
    const [toCustomerLng, setToCustomerLng] = useState(-1);
    const bounds = new window.google.maps.LatLngBounds();
    const [icon, setIcon] = useState();
    const [openAlert, setOpenAlert] = useState(false);
    const handleCancelAlertDialog = () => {
        history.push('/postoffice/orderlist');
    };

    const handleOpenAlertDialog = () => {
        setOpenAlert(true);
    };
    const loadPackageTypeData = () => {
        let res;
        authGet(dispatch, token, '/get-post-package-type')
            .then((res) => {
                setPackageTypeData(res)
                console.log(res)
            })
    }

    const handlePackageNameChange = event => {
        setPackageName(event.target.value);
    }
    const handleWeightChange = event => {
        setWeight(event.target.value);
    }
    const handleDescriptionChange = event => {
        setDescription(event.target.value);
    }
    const handlePostPackageTypeIdChange = event => {
        setPostPackageTypeId(event.target.value);
    }

    const handleFromCustomerNameChange = event => {
        setFromCustomerName(event.target.value);
    };
    const handleFromCustomerPhoneNumChange = event => {
        setFromCustomerPhoneNum(event.target.value);
    };
    const handleToCustomerNameChange = event => {
        setToCustomerName(event.target.value);
    };
    const handleToCustomerPhoneNumChange = event => {
        setToCustomerPhoneNum(event.target.value);
    };

    const handleDragToCustomer = (coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setToCustomerLat(lat);
        setToCustomerLng(lng);
    }

    const handleDragFromCustomer = (coord) => {
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setFromCustomerLat(lat);
        setFromCustomerLng(lng);
    }

    const handleChooseCallBack = (editting, data) => {
        if (editting === 'fromCustomer') {
            setFromCustomerId(data["post_customer_id"]);
            setFromCustomerName(data["post_customer_name"]);
            setFromCustomerAddress(data["address"]);
            setFromCustomerPhoneNum(data["phone_num"]);
            setFromCustomerLat(parseFloat(data["latitude"]));
            setFromCustomerLng(parseFloat(data["longitude"]));
            setFromCustomerExist(true);
        }
        else {
            setToCustomerId(data["post_customer_id"]);
            setToCustomerName(data["post_customer_name"]);
            setToCustomerAddress(data["address"]);
            setToCustomerPhoneNum(data["phone_num"]);
            setToCustomerLat(parseFloat(data["latitude"]));
            setToCustomerLng(parseFloat(data["longitude"]));
            setToCustomerExist(true);
        }
    }
    const handleSubmit = () => {
        const data = {
            packageName: packageName,
            toCustomerId: toCustomerId,
            weight: weight,
            description: description,
            postPackageTypeId: postPackageTypeId,
            fromCustomerExist: fromCustomerExist,
            fromCustomerId: fromCustomerId,
            fromCustomerName: fromCustomerName,
            fromCustomerAddress: fromCustomerAddress,
            fromCustomerPhoneNum: fromCustomerPhoneNum,
            fromCustomerLat: fromCustomerLat,
            fromCustomerLng: fromCustomerLng,
            toCustomerExist: toCustomerExist,
            toCustomerId: toCustomerId,
            toCustomerName: toCustomerName,
            toCustomerAddress: toCustomerAddress,
            toCustomerPhoneNum: toCustomerPhoneNum,
            toCustomerLat: toCustomerLat,
            toCustomerLng: toCustomerLng

        };
        setIsRequesting(true);

        authPost(dispatch, token, "/create-post-ship-order", data)
            .then(
                res => {
                    setIsRequesting(false);
                    if (res.status === 401) {
                        dispatch(failed());
                        throw Error("Unauthorized");
                    } else if (res.status === 409) {
                        alert("User exits!!");
                    } else if (res.status === 200) {
                        res.json().then((result => {
                            if (result.statusCode !== 'SUCCESS') {
                                alert(result.detail);
                                return result.statusCode;
                            }
                            else {
                                setOpenAlert(true);
                            }
                        }));
                    }
                },
                error => {
                    console.log(error);
                }
            )

    };
    useEffect(() => {
        setIcon({
            url: "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png", // url
            scaledSize: new props.google.maps.Size(40, 40), // scaled size
        });
    }, [])
    useEffect(() => {
        if (packageTypeData.length == 0)
            loadPackageTypeData();
        if (!map) return;
        let bounded = false;
        map.props.children.forEach((child) => {
            if (child && child.type === Marker) {
                bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
                bounded = true;
            }
        })
        if (bounded) map.map.fitBounds(bounds);
    })
    const [isToCustomerAddressChange, setIsToCustomerAddressChange] = useState(false);
    const [isFromCustomerAddressChange, setIsFromCustomerAddressChange] = useState(false);

    const handleSearchAddress = (user) => {
        if (isToCustomerAddressChange || isFromCustomerAddressChange) {
            let address
            if (user === 'fromCustomer') {
                address = fromCustomerAddress;
            }
            else {
                address = toCustomerAddress;
            }
            if (address && address.length > 0) {
                console.log('google searching ' + address)
                setIsToCustomerAddressChange(false);
                setIsFromCustomerAddressChange(false);
                // fetch(url, {
                //     method: "POST",
                //     signal: controller.signal,
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify(body)
                // })
                // .then(response => {response.json()})
                // .then(result => {

                // }) 
            }
        }

    }
    const handleFromCustomerAddressChange = event => {
        if (event.target.value != fromCustomerAddress) {
            setFromCustomerAddress(event.target.value);
            setIsToCustomerAddressChange(true);
        }
        if (event.keyCode == 13) {
            setIsFromCustomerAddressChange(true);
            handleSearchAddress('fromCustomer');
        }
    };
    const handleToCustomerAddressChange = event => {
        if (event.target.value != toCustomerAddress) {
            setToCustomerAddress(event.target.value);
            setIsFromCustomerAddressChange(true);
            if (event.keyCode == 13) {
                setIsToCustomerAddressChange(true);
                handleSearchAddress('toCustomer');
            }
        }
    };

    const style = {
        width: '100%',
        height: '100%'
    }


    return (
        <Grid container spacing={3} xs={12}>
            <Grid container item xs={7} direction="column" spacing={3}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h2">
                            Người gửi
                        </Typography>
                        <SearchButton callback={handleChooseCallBack} data="fromCustomer" />
                        <form noValidate autoComplete="off" className={classes.root}>
                            <TextField
                                id="fromCustomerName"
                                label="Họ tên người gửi"
                                value={fromCustomerName == undefined ? '' : fromCustomerName}
                                onChange={handleFromCustomerNameChange}
                                disabled={fromCustomerExist}
                            />
                            <TextField
                                id="fromCustomerPhoneNum"
                                label="Số điện thoại người gửi"
                                value={fromCustomerPhoneNum == undefined ? '' : fromCustomerPhoneNum}
                                onChange={handleFromCustomerPhoneNumChange}
                                disabled={fromCustomerExist}
                            />
                            <TextField
                                id="fromCustomerAddress"
                                label="Địa chỉ người gửi"
                                value={fromCustomerAddress == undefined ? '' : fromCustomerAddress}
                                onChange={handleFromCustomerAddressChange}
                                onKeyDown={(e) => { if (e.keyCode == 13) handleFromCustomerAddressChange(e) }}
                                onBlur={() => handleSearchAddress('fromCustomer')}
                            />
                            <TextField
                                id="description"
                                label="Mô tả"
                                value={null}
                                onChange={handleDescriptionChange}
                                disabled={fromCustomerExist}
                            />
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h2">
                            Người nhận
                         </Typography>
                        <SearchButton callback={handleChooseCallBack} data="toCustomer" />
                        <form noValidate autoComplete="off" className={classes.root}>
                            <TextField
                                id="toCustomerName"
                                label="Họ tên người nhận"
                                value={toCustomerName == undefined ? '' : toCustomerName}
                                onChange={handleToCustomerNameChange}
                                disabled={toCustomerExist}
                            />
                            <TextField
                                id="toCustomerPhoneNum"
                                label="Số điện thoại người nhận"
                                value={toCustomerPhoneNum == undefined ? '' : toCustomerPhoneNum}
                                onChange={handleToCustomerPhoneNumChange}
                                disabled={toCustomerExist}
                            />
                            <TextField
                                id="toCustomerAddress"
                                label="Địa chỉ người nhận"
                                value={toCustomerAddress == undefined ? '' : toCustomerAddress}
                                onChange={handleToCustomerAddressChange}
                                onKeyDown={(e) => { if (e.keyCode == 13) handleToCustomerAddressChange(e) }}
                                onBlur={() => handleSearchAddress('toCustomer')}
                            />
                            <TextField
                                id="description"
                                label="Mô tả"
                                value={null}
                                onChange={handleDescriptionChange}
                                disabled={toCustomerExist}
                            />
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography variant="h5" component="h2">
                            Thông tin hàng
                        </Typography>
                        <form noValidate autoComplete="off" className={classes.root}>

                            <TextField
                                id="packageName"
                                label="Tên hàng"
                                value={packageName}
                                onChange={handlePackageNameChange}
                            />
                            <TextField
                                id="weight"
                                label="Khối lượng"
                                value={weight}
                                onChange={handleWeightChange}
                            />
                            <TextField
                                id="description"
                                label="Mô tả"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                            <TextField
                                id="postPackageTypeId"
                                select
                                label="Loại hàng"
                                value={postPackageTypeId}
                                onChange={handlePostPackageTypeIdChange}
                                helperText="Chọn loại hàng"
                            >
                                {
                                    packageTypeData.map((data) => {
                                        return <MenuItem value={data.postPackageTypeId}>{data.postPackageTypeName}</MenuItem>
                                    })
                                }
                            </TextField>
                        </form>
                    </Paper>
                </Grid>
                <Button
                    onClick={handleSubmit}
                    color="primary"
                >Submit</Button>
            </Grid>
            <Grid item xs={5}>
                <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                    <Map
                        google={props.google}
                        zoom={1}
                        style={style}
                        zoom={5}
                        initialCenter={{ lat: 21.0003842, lng: 105.8331012 }}
                        ref={(ref) => { setMap(ref) }}
                    >
                        {toCustomerLat >= 0 && toCustomerLng >= 0
                            ? <Marker
                                title={"Địa chỉ nhận"}
                                position={{
                                    lat: toCustomerLat,
                                    lng: toCustomerLng,
                                }}
                                draggable={true}
                                onDragend={(t, map, coord) => handleDragToCustomer(coord)}
                                icon={icon}
                            />
                            : null}

                        {fromCustomerLat >= 0 && fromCustomerLng >= 0 ?
                            <Marker
                                title={"Địa chỉ gửi"}
                                position={{
                                    lat: fromCustomerLat,
                                    lng: fromCustomerLng,
                                }}
                                draggable={true}
                                onDragend={(t, map, coord) => handleDragFromCustomer(coord)}
                            />
                            : null}
                    </Map>
                </div>
            </Grid>
            <Dialog open={openAlert} onClose={(e) => e.preventDefault()}>
                <DialogTitle>Thông báo đặt hàng thành công</DialogTitle>
                <DialogContent>
                    <TableContainer className={classes.container}>
                        <form noValidate autoComplete="off" className={classes.root}>
                            <Typography variant="h6" fontWeight="fontWeightBold">Người gửi </Typography><Typography variant="subtitle1">{fromCustomerName}</Typography><br />
                            <Typography variant="h6" fontWeight="fontWeightBold">Người nhận </Typography><Typography variant="subtitle1">{toCustomerName}</Typography><br />
                            <Typography variant="h6" fontWeight="fontWeightBold">Số điên thoại người gửi </Typography><Typography variant="subtitle1">{fromCustomerPhoneNum}</Typography><br />
                            <Typography variant="h6" fontWeight="fontWeightBold">Số điện thoại người nhận </Typography><Typography variant="subtitle1">{toCustomerPhoneNum}</Typography><br />
                            <Typography variant="h6" fontWeight="fontWeightBold">Địa chỉ người gửi </Typography><Typography variant="subtitle1">{fromCustomerAddress}</Typography><br />
                            <Typography variant="h6" fontWeight="fontWeightBold">Địa chỉ người nhận </Typography><Typography variant="subtitle1">{toCustomerAddress}</Typography><br />
                        </form>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelAlertDialog} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );

}

function SearchButton(props) {
    const [open, setOpen] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState([]);
    const [customerName, setCustomerName] = useState();
    const [phoneNum, setPhoneNum] = useState();
    const [address, setAddress] = useState();
    const classes = useStyles();
    let searchPost_customer_name;
    let searchPhone_num;
    let searchAddress;
    const columns = [
        { label: "Họ tên", id: "post_customer_name", minWidth: 150, type: 'normal', 'align': 'left' },
        { label: "Số điện thoại", id: "phone_num", minWidth: 100, type: 'normal', 'align': 'left' },
        { label: "Địa chỉ", id: "address", minWidth: 200, type: 'normal', 'align': 'left' },
        { label: "Chọn", id: "choose_button", type: 'button', 'align': 'center' }
    ]

    const handleChooseClick = (value) => {
        props.callback(props.data, value);
        setOpen(false)
    }

    let controller = null

    const handleElasticsearch = () => {
        if (controller) controller.abort();
        controller = new AbortController();
        let url = 'http://localhost:9200/post_customer_search/_search'
        let body =
        {
            "size": 10,
            "query": {
                "bool": {
                    "must": [
                    ]
                }
            }
        }
        if (searchPost_customer_name) {
            body["query"]["bool"]["must"].push({ "match": { "post_customer_name": searchPost_customer_name } })
        }
        if (searchPhone_num) {
            body["query"]["bool"]["must"].push({ "match": { "phone_num": searchPhone_num } })
        }
        if (searchAddress) {
            body["query"]["bool"]["must"].push({ "match": { "address": searchAddress } })
        }
        if (body["query"]["bool"]["must"].length > 0) {
            fetch(url, {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    setData(response["hits"]["hits"].map(x => { return x["_source"] }));
                    console.log(data)
                }).catch(err => {
                    console.log(err)
                });
        }
    }
    const handleCustomerNameChange = event => {
        searchPost_customer_name = event.target.value;
        handleElasticsearch();
    };
    const handlePhoneNumChange = event => {
        searchPhone_num = event.target.value;
        handleElasticsearch();
    };
    const handleAddressChange = event => {
        searchAddress = event.target.value;
        handleElasticsearch();
    };
    const handleCancel = (event) => {
        setOpen(false);
    };
    const handleOpenDialog = (event) => {
        setOpen(true);
    };
    return (
        <div>
            <IconButton
                value=""
                align="right"
                onClick={handleOpenDialog}
            >
                <SearchIcon />
            </IconButton>
            <Dialog open={open} onClose={handleCancel}>
                <DialogTitle>{"Tìm kiếm user"}</DialogTitle>
                <DialogActions>
                    <form noValidate autoComplete="off">
                        <TextField
                            id="customerName"
                            label="Họ tên"
                            value={customerName}
                            onChange={handleCustomerNameChange}
                        />
                        <TextField
                            id="phoneNum"
                            label="Số điện thoại"
                            value={phoneNum}
                            onChange={handlePhoneNumChange}
                        />
                        <TextField
                            id="address"
                            label="Địa chỉ"
                            value={address}
                            onChange={handleAddressChange}
                        />
                    </form>

                </DialogActions>
                <DialogContent>

                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    data.map(row => {
                                        return (
                                            <TableRow>
                                                {columns.map((column) => {
                                                    if (column.type === 'button')
                                                        return <TableCell key={column.id} align={column.align}>
                                                            <IconButton
                                                                align='right'
                                                                onClick={() => handleChooseClick(row)}
                                                            >
                                                                <Icon color="primary">add_circle</Icon>
                                                            </IconButton>
                                                        </TableCell>
                                                    else
                                                        return <TableCell key={column.id} align={column.align}>
                                                            {
                                                                row[column.id]
                                                            }
                                                        </TableCell>
                                                })}
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(CreatePostShipOrder);

