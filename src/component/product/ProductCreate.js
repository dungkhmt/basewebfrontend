import {makeStyles} from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import {authPost} from "../../api";
import {failed} from "../../action";
import MenuItem from "@material-ui/core/MenuItem";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: 200
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
    }
}));


function ProductCreate(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const history = useHistory();
    const [productName,setProductName] = useState();
    const [uoms,setUoms] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [quantityUomId,setQuantityUomId] = useState();//uom
    const [productTypes, setProductTypes] = useState([]);
    const [type,setType] = useState();
    const [productId,setProductId] = useState();
    const classes = useStyles();

    const handleProductIdChange = event=>{
        setProductId(event.target.value);
    }

    const handleTypeChange = event =>{
        setType(event.target.value);
    }

    const handleProductTypesChange = event =>{
        setProductTypes(event.target.value);
    }

    const handleProductNameChange = event =>{
        setProductName(event.target.value);
    }


    const handleUomsChange = event=>{
        setUoms(event.target.value);
    }



    const handleQuantityUomIdChange = event => {
        setQuantityUomId(event.target.value);
    }


    const handleSubmit = () => {
        const data = {
            productId: productId,
            quantityUomId: quantityUomId,
            type: type,
            productName:productName

        }
        console.log("data ",data);
        setIsRequesting(true);
        authPost(dispatch,token,"/add-new-product-to-db",data)
            .then(
                res => {
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
                error => {
                    console.log(error);
                }
            )

    }

    useEffect(() =>{
        authPost(dispatch,token,"/get-list-uoms",{"statusId":null})
            .then(
                res => {
                    console.log(res);
                    setIsRequesting(false);
                    if(res.status === 401){
                        dispatch(failed());
                        throw Error("Unauthorized")
                    }else if(res.status === 200){
                        return res.json();
                    }
                },
                error => {
                    console.log(error);
                }
            )
            .then(
                res =>{
                console.log('got uoms',res);
                setUoms(res.uoms);
                console.log(uoms);
            })
    },[])



    useEffect(() =>{
        authPost(dispatch,token,"/get-list-product-type",{"statusId":null})
            .then(
                res => {
                    console.log(res);
                    setIsRequesting(false);
                    if(res.status === 401){
                        dispatch(failed());
                        throw Error("Unauthorized")
                    }else if(res.status === 200){
                        return res.json();
                    }
                },
                error => {
                    console.log(error);
                }
            )
            .then(
                res => {
                    console.log("get product type",res);
                    setProductTypes(res.productTypes);
                }
            )
    },[])

    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Create Product
                    </Typography>

                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="id"
                            label="product-id"
                            value={productId}
                            onChange={handleProductIdChange}
                            helperText="product-id"
                            required
                            >
                        </TextField>


                        <TextField
                            id="productName"
                            label="product name"
                            value={productName}
                            onChange={handleProductNameChange}
                            helperText="product name"
                            >
                        </TextField>


                        <TextField
                            id="select-quantityUomId"
                            select
                            label="Select"
                            value={quantityUomId}
                            onChange={handleQuantityUomIdChange}
                            helperText="Select-quantityUomId"
                            >
                            {uoms.map(uom => (
                                <MenuItem
                                    key={uom.uomId}
                                    value={uom.uomId}
                                    >
                                    {uom.description}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            id="select-type"
                            select
                            label="select"
                            value={type}
                            onChange={handleTypeChange}
                            helperText={"select-type"}
                            >
                            {productTypes.map(productType => (
                                <MenuItem
                                key={productType.productTypeId}
                                value={productType.productTypeId}
                                >
                                    {productType.description}
                                </MenuItem>
                            ))}
                        </TextField>








                    </form>

                </CardContent>


                <CardActions>
                    <Button
                        disabled={isRequesting}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        {isRequesting ? <CircularProgress /> : "Lưu"}
                    </Button>
                </CardActions>


            </Card>
        </MuiPickersUtilsProvider>
    );


}


export default ProductCreate;


