import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {authGet, authPost} from "../../../api";
import {failed} from "../../../action";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import DateTimePicker from 'react-datetime-picker';
import CardActions from "@material-ui/core/CardActions";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import NumberFormat from 'react-number-format';


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

function CreateRequestTransportFullExport() {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [customer, setCustomer] = useState();
  const [listCustomer, setListCustomer] = useState([]);
  const [facility, setFacility] = useState();
  const [listFacility, setListFacility] = useState([]);
  const [contContainerTypeList, setContContainerTypeList] = useState([]);
  const [containerType, setContainerType] = useState();
  const [isRequesting, setIsRequesting] = useState(false);
  const [numberContainer, setNumberContainer] = useState();
  const [earlyDate, setEarlyDate] = useState(new Date());
  const [lateDate, setLateDate] = useState(new Date());
  const [trailer, setTrailer] = useState();
  const [trailerList, setTrailerList] = useState(["Y", "N"]);
  const [port, setPort] = useState();
  const [portList, setPortList] = useState([]);


  const handleSubmit = event => {
    const data = {
      customerId: customer,
      facilityId: facility,
      containerTypeId: containerType,
      numberContainer: numberContainer,
      earlyDate: earlyDate,
      lateDate: lateDate,
      trailer: trailer,
      portId: port
    }
    setIsRequesting(true);
    authPost(dispatch, token, "/create-request-export-full", data)
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
      );


  }


  const handlePortChange = event => {
    setPort(event.target.value);
  }

  const handleTrailerChange = event => {
    setTrailer(event.target.value);
  }

  const handleEarlyDateChange = date => {
    setEarlyDate(date);
    //console.log("earlydate", event.target.value);
  }

  const handleLateDateChange = date => {
    setLateDate(date);
  }

  const handleContainerTypeChange = event => {
    setContainerType(event.target.value);
  }

  const handleNumberContainerChange = event => {
    console.log("number", event.target.value);
    setNumberContainer(event.target.value);
  }

  const handleCustomerChange = event => {
    setCustomer(event.target.value);
  }

  const handleFacilityChange = event => {
    setFacility(event.target.value);
  }


  useEffect(() => {
    authPost(dispatch, token, "/get-list-customer", {"statusId": null})
      //authPost(dispatch,token,"/get-list-retail-outlet",{"statusId":null})
      .then(
        res => {
          //console.log("GOT retail-outlet",res);
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
          console.log("res1 ", res);
          setListCustomer(res.lists);
        });

    authGet(dispatch, token, "/get-list-container-type")
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
          setContContainerTypeList(res.contContainerTypes);
        },
        error => {
          console.log(error);
        }
      );

    authPost(dispatch, token, "/get-list-facility", {"statusId": null})
      //authPost(dispatch,token,"/get-list-retail-outlet",{"statusId":null})
      .then(
        res => {
          //console.log("GOT retail-outlet",res);
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
          console.log("res2 ", res.facilities);
          setListFacility(res.facilities);
        });

    authGet(dispatch, token, "/get-list-cont-port")
      .then(
        res => {
          console.log("sssssss");
          console.log(res);
          setIsRequesting(false);

          if (res.status === 401) {
            dispatch(failed());
            throw Error("Unauthorized")
          } else if (res.status === 200) {
            return res.json();
          }
          setPortList(res.list);

        },
        error => {
          console.log(error);
        }
      );
  }, []);


  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Thêm mới yêu cầu vận chuyển kho ra bãi
            </Typography>

            <form className={classes.root} noValidate autoComplete="off">
              <Typography variant="h6" component="h4">
                Chọn khách hàng:
                <TextField
                  select
                  required
                  onChange={handleCustomerChange}

                >
                  {listCustomer.map(c => (
                    <MenuItem
                      key={c.partyId}
                      value={c.partyId}
                    >
                      {c.customerName}
                    </MenuItem>
                  ))}
                </TextField>
              </Typography>
              <br/>
              <Typography variant="h6" component="h4">
                Chọn kho:
                <TextField
                  required
                  select
                  onChange={handleFacilityChange}
                >
                  {listFacility.map(c => (
                    <MenuItem
                      key={c.facilityId}
                      value={c.facilityId}
                    >
                      {c.facilityName}
                    </MenuItem>
                  ))}
                </TextField>
              </Typography>
              <br/>

              <Typography variant="h6" component="h4">
                Chọn bến cảng:
                <TextField
                  required
                  select
                  onChange={handlePortChange}
                >
                  {portList.map(c => (
                    <MenuItem
                      key={c.portId}
                      value={c.portId}
                    >
                      {c.portName}
                    </MenuItem>
                  ))}
                </TextField>
              </Typography>
              <br/>


              <Typography variant="h6" component="h4">
                Số container:
                <NumberFormat
                  value={numberContainer}
                  customInput={TextField}
                  format="#### #### #### ####"
                  onChange={handleNumberContainerChange}
                ></NumberFormat>


              </Typography>


              <br/>
              <Typography variant="h6" component="h4">
                Loại container:
                <TextField
                  required
                  select
                  onChange={handleContainerTypeChange}
                >
                  {contContainerTypeList.map(containerType => (
                    <MenuItem
                      key={containerType.containerTypeId}
                      value={containerType.containerTypeId}
                    >
                      {containerType.description}
                    </MenuItem>
                  ))}
                </TextField>
              </Typography>
              <br/>
              <Typography variant="h6" component="h4">
                Chọn ngày giờ sớm nhất: {"   "}
                <DateTimePicker
                  value={earlyDate}
                  onChange={handleEarlyDateChange}
                  required
                />
              </Typography>
              <br/>
              <Typography variant="h6" component="h4">
                Chọn ngày giờ muộn nhất: {"   "}
                <DateTimePicker
                  value={lateDate}
                  onChange={handleLateDateChange}
                  required
                />
              </Typography>
              <br/>
              <Typography variant="h6" component="h4">
                Chọn rơ-mooc:
                <TextField
                  required
                  select
                  onChange={handleTrailerChange}
                >
                  {trailerList.map(c => (
                    <MenuItem
                      key={c}
                      value={c}
                    >
                      {c}
                    </MenuItem>
                  ))}
                </TextField>


              </Typography>


              <br/><br/><br/><br/><br/><br/>


            </form>
          </CardContent>


          <CardActions>
            <Link to={"/list-request-transport-full-export"}>
              <Button
                disabled={isRequesting}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {isRequesting ? <CircularProgress/> : "Lưu"}
              </Button>
            </Link>
          </CardActions>


        </Card>
      </MuiPickersUtilsProvider>


    </div>
  );
}

export default CreateRequestTransportFullExport;
