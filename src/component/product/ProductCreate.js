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
  const [productName, setProductName] = useState();
  const [uoms, setUoms] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [quantityUomId, setQuantityUomId] = useState(); //uom
  const [productTypes, setProductTypes] = useState([]);
  const [type, setType] = useState();
  const [productId, setProductId] = useState();
  let contentIds = [];
  const classes = useStyles();

  const handleProductIdChange = (event) => {
    setProductId(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleProductTypesChange = (event) => {
    setProductTypes(event.target.value);
  };

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleUomsChange = (event) => {
    setUoms(event.target.value);
  };

  const handleQuantityUomIdChange = (event) => {
    setQuantityUomId(event.target.value);
  };
  const uploadFile = async (files) => {
    contentIds = [];
    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      await authPostMultiPart(dispatch, token, "/content/", data)
        .then(
          (res) => {
            console.log(res);
            //setIsRequesting(false);
            if (res.status === 401) {
              dispatch(failed());
              throw Error("Unauthorized");
            } else if (res.status === 201) {
              return res.text();
            }
          },
          (error) => {
            console.log(error);
          }
        )
        .then((res) => {
          console.log(res);
          console.log(contentIds);
          contentIds.push(res);
          console.log(contentIds);
        });
    }
  };
  const handleSubmit = (event) => {
    const data = {
      productId: productId,
      quantityUomId: quantityUomId,
      type: type,
      productName: productName,
      content: contentIds,
    };
    console.log("data ", data);
    setIsRequesting(true);
    authPost(dispatch, token, "/add-new-product-to-db", data).then(
      (res) => {
        console.log(res);
        setIsRequesting(false);
        if (res.status === 401) {
          dispatch(failed());
          throw Error("Unauthorized");
        } else if (res.status === 409) {
          alert("Id exits!!");
        } else if (res.status === 201) {
          return res.json();
        }
      },
      (error) => {
        console.log(error);
      }
    );
    event.preventDefault();
    window.location.reload();
  };

  useEffect(() => {
    authPost(dispatch, token, "/get-list-uoms", { statusId: null })
      .then(
        (res) => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 200) {
            return res.json();
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .then((res) => {
        console.log("got uoms", res);
        setUoms(res.uoms);
        console.log(uoms);
      });
  }, []);

  useEffect(() => {
    authPost(dispatch, token, "/get-list-product-type", { statusId: null })
      .then(
        (res) => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized");
          } else if (res.status === 200) {
            return res.json();
          }
        },
        (error) => {
          console.log(error);
        }
      )
      .then((res) => {
        console.log("get product type", res);
        setProductTypes(res.productTypes);
      });
  }, []);

  return (
    <div>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5" component="h2">
                Create Product
              </Typography>

              <TextField
                fullWidth
                id="id"
                label="Product Code"
                onChange={handleProductIdChange}
                helperText="Push some characters identify yours product"
                required
              ></TextField>

              <TextField
                id="productName"
                label="product name"
                onChange={handleProductNameChange}
                helperText="product name"
              ></TextField>
              <TextField
                id="select-quantityUomId"
                select
                label="Select"
                onChange={handleQuantityUomIdChange}
                helperText="Select-quantityUomId"
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
                label="select"
                onChange={handleTypeChange}
                helperText={"select-type"}
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
                Upload Image
              </Typography>

              <StyledDropzone uploadFile={uploadFile} />
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
