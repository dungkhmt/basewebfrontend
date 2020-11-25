import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { authPost, authGet } from "../../../api";
import { makeStyles } from '@material-ui/core/styles';
import {
    CircularProgress, FormControlLabel, List, ListItem, ListItemText, Button,
    IconButton, Dialog, DialogTitle, TableHead, Table, DialogContent, TableBody,
    TableCell, TableRow, TableContainer
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { GoogleApiWrapper, Map, Marker, Polyline } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
const colorList = [
    '#00ffff', '#39AECA', '#8429B1', '#CCAFF0', '#A6EA38', '#1B4C44', '#980414', '#D8661D', '#298D2B', '#826230', '#46101C', '#C53A6D', '#C5C318', '#111A49', '#1B7E57'
]
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));
const columns = [
    { label: "Mã đơn hàng", id: "postShipOrderId", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Người gửi", id: "fromCustomer.postCustomerName", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Người nhận", id: "toCustomer.postCustomerName", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Số điện thoại người gửi", id: "fromCustomer.phoneNum", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Số điện thoại người nhận", id: "toCustomer.phoneNum", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Địa chỉ Người gửi", id: "toCustomer.postalAddress.address", minWidth: 200, type: 'normal', 'align': 'left' },
    { label: "Địa chỉ người nhận", id: "fromCustomer.postalAddress.address", minWidth: 200, type: 'normal', 'align': 'left' },
]

function PickAndDeliveryDetail(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const classes = useStyles();
    const [address, setAddress] = useState();
    const handleAddressChange = event => {
        setAddress(event.target.value)
    }
    const [postOffice, setPostOffice] = useState();
    const [fromPostOrder, setFromPostOrder] = useState([]);
    const [toPostOrder, setToPostOrder] = useState([]);
    const [pickVisible, setPickVisible] = useState(false);
    const [pickMarkerVisible, setPickMarkerVisible] = useState(false);
    const [deliveryVisible, setDeliveryVisible] = useState(false);
    const [map, setMap] = useState();
    const [postmen, setPostmen] = useState([]);
    const [activePostman, setActivePostman] = useState();
    const handlePickVisibleChange = (event) => {
        setPickVisible(event.target.checked);
    }
    const handleDeliveryVisibleChange = (event) => {
        setDeliveryVisible(event.target.checked);
    }
    const { postOfficeId } = props.location.state;
    const [isSolved, setSolved] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [isSolving, setSolving] = useState(false);
    const [distances, setDistances] = useState([]);
    const [open, setOpen] = useState(false);
    const handleViewRouteChange = (i, value) => {
        let newPostmen = postmen.slice();
        newPostmen[i].viewRoute = value;
        console.log(newPostmen)
        setPostmen(newPostmen);
    }
    const handleCancelDialog = () => {
        setOpen(false);
    };

    const handleOpenDialog = (postman) => {
        setActivePostman(postman);
        setOpen(true);
    };
    const submitSolver = () => {
        setSolving(true);
        authPost(dispatch, token, "/post-office-vrp-solve", {
            "postOfficeId": postOfficeId,
            "type": "pick"
        })
            .then(res => res.json())
            .then(res => {
                if (res.solutionFound) {
                    setSolving(false);
                    setRoutes(res.geoPoints);
                    setPickMarkerVisible(true);
                    setDistances(res.distance);
                    let newPostmen = postmen;
                    newPostmen.forEach((postman, i) => {
                        postman.viewRoute = true;
                        postman.orderList = res.routes[i];
                        postman.distance = res.distance[i];
                        postman.geoPoints = [];
                        postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                        res.routes[i].forEach(postOrder => {
                            postman.geoPoints.push(postOrder.fromCustomer.postalAddress.geoPoint);
                        })
                        postman.geoPoints.push(postOffice.postalAddress.geoPoint);
                    })
                    setPostmen(newPostmen);
                    setSolved(res.solutionFound);
                }
            })
    }
    useEffect(() => {
        authGet(dispatch, token, "/get_office_order_detail/" + postOfficeId)
            .then(
                res => {
                    setPostOffice(res.postOffice)
                    setFromPostOrder(res.fromPostOrders);
                    setToPostOrder(res.toPostOrders);
                },
                error => {
                    console.log(error);
                }
            )
        authGet(dispatch, token, "/get-postman-list/" + postOfficeId)
            .then(
                res => {
                    res.forEach(postman => {
                        postman.viewRoute = false;
                        postman.color = colorList[Math.floor(Math.random() * (colorList.length + 1))];
                    })
                    setPostmen(res);
                }
            )
    }, [])

    useEffect(() => {
        const bounds = new window.google.maps.LatLngBounds();
        if (map === undefined) return;
        map.props.children.forEach((child) => {
            if (child && child.type === Marker && child.props.visible) {
                bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            } else if (Array.isArray(child)) {
                child.forEach((child) => {
                    if (child && child.type === Marker && child.props.visible) {
                        bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
                    }
                })
            }
        })
        map.map.fitBounds(bounds)
    })
    const style = {
        width: '100%',
        height: '100%'
    }
    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={5}>
                    <Typography variant="h5" component="h2">
                        Phân chia bưu tá
                    </Typography>
                    <br />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pickVisible}
                                onChange={handlePickVisibleChange}
                                color="primary"
                                name="checkedB"
                            />
                        }
                        label="Thu gom"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={deliveryVisible}
                                onChange={handleDeliveryVisibleChange}
                                color="primary"
                                name="checkedB"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                        label="Giao hàng"
                    />
                    <Typography variant="h5" component="h2">
                        Danh sách bưu tá
                    </Typography>
                    <br />
                    <List component="nav" className={classes.root} aria-label="contacts">
                        {
                            postmen.map((postman, i) => {
                                return postman.viewRoute
                                    ?
                                    (<ListItem>
                                        <ListItemText inset primary={postman.postmanName}>
                                        </ListItemText>
                                        <IconButton color="primary"
                                            onClick={e => { handleViewRouteChange(i, !postman.viewRoute) }}
                                            disabled={!isSolved}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="primary"
                                            onClick={() => handleOpenDialog(postman)}
                                            disabled={!isSolved}>
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </ListItem>)
                                    :
                                    (<ListItem>
                                        <ListItemText inset primary={postman.postmanName}>
                                        </ListItemText>
                                        <IconButton color="secondary"
                                            onClick={e => { handleViewRouteChange(i, !postman.viewRoute) }}
                                            disabled={!isSolved}>
                                            <VisibilityOffIcon />
                                        </IconButton>
                                        <IconButton color="primary"
                                            onClick={() => handleOpenDialog(postman)}
                                            disabled={!isSolved}>
                                            <MoreHorizIcon />
                                        </IconButton>
                                    </ListItem>)
                            })
                        }
                    </List>
                    <br />
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={submitSolver}
                    >
                        {isSolving ? <CircularProgress /> : "Giải"}
                    </Button>
                </Grid>

                <Grid item xs={7}>
                    <div classname="map" style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '10px', overflow: 'hidden' }}>
                        <Map
                            google={props.google}
                            zoom={14}
                            style={style}
                            initialCenter={{
                                lat: 21.0227788,
                                lng: 105.8194541
                            }}
                            ref={(ref) => { setMap(ref) }}
                            onClick={(mapProps, map, event) => { console.log(event.latLng.lat(), event.latLng.lng()) }}
                        >
                            {postOffice ?
                                <Marker
                                    title={'Bưu cục'}
                                    position={{
                                        lat: postOffice.postalAddress.geoPoint.latitude,
                                        lng: postOffice.postalAddress.geoPoint.longitude,
                                    }}
                                    icon={{
                                        url: process.env.PUBLIC_URL + '/post_office.png'
                                    }}
                                    visible={true}
                                />
                                : undefined
                            }
                            {fromPostOrder.map((order) => {
                                return (
                                    <Marker
                                        title={order.fromCustomer.postCustomerName}
                                        position={{
                                            lat: order.fromCustomer.postalAddress.geoPoint.latitude,
                                            lng: order.fromCustomer.postalAddress.geoPoint.longitude,
                                        }}
                                        visible={pickVisible || pickMarkerVisible}
                                    />
                                )
                            })}
                            {pickVisible ?
                                fromPostOrder.map((order) => {
                                    console.log([
                                        { lat: postOffice.postalAddress.geoPoint.latitude, lng: postOffice.postalAddress.geoPoint.longitude },
                                        { lat: order.fromCustomer.postalAddress.geoPoint.latitude, lng: order.fromCustomer.postalAddress.geoPoint.longitude }
                                    ])
                                    return (
                                        <Polyline
                                            path={
                                                [
                                                    { lat: postOffice.postalAddress.geoPoint.latitude, lng: postOffice.postalAddress.geoPoint.longitude },
                                                    { lat: order.fromCustomer.postalAddress.geoPoint.latitude, lng: order.fromCustomer.postalAddress.geoPoint.longitude }
                                                ]
                                            }
                                            options={{
                                                strokeColor: '#00ffff',
                                                strokeOpacity: 1,
                                                strokeWeight: 2
                                            }}
                                        />
                                    )
                                })
                                : undefined
                            }
                            {
                                toPostOrder.map((order) => {
                                    return (
                                        <Marker
                                            title={order.toCustomer.postCustomerName}
                                            position={{
                                                lat: order.toCustomer.postalAddress.geoPoint.latitude,
                                                lng: order.toCustomer.postalAddress.geoPoint.longitude,
                                            }}
                                            visible={deliveryVisible}
                                        />
                                    )
                                })
                            }
                            {deliveryVisible ?
                                toPostOrder.map((order) => {
                                    return (
                                        <Polyline
                                            path={
                                                [
                                                    { lat: postOffice.postalAddress.geoPoint.latitude, lng: postOffice.postalAddress.geoPoint.longitude },
                                                    { lat: order.toCustomer.postalAddress.geoPoint.latitude, lng: order.toCustomer.postalAddress.geoPoint.longitude }
                                                ]
                                            }
                                            options={{
                                                strokeColor: '#00ffff',
                                                strokeOpacity: 1,
                                                strokeWeight: 2
                                            }}
                                        />
                                    )
                                })
                                : undefined
                            }
                            {
                                isSolved ?
                                    postmen.map(postman => {
                                        let color = postman.color
                                        const arrow = {
                                            path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
                                            fillColor: color,
                                            fillOpacity: 1.0,
                                            strokeColor: color,
                                            strokeWeight: 1,
                                        };
                                        if (postman.viewRoute)
                                            return postman.geoPoints.map((geoPoint, i) => {
                                                return postman.geoPoints[i + 1]
                                                    ?
                                                    <Polyline
                                                        path={
                                                            [
                                                                { lat: geoPoint.latitude, lng: geoPoint.longitude },
                                                                { lat: postman.geoPoints[i + 1].latitude, lng: postman.geoPoints[i + 1].longitude }
                                                            ]
                                                        }
                                                        icons={
                                                            [{
                                                                icon: arrow,
                                                                offset: '100%',
                                                            }]
                                                        }
                                                        options={{
                                                            strokeColor: color,
                                                            strokeOpacity: 1,
                                                            strokeWeight: 2
                                                        }}
                                                        title={distances[i]}
                                                    />
                                                    :
                                                    undefined
                                            })
                                    })
                                    : undefined
                            }
                        </Map>
                    </div>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleCancelDialog} fullWidth maxWidth>
                <DialogTitle>{"Danh sách đơn hàng của " + (activePostman ? activePostman.postmanName : null)}</DialogTitle>
                <DialogContent>
                    <TableContainer className={classes.container}>
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
                                activePostman ?
                                    activePostman.orderList.map(order => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1}>
                                                {
                                                    columns.map((column) => {
                                                        let value;
                                                        column.id.split(".").reduce((prev, cur) => {
                                                            if (prev) {
                                                                return value = prev[cur];
                                                            }
                                                            else {
                                                                return value = order[cur];
                                                            }
                                                        }, undefined)
                                                        return (

                                                            <TableCell key={column.id} align={column.align}>
                                                                {value}
                                                            </TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        )
                                    })
                                    : undefined
                            }
                        </TableBody>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </div >
    );

}


export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(PickAndDeliveryDetail);
