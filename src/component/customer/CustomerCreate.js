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


function CustomerCreate(props) {
    const token = useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const [customerCode,setCustomerCode] = useState();
    const [customerName,setCustomerName] = useState();
    const [address,setAddress] = useState();
    const [latitude,setLatitude] = useState();
    const [longitude,setLongitude] = useState();
    const [isRequesting, setIsRequesting] = useState(false);

    const classes = useStyles();


    const handleCustomerCodeChange = event=>{
        setCustomerCode(event.target.value);
    }

    const handleCustomerNameChange = event=>{
        setCustomerName(event.target.value);
    }

    const handleAddressChange = event=>{
        setAddress(event.target.value);
    }

    const handleLatitudeChange = event=>{
        setLatitude(event.target.value);
    }

    const handleLongitudeChange = event=>{
        setLongitude(event.target.value);
    }



    const handleSubmit = event=>{
        const data={
            customerCode:customerCode,
            customerName:customerName,
            address:address,
            latitude:latitude,
            longitude:longitude
        }
        setIsRequesting(true);
        authPost(dispatch,token,"/create-customer",data)
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
        event.preventDefault();
        window.location.reload();
    }


    return(
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Create Customer
                    </Typography>
                    <form className={classes.root} noValidate autoComplete="off">
                        <TextField
                            id="customerCode"
                            label="customerCode"
                            onChange={handleCustomerCodeChange}
                            required
                            helperText="customerCode"
                            >

                        </TextField>

                        <TextField
                            id="customerName"
                            label="customerName"
                            onChange={handleCustomerNameChange}
                            required
                            helperText="customerName"
                            >

                        </TextField>

                        <TextField
                            id="address"
                            label="address"
                            onChange={handleAddressChange}
                            required
                            helperText="address"
                            >

                        </TextField>


                        <TextField
                            id="latitude"
                            label="latitude"
                            onChange={handleLatitudeChange}
                            required
                            helperText="latitude"
                            >

                        </TextField>


                        <TextField
                            id="longitude"
                            label="longitude"
                            onChange={handleLongitudeChange}
                            required
                            helperText="longitude"
                            >

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
    )

}























export default CustomerCreate;