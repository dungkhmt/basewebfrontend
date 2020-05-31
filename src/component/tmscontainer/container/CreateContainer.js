import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authGet, authPost} from "../../../api";
import {failed} from "../../../action";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";

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

function CreateContainer(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);
  const [contContainerTypeList, setContContainerTypeList] = useState([]);
  const [containerType, setContainerType] = useState();
  const [containerId, setContainerId] = useState();
  const [containerName, setContainerName] = useState();
  const classes = useStyles();

  const handleContainerIdChange = event => {
    setContainerId(event.target.value);
  }

  const handleContainerNameChange = event => {
    setContainerName(event.target.value);
  }

  const handleContainerTypeChange = event => {
    setContainerType(event.target.value);
  }

  useEffect(() => {

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
      )

  }, []);

  const handleSubmit = event => {
    const data = {
      containerId: containerId,
      containerType: containerType,
      containerName: containerName
    }
    setIsRequesting(true);
    authPost(dispatch, token, "/save-container-to-db", data)
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

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Create Container
            </Typography>

            <form className={classes.root} noValidate autoComplete="off">


              <TextField
                id="containerId"
                onChange={handleContainerIdChange}
                required
                value={containerId}
                fullWidth
                helperText={"Mã container"}
              >
              </TextField>


              <TextField
                id="containerName"
                onChange={handleContainerNameChange}
                required
                value={containerName}
                fullWidth
                helperText={"Tên container"}
              >
              </TextField>

              <TextField
                select
                label="Select"
                onChange={handleContainerTypeChange}
                helperText="Select-containerType"
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


            </form>

          </CardContent>


          <CardActions>
            <Link to={"/containerfunc/list"}>
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
  )

}

export default CreateContainer;
