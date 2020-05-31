import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
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

function SalesmanAdd(props) {
  const {partyId} = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [listCustomer, setListCustomer] = useState([]);
  const [listDistributor, setListDistributor] = useState([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [customer, setCustomer] = useState();
  const [distributor, setDistributor] = useState();


  const handleCustomerChange = event => {
    setCustomer(event.target.value);
  }

  const handleDistributorChange = event => {
    setDistributor(event.target.value);
  }


  useEffect(() => {
    console.log("partyId ", partyId);
    //authPost(dispatch,token,"/get-list-customer",{"statusId":null})
    authPost(dispatch, token, "/get-list-retail-outlet", {"statusId": null})
      .then(
        res => {
          console.log("GOT retail-outlet", res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(
        res => {
          console.log("res1 ", res.list);
          setListCustomer(res.list);
        })
  }, [])


  useEffect(() => {
    authPost(dispatch, token, "/get-list-distributor", {"statusId": null})
      .then(
        res => {
          console.log(res);
          setIsRequesting(false);
          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
        },
        error => {
          console.log(error);
        }
      )
      .then(
        res => {
          console.log("res2 ", res.lists);
          setListDistributor(res.lists);
        })
  }, [])


  const handleSubmit = event => {

    const data = {
      partyRetailOutletId: customer,
      partySalesmanId: partyId,
      partyDistributorId: distributor
    }
    console.log("data ", data);
    setIsRequesting(true);
    //authPost(dispatch,token,"/add-customer-distributor-salesman/"+partyId,data)
    //authPost(dispatch,token,"/add-retail-outlet-distributor-salesman/"+partyId,data)
    authPost(dispatch, token, "/add-retail-outlet-distributor-salesman", data)
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
          } else if (res.status === 208) {
            alert('DUPLICTED');
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

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Them moi
          </Typography>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="select-customer"
              select
              label="Select"
              onChange={handleCustomerChange}
              helperText="Select-customer"
            >
              {listCustomer.map(c => (
                <MenuItem
                  key={c.partyId}
                  value={c.partyId}
                >
                  {c.retailOutletName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              id="select-distributor"
              select
              label="Select"
              onChange={handleDistributorChange}
              helperText="Select-distributor"
            >
              {listDistributor.map(d => (
                <MenuItem
                  key={d.partyId}
                  value={d.partyId}
                >
                  {d.distributorName}
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
            {isRequesting ? <CircularProgress/> : "Lưu"}
          </Button>
        </CardActions>
      </Card>
    </MuiPickersUtilsProvider>
  );
}

export default SalesmanAdd;

