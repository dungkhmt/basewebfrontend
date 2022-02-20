import { CircularProgress, Grid, Paper } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { authPost, authPostMultiPart } from "../../api";

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

function ProductCreate(props) {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [productName, setProductName] = useState();
  const [uoms, setUoms] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [quantityUomId, setQuantityUomId] = useState(); //uom
  const [productTypes, setProductTypes] = useState([]);
  const [type, setType] = useState();
  const [productId, setProductId] = useState();
  // const [contentIds, setContentIds] = useState([]);

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const handleAttachmentFiles = (files) => {
    setAttachmentFiles(files);
  };

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleQuantityUomIdChange = (event) => {
    setQuantityUomId(event.target.value);
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
  const handleSubmit = async (event) => {
    const fileId = attachmentFiles.map((file) => file.name);

    const data = {
      productId: productId,
      productName: productName,
      uomId: quantityUomId,
      productType: type,
      fileId, // images
    };

    let formData = new FormData();
    formData.append("CreateProductInputModel", JSON.stringify(data));
    for (const file of attachmentFiles) {
      formData.append("files", file);
    }

    // setIsRequesting(true);
    try {
      await authPostMultiPart(
        dispatch,
        token,
        "/add-new-product-to-db",
        formData
      );
    } catch (error) {
      console.error("error create new product: ", error);
    }
    // .then(
    //   (res) => {
    //     console.log(res);
    //     setIsRequesting(false);
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
    // )
    // .then((res) => {
    //   history.push("/products/" + res);
    // });
    history.push("/products/" + productId);
    event.preventDefault();
  };

  // useEffect(() => {
  // authPost(dispatch, token, "/get-list-uoms", { statusId: null }).then(
  //   (res) => {
  //     console.log(res);
  //     setIsRequesting(false);
  //     if (res.status === 401) {
  //       dispatch(failed());
  //       throw Error("Unauthorized");
  //     } else if (res.status === 200) {
  //       setUoms(res.uoms);
  //     }
  //   },
  //   (error) => {
  //     console.log(error);
  //   }
  // );
  // .then((res) => {
  //   console.log("got uoms", res);
  //   setUoms(res.uoms);
  //   console.log(uoms);
  // });
  // }, []);

  useEffect(() => {
    (async () => {
      try {
        const listProductTypeRes = await authPost(
          dispatch,
          token,
          "/get-list-product-type",
          { statusId: null }
        );
        setProductTypes(listProductTypeRes.productTypes);
      } catch (error) {
        console.error("get list product type error: ", error);
      }
      try {
        const listUomsRes = await authPost(dispatch, token, "/get-list-uoms", {
          statusId: null,
        });
        setUoms(listUomsRes.uoms);
      } catch (error) {
        console.error("get list uoms error: ", error);
      }
    })();
    // authPost(dispatch, token, "/get-list-product-type", {
    //   statusId: null,
    // }).then(
    //   (res) => {
    //     console.log(res);
    //     setIsRequesting(false);
    //     if (res.status === 401) {
    //       dispatch(failed());
    //       throw Error("Unauthorized");
    //     } else if (res.status === 200) {
    //       console.log("res2", res);
    //       setProductTypes(res.productTypes);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    // .then((res) => {
    //   console.log("get product type", res);
    //   setProductTypes(res.productTypes);
    // });
  }, []);

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5" component="h2">
                Tạo sản phẩm mới
              </Typography>

              <TextField
                fullWidth
                id="id"
                label="Mã sản phẩm"
                onChange={handleProductIdChange}
                helperText="Nhập mã sản phẩm"
                required
              ></TextField>

              <TextField
                id="productName"
                label="Tên sản phẩm"
                onChange={handleProductNameChange}
                helperText="Tên sản phẩm"
              ></TextField>
              <TextField
                id="select-quantityUomId"
                select
                label="Lựa chọn"
                onChange={handleQuantityUomIdChange}
                helperText="Chọn đơn vị đo sản phẩm"
              >
                {uoms.map((uom) => (
                  <MenuItem key={uom.uomId} value={uom.uomId}>
                    {uom.description}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="select-type"
                select
                label="Lựa chọn"
                onChange={handleTypeChange}
                helperText={"chọn loại sản phẩm"}
              >
                {productTypes.map((productType) => (
                  <MenuItem
                    key={productType.productTypeId}
                    value={productType.productTypeId}
                  >
                    {productType.description}
                  </MenuItem>
                ))}
              </TextField>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h6" component="h2">
                Tải ảnh đại diện cho sản phẩm (chỉ 1 ảnh)
              </Typography>

              {/* <StyledDropzone uploadFile={uploadFile} /> */}
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
                getFileRemovedMessage={(fileName) =>
                  `Tệp ${fileName} đã loại bỏ`
                }
                getFileLimitExceedMessage={(filesLimit) =>
                  `Vượt quá số lượng tệp tối đa được cho phép. Chỉ được phép tải lên tối đa ${filesLimit} tệp.`
                }
                alertSnackbarProps={{
                  anchorOrigin: { vertical: "bottom", horizontal: "right" },
                  autoHideDuration: 1800,
                }}
                onChange={(files) => handleAttachmentFiles(files)}
              ></DropzoneArea>
            </Paper>
          </Grid>
        </Grid>

        <Button
          disabled={isRequesting}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          {isRequesting ? <CircularProgress /> : "Lưu"}
        </Button>
      </form>
    </div>
  );
}

export default ProductCreate;
