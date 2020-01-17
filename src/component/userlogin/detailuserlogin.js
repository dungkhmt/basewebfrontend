import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { authGet } from "../../api";
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 200
    }
  }
}));
function UserDetail(props) {
  const { partyId } = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const classes = useStyles();

  useEffect(() => {
    authGet(dispatch, token, "/rest/userCombineEntities/" + partyId).then(
      res => {
        setData(res);
      },
      error => {
        setData([]);
      }
    );
  }, []);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          Detail User {data.userLoginId}
        </Typography>
        <form className={classes.root} noValidate autoComplete="off">
          <div>
            <TextField
              id="firstName"
              label="First Name"
              value={data.firstName}
              variant="outlined"
              InputProps={{
                readOnly: true
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              id="middleName"
              label="Middle Name"
              value={data.middleName}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              id="lastName"
              label="LastName"
              value={data.lastName}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              id="birthDate"
              label="Birth Date"
              value={data.birthDate}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: true
              }}
            />
            <TextField
              id="userLoginId"
              label="UserName"
              value={data.userLoginId}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                readOnly: true
              }}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
