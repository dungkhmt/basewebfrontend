import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authPost} from "../../../api";
import {failed} from "../../../action";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Card from "@material-ui/core/Card";
import {CardContent, CircularProgress} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
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


function TrailerCreate(props) {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [isRequesting, setIsRequesting] = useState(false);
  const [trailerId, setTrailerId] = useState();
  const [description, setDescription] = useState();
  const classes = useStyles();

  const handleTrailerIdChange = event => {
    setTrailerId(event.target.value);
  }

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  }
  const handleSubmit = event => {
    const data = {
      trailerId: trailerId,
      description: description
    }
    setIsRequesting(true);
    authPost(dispatch, token, "/save-trailer-to-db", data)
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
                id="trailerId"
                onChange={handleTrailerIdChange}
                required
                value={trailerId}
                fullWidth
                helperText={"Mã rơ mooc "}
              >
              </TextField>


              <TextField
                id="description"
                onChange={handleDescriptionChange}
                required
                value={description}
                fullWidth
                helperText={"Mã rơ mooc "}
              >
              </TextField>


            </form>

          </CardContent>


          <CardActions>
            <Link to={"/trailerfunc/list"}>
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

export default TrailerCreate;
