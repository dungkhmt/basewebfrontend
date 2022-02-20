import { Button, Grid, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { authPostMultiPart } from "../../api";
// import ImageItem from "./ImageItem";

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

function SetPrimaryImg(props) {
  const location = useLocation();
  const history = useHistory();
  const { productId } = useParams();
  const classes = useStyles();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  // const [primaryImgId, setPrimaryImgId] = useState();
  // const [data, setData] = useState([]);

  const [attachmentFile, setAttachmentFile] = useState();

  const handleAttachmentFile = (file) => {
    setAttachmentFile(file[0]);
  };

  const handleSubmit = async () => {
    const body = {
      fileId: attachmentFile.name,
    };

    let formData = new FormData();
    formData.append("fileName", JSON.stringify(body));
    formData.append("file", attachmentFile);

    try {
      await authPostMultiPart(
        dispatch,
        token,
        "/set-product-avatar/" + productId,
        formData
      );
      history.push("/products/list");
    } catch (error) {
      console.error("change product avatar image: ", error);
    }
  };

  // useEffect(() => {
  //   authGet(dispatch, token, "/get-list-product-img/" + productId).then(
  //     (res) => {
  //       console.log("res", res);
  //       setData(res.productImageInfoModels);
  //       setPrimaryImgId(res.primaryImgId);
  //     },
  //     (error) => {}
  //   );
  // }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h5" component="h2">
          Ảnh hiển thị hiện tại của sản phẩm
        </Typography>
        {location.state?.data && location.state.data.avatar ? (
          <Grid container>
            <img
              src={`data:image/jpeg;base64,${location.state.data.avatar}`}
              width="100%"
              height="100%"
              alt="product"
            />
          </Grid>
        ) : (
          <Grid container>
            <Typography
              variant="body1"
              component="h6"
              style={{ marginTop: "12px", paddingLeft: "12px" }}
            >
              Sản phẩm chưa có ảnh hiển thị
            </Typography>
          </Grid>
        )}
      </Grid>

      <Grid item xs={12} sm={6} style={{ marginTop: "24px" }}>
        <Typography variant="h5" component="h2">
          Thay đổi ảnh hiển thị
        </Typography>
        {/* <div
        style={{
          display: "flex",
          marginTop: "200px",
          justifyContent: "center",
        }}
      >
        <Grid container spacing={12}>
          {data.map((item) => (
            <Grid item xs={3}>
              <ImageItem
                item={item}
                key={item.id}
                setSelectedImage={setPrimaryImgId}
                selectedImage={primaryImgId}
              />
            </Grid>
          ))}
        </Grid>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br /> */}
        <DropzoneArea
          dropzoneClass={classes.dropZone}
          filesLimit={1} // only 1 image for avatar
          showPreviews={true}
          showPreviewsInDropzone={false}
          useChipsForPreview
          dropzoneText="Kéo và thả tệp vào đây hoặc nhấn để chọn tệp"
          previewText="Xem trước:"
          previewChipProps={{
            variant: "outlined",
            color: "primary",
            size: "medium",
          }}
          getFileAddedMessage={(fileName) =>
            `Tệp ${fileName} tải lên thành công`
          }
          getFileRemovedMessage={(fileName) => `Tệp ${fileName} đã loại bỏ`}
          getFileLimitExceedMessage={(filesLimit) =>
            `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
          }
          alertSnackbarProps={{
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 1800,
          }}
          onChange={(files) => handleAttachmentFile(files)}
        />
      </Grid>

      <Grid container spacing={12}>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Link to={"/product-group/product-edit/" + productId}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default SetPrimaryImg;
