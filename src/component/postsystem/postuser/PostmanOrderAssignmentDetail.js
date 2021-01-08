import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleApiWrapper, Map, Marker, Polyline } from 'google-maps-react';
import Grid from "@material-ui/core/Grid";
import { authPost, authGet, authDelete } from "../../../api";
import AlertDialog from "../../../utils/AlertDialog";
import { errorNoti, infoNoti } from "../../../utils/Notification";
import MaterialTable from "material-table";
import {
    localization, tableIcons
} from '../../../utils/MaterialTableUtils';
import { makeStyles } from "@material-ui/core/styles";
import ConfirmDialog from "../ConfirmDialog"

function errHandling(err) {
    if (err.message == "Unauthorized")
        errorNoti("Phiên làm việc đã kết thúc, vui lòng đăng nhập lại !", true);
    else
        errorNoti("Rất tiếc! Đã có lỗi xảy ra.", true);
    console.trace(err);
}

const columns = [
    { title: "Mã đơn hàng", field: "postDriverPostOfficeAssignmentId", editable: false, hidden: true },
    { title: "Người gửi", field: "postOfficeFixedTripId", editable: false, hidden: true },
    { title: "Người nhận", field: "postFixedTrip.postOfficeTrip.fromPostOffice.postOfficeName" },
]
function extendBoundRecursive(bounds, map, elements) {
    elements.forEach((child) => {
        if (child && child.type === Marker) {
            bounds.extend(new window.google.maps.LatLng(child.props.position.lat, child.props.position.lng));
            return;
        } else if (Array.isArray(child)) {
            extendBoundRecursive(bounds, map, child);
        }
    })
}

const useStyles = makeStyles({
    root: {
        width: "100%",
    },
    container: {
        maxHeight: 400,
    },
});

const style = {
    width: '100%',
    height: '100%'
}

function PostmanOrderAssignmentDetail(props) {
    const classes = useStyles();
    const { postDriverId } = useParams();
    const [postDriver, setPostDriver] = useState();
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [isRequesting, setIsRequesting] = useState(false);
    const [data, setData] = useState([]);
    const [map, setMap] = useState();
    const [tableRef, setTableRef] = useState();
    const [open, setOpen] = useState(false);
    const [postmanId, setPostmanId] = useState();
    const [comfirmAction, setConfirmAction] = useState({
        open: false,
        handleSuccess: undefined,
        content: undefined,
        title: undefined
    });

    const arrow = {
        path: props.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, // 0,0 is the tip of the arrow
        fillColor: '#f00',
        fillOpacity: 1.0,
        strokeColor: '#f00',
        strokeWeight: 1,
    };

    const loadData = async () => {
        await Promise.all([
            authGet(dispatch, token, "/get-postman-list-order-bydate/" + postmanId, {})
                .then((response) => {
                    setData(response);
                })
        ]).catch(err => errHandling(err))
    }

    const [alertAction, setAlertAction] = useState({
        open: false,
        handleSuccess: undefined,
        title: undefined,
        message: undefined
    })

    useEffect(() => {
        authGet(dispatch, token, "/my-account", {}).then(response => {
            console.log(response.partyId)
            setPostmanId(response.partyId)
            loadData()
        })


    }, [])

    useEffect(() => {
        if (map === undefined) return;
        const bounds = new window.google.maps.LatLngBounds();
        extendBoundRecursive(bounds, map, map.props.children);
        if (map.props.children.length > 0) map.map.fitBounds(bounds);
    })

    return (
        <div>
            <Grid container spacing={5}>
                <Grid item xs={5}>
                    <MaterialTable
                        className={classes.table}
                        title="Danh sách đơn hàng"
                        columns={columns}
                        options={{
                            filtering: true,
                            Materisearch: true,
                            actionsColumnIndex: -1,
                            selection: false,
                        }}
                        localization={localization}
                        icons={tableIcons}
                        data={data}
                        tableRef={(ref) => setTableRef(ref)}
                    />
                </Grid>
                <Grid item xs={7}>
                    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                        <Map
                            google={props.google}
                            zoom={14}
                            style={style}
                            ref={(ref) => { setMap(ref) }}
                            center={{
                                lat: 21.027763,
                                lng: 105.834160,
                            }}
                        >
                            {data.map(assigment => {
                                let postOffice = assigment.postFixedTrip.postOfficeTrip.fromPostOffice
                                return <Marker
                                    title={postOffice.postOfficeName}
                                    position={{
                                        lat: postOffice.postalAddress.geoPoint.latitude,
                                        lng: postOffice.postalAddress.geoPoint.longitude
                                    }}
                                />
                            })}
                            {data.map(assigment => {
                                let postOffice = assigment.postFixedTrip.postOfficeTrip.toPostOffice
                                return <Marker
                                    title={postOffice.postOfficeName}
                                    position={{
                                        lat: postOffice.postalAddress.geoPoint.latitude,
                                        lng: postOffice.postalAddress.geoPoint.longitude
                                    }}
                                />
                            })}
                            {data.map(assigment => {
                                let trip = assigment.postFixedTrip.postOfficeTrip
                                return <Polyline
                                    path={
                                        [
                                            { lat: trip.fromPostOffice.postalAddress.geoPoint.latitude, lng: trip.fromPostOffice.postalAddress.geoPoint.longitude },
                                            { lat: trip.toPostOffice.postalAddress.geoPoint.latitude, lng: trip.toPostOffice.postalAddress.geoPoint.longitude }
                                        ]
                                    }
                                    options={{
                                        strokeColor: '#f00',
                                        strokeOpacity: 1,
                                        strokeWeight: 2
                                    }}
                                    icons={
                                        [{
                                            icon: arrow,
                                            offset: '100%',
                                        }]
                                    }
                                />
                            })}
                        </Map>
                    </div>
                </Grid>
            </Grid>
            <AlertDialog
                open={alertAction.open}
                setOpen={() => setAlertAction({
                    open: false,
                })}
                title={alertAction.title}
                message={alertAction.message}
            />
            <ConfirmDialog
                confirmAction={comfirmAction}
                setConfirmAction={setConfirmAction}
            />
        </div>
    );

}


export default GoogleApiWrapper({
    apiKey: (process.env.REACT_APP_GOOGLE_MAP_API_KEY)
})(PostmanOrderAssignmentDetail);
