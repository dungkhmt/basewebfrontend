import { Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { authPostMultiPart } from "../../api";
import { dataUrlToFile, randomImageName } from "../../utils/FileUpload/covert";

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
  imageContainer: {
    marginTop: "12px",
  },
  imageWrapper: {
    position: "relative",
  },
  imageQuiz: {
    maxWidth: "100%",
  },
  buttonClearImage: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 3,
    color: "red",
    width: 32,
    height: 32,
    cursor: "pointer",
  },
}));

function AddProductImg(props) {
  const { productId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const classes = useStyles();

  // const [contentIds, setContentIds] = useState([]);

  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [oldAttachmentImages, setOldAttachmentImages] = useState([]);

  useEffect(() => {
    if (
      location.state &&
      location.state.data &&
      location.state.data.attachmentImages
    ) {
      const newFileURLArray = location.state.data.attachmentImages.map(
        (url) => ({
          id: randomImageName(),
          url,
        })
      );
      setOldAttachmentImages(newFileURLArray);
    }
  }, [location]);

  const handleAttachmentFile = (files) => {
    setAttachmentFiles(files);
  };

  const handleDeleteImageAttachment = async (fileId) => {
    const newFileArray = oldAttachmentImages.filter(
      (file) => file.id !== fileId
    );
    setOldAttachmentImages(newFileArray);
  };

  const handleSubmit = async () => {
    const fetchedFileArray = [];
    if (oldAttachmentImages.length > 0) {
      for (const fetchedFile of oldAttachmentImages) {
        const file = await dataUrlToFile(
          `data:image/jpeg;base64,${fetchedFile.url}`,
          fetchedFile.id
        );
        fetchedFileArray.push(file);
      }
    }

    const newAttachmentFiles = [...fetchedFileArray, ...attachmentFiles];

    const fileId = newAttachmentFiles.map((file) => {
      if (typeof file.name !== "undefined") {
        return file.name;
      }
      return file.id;
    });

    let body = {
      fileId,
    };

    let formData = new FormData();
    formData.append("fileId", JSON.stringify(body));
    for (const file of newAttachmentFiles) {
      formData.append("files", file);
    }

    try {
      await authPostMultiPart(
        dispatch,
        token,
        "/save-attachment-images/" + productId,
        formData
      );
      history.push("/products/" + productId);
    } catch (error) {
      console.error("upload product attachment images error: ", error);
    }

    // const data = {
    //   content: contentIds,
    // };

    // authPost(dispatch, token, "/add-new-image/" + productId, data).then(
    //   (res) => {
    //     console.log(res);

    //     if (res.status === 401) {
    //       dispatch(failed());
    //       throw Error("Unauthorized");
    //     } else if (res.status === 409) {
    //       alert("Id exits!!");
    //     } else if (res.status === 201) {
    //       return res.text();
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  };

  // const uploadFile = async (files) => {
  //   let contentIds = [];
  //   for (const file of files) {
  //     const data = new FormData();
  //     data.append("file", file);
  //     await authPostMultiPart(dispatch, token, "/content/", data)
  //       .then(
  //         (res) => {
  //           console.log(res);
  //           //setIsRequesting(false);
  //           if (res.status === 401) {
  //             dispatch(failed());
  //             throw Error("Unauthorized");
  //           } else if (res.status === 201) {
  //             return res.text();
  //           }
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       )
  //       .then((res) => {
  //         contentIds.push(res);
  //       });
  //   }
  //   setContentIds(contentIds);
  // };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2">
          Ảnh đính kèm hiện tại của sản phẩm
        </Typography>
        <Grid container spacing={4}>
          {oldAttachmentImages && oldAttachmentImages.length > 0 ? (
            oldAttachmentImages.map((i, index) => (
              <Grid item xs={12} md={4} key={i.id}>
                <div className={classes.imageContainer}>
                  <div className={classes.imageWrapper}>
                    <HighlightOffIcon
                      className={classes.buttonClearImage}
                      onClick={() => handleDeleteImageAttachment(i.id)}
                    />
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${i.url}`}
                      className={classes.imageQuiz}
                      alt="product"
                    />
                  </div>
                </div>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" component="h6">
              Sản phẩm chưa có ảnh hiển thị
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" component="h2">
          Thêm ảnh cho sản phẩm {productId}
        </Typography>
        <Paper className={classes.paper}>
          <Typography variant="h6" component="h2">
            Upload Image
          </Typography>

          {/* <StyledDropzone uploadFile={uploadFile} /> */}
          <DropzoneArea
            dropzoneClass={classes.dropZone}
            filesLimit={10} // only 1 image for avatar
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
        </Paper>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Lưu
      </Button>
    </Grid>
  );
}

export default AddProductImg;
