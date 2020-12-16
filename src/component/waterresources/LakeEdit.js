import { CircularProgress, Grid, Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { failed } from "../../action";
import { authPost, authPostMultiPart } from "../../api";
import StyledDropzone from "../common/StyleDropDzone";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4),
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    paper: {
        padding: theme.spacing(2),
    },
}));
function LakeEdit(props) {
    let { lake } = props.location.state;
    const token = useSelector((state) => state.auth.token);
    const dispatch = useDispatch();
    const history = useHistory();
    const [lakeId, setLakeId] = useState();
    const [lakeName, setLakeName] = useState();
    const [latlng, setLatlng] = useState();
    const [capCongTrinh, setCapCongTrinh] = useState();
    const [dienTichLuuVuc, setDienTichLuuVuc] = useState();
    const [mucDamBaoTuoi, setMucDamBaoTuoi] = useState();
    const [dienTichTuoi, setDienTichTuoi] = useState();
    const [mucNuocChet, setMucNuocChet] = useState();
    const [mucNuocDangBinhThuong, setMucNuocDangBinhThuong] = useState();
    const [mucNuocLuThietKe, setMucNuocLuThietKe] = useState();
    const [mucNuocLuKiemTra, setMucNuocLuKiemTra] = useState();
    const [dungTichToanBo, setDungTichToanBo] = useState();
    const [dungTichHuuIch, setDungTichHuuIch] = useState();
    const [dungTichChet, setDungTichChet] = useState();
    const [luuLuongXaLuThietKe, setLuuLuongXaLuThietKe] = useState();
    const [luuLuongXaLuKiemTra, setLuuLuongXaLuKiemTra] = useState();

    const [isRequesting, setIsRequesting] = useState(false);
    const classes = useStyles();

    const handleLuuLuongXaLuKiemTraChange = (event) => {
        setLuuLuongXaLuKiemTra(event.target.value);
    };
    const handleLuuLuongXaLuThietKeChange = (event) => {
        setLuuLuongXaLuThietKe(event.target.value);
    };
    const handleDungTichChetChange = (event) => {
        setDungTichChet(event.target.value);
    };

    const handleDungTichHuuIchChange = (event) => {
        setDungTichHuuIch(event.target.value);
    };

    const handleDungTichToanBoChange = (event) => {
        setDungTichToanBo(event.target.value);
    };

    const handleMucNuocLuKiemTraChange = (event) => {
        setMucNuocLuKiemTra(event.target.value);
    };
    const handleMucNuocLuThietKeChange = (event) => {
        setMucNuocLuThietKe(event.target.value);
    };
    const handleMucNuocDangBinhThuongChange = (event) => {
        setMucNuocDangBinhThuong(event.target.value);
    };

    const handleDienTichTuoiChange = (event) => {
        setDienTichTuoi(event.target.value);
    };
    const handleMucNuocChetChange = (event) => {
        setMucNuocChet(event.target.value);
    };

    const handleMucDamBaoTuoiChange = (event) => {
        setMucDamBaoTuoi(event.target.value);
    };

    const handleDienTichLuuVucChange = (event) => {
        setDienTichLuuVuc(event.target.value);
    };

    const handleCapCongTrinhChange = (event) => {
        setCapCongTrinh(event.target.value);
    };

    /*const handleLakeIdChange = (event) => {
        setLakeId(event.target.value);
    };*/
    const handleLakeNameChange = (event) => {
        setLakeName(event.target.value);
    };
    const handleLatlngChange = (event) => {
        setLatlng(event.target.value);
    };
    /* need fix */
    const style = {
        width: "46.8%", 
        height: "320px",
    };
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [centerLat, setCenterLat] = useState();
    const [centerLng, setCenterLng] = useState();
    const mapClicked = (mapProps, map, event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log("lat ", lat);
        console.log("lng ", lng);
        setLng(lng);
        setLat(lat);
        setLatlng(lat + "," + lng);
        console.log(latlng);
    };

    const handleAnyChange = () => {
        if (lakeId === undefined) setLakeId(lake.lakeId);
        if (lakeName === undefined) setLakeName(lake.lakeName);
        if (latlng === undefined) setLatlng(lake.latitude + "," + lake.longitude);
        if (capCongTrinh === undefined) setCapCongTrinh(lake.capCongTrinh);
        if (dienTichLuuVuc === undefined) setDienTichLuuVuc(lake.dienTichLuuVuc);
    };

    handleAnyChange();
 
    const handleSubmit = (event) => {
        const data = {
            lakeId: lakeId,
            lakeName: lakeName,
            position: latlng,
            capCongTrinh: capCongTrinh,
            dienTichLuuVuc: dienTichLuuVuc,
            mucDamBaoTuoi: mucDamBaoTuoi,
            dienTichTuoi: dienTichTuoi,
            mucNuocChet: mucNuocChet,
            mucNuocDangBinhThuong: mucNuocDangBinhThuong,
            mucNuocLuThietKe: mucNuocLuThietKe,
            mucNuocLuKiemTra: mucNuocLuKiemTra,
            dungTichToanBo: dungTichToanBo,
            dungTichHuuIch: dungTichHuuIch,
            dungTichChet: dungTichChet,
            luuLuongXaLuThietKe: luuLuongXaLuThietKe,
            luuLuongXaLuKiemTra: luuLuongXaLuKiemTra,
        };
        setIsRequesting(true);
        authPost(dispatch, token, "/edit-lake/" + lakeId, data)
            .then(
                (res) => {
                    console.log(data);
                    setIsRequesting(false);
                    if (res.status === 401) {
                        dispatch(failed());
                        throw Error("Unauthorized");
                    } else if (res.status === 409) {
                        alert("Id exits!!");
                    } else if (res.status === 201) {
                        return res.text();
                    }
                },
                (error) => {
                    console.log(error);
                }
            )
            .then((res) => {
                history.push("/lake/list/");
            });
        event.preventDefault();
    };
    return (
        <div>
            <form className={classes.root} noValidate autoComplete="off">
                <Grid container spacing={5}>
                    <Grid item xs={5}>
                        <Paper className={classes.paper}>
                            <Typography variant="h5" component="h2">
                                Chỉnh sửa hồ đập
              </Typography>

                            <TextField
                                fullWidth
                                id="lakeId"
                                value={lakeId}
                                helperText="Mã hồ đập (Không chỉnh sửa)"
                                required
                            ></TextField>

                            <TextField
                                id="lakeName"
                                defaultValue={lakeName}
                                onChange={handleLakeNameChange}
                                helperText="Tên hồ đập"
                            ></TextField>

                            <TextField
                                id="latlng"
                                defaultValue={latlng}
                                value={latlng}
                                onChange={handleLatlngChange}
                                helperText="Tọa độ"
                            ></TextField>

                            <TextField
                                id="capCongTrinh"
                                defaultValue={capCongTrinh}
                                onChange={handleCapCongTrinhChange}
                                helperText="Cấp Công Trình"
                            ></TextField>

                            <TextField
                                id="dienTichLuuVuc"
                                defaultValue={dienTichLuuVuc}
                                onChange={handleDienTichLuuVucChange}
                                helperText="Diện tích lưu vực"
                            ></TextField>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                <Map
                        google={props.google}
                        zoom={11}
                        style={style}
                        initialCenter={{
                            lat: lake.latitude,
                            lng: lake.longitude
                        }}
                        center={{
                            lat: lake.latitude,
                            lng: lake.longitude
                        }}
                        onClick={mapClicked}
                    >
                        <Marker
                            title={'Geolocation'}
                            position={{
                                lat: lat,
                                lng: lng,
                            }}
                        />


                    </Map>
                </Grid>
                </Grid>
               
                
                <Button
                    disabled={isRequesting}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    style={{marginTop: "10px"}}
                >
                    Lưu
                </Button>
            </form>
        </div>
    );
}
export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
})(LakeEdit);
