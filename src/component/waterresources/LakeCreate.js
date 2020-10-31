import {CircularProgress, Grid, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {failed} from "../../action";
import {authPost, authPostMultiPart} from "../../api";
import StyledDropzone from "../common/StyleDropDzone";

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

export default function LakeCreate(){
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

  
    const handleLakeIdChange = (event) => {
        setLakeId(event.target.value);
    };
    const handleLakeNameChange = (event) => {
        setLakeName(event.target.value);
    };
    const handleLatlngChange = (event) => {
        setLatlng(event.target.value);
    };
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
          luuLuongXaLuKiemTra: luuLuongXaLuKiemTra

        };

        setIsRequesting(true);
        authPost(dispatch, token, "/create-lake", data).then(
          (res) => {
            console.log(res);
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
        ).then((res) => {
          history.push("/lake/list/");
        });
        event.preventDefault();
      };
    
    return(
        <div>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5" component="h2">
                  Tạo mới hồ đập
                </Typography>
  
                <TextField
                  fullWidth
                  id="lakeId"
                  label="Mã hồ đập"
                  onChange={handleLakeIdChange}
                  helperText="Push some characters identify yours product"
                  required
                ></TextField>
  
                <TextField
                  id="lakeName"
                  label="Tên hồ đập"
                  onChange={handleLakeNameChange}
                  helperText="Tên hồ đập"
                ></TextField>

                <TextField
                  id="latlng"
                  label="Tọa độ"
                  onChange={handleLatlngChange}
                  helperText="Tọa độ"
                ></TextField>

                <TextField
                  id="capCongTrinh"
                  label="Cấp Công Trình"
                  onChange={handleCapCongTrinhChange}
                  helperText="Cấp Công Trình"
                ></TextField>
                
                <TextField
                  id="dienTichLuuVuc"
                  label="Diện tích lưu vực"
                  onChange={handleDienTichLuuVucChange}
                  helperText="Diện tích lưu vực"
                ></TextField>

                
              </Paper>
            </Grid>
            
          </Grid>
  
          <Button
            disabled={isRequesting}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {isRequesting ? <CircularProgress/> : "Lưu"}
          </Button>
        </form>
      </div>
  
    );
}
