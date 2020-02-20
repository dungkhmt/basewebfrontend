import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  CircularProgress
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { authGet, authDelete } from "../../api";
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
  const history = useHistory();
  const { partyId } = useParams();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    authGet(dispatch, token, "/users/" + partyId).then(
      res => {
        setData(res);
        if (res._links !== undefined) {
          if (res._links.edit !== undefined) setCanEdit(true);
          if (res._links.delete !== undefined) setCanDelete(true);
        }
      },
      error => {
        setData([]);
      }
    );
  }, []);
  const handlePopup = value => {
    setOpenPopup(value);
  };

  const deleteUser = value => {
    setIsWaiting(true);
    authDelete(dispatch, token, "/users/" + partyId).then(
      res => {
        if(res===true){
        setOpenPopup(false);
        history.push("/userlogin/list");
        }
      },
      error => {
        setData([]);
      }
    );
  };
  return (
    <div>
      <Dialog
        open={openPopup}
        onClose={() => handlePopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this Person?"}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete this Person?
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button
            variant="contained"
            disabled={isWaiting}
            onClick={() => deleteUser()}
            color="secondary"
          >
            {isWaiting ? <CircularProgress color="secondary"/> : "Yes"  }
          </Button>
          <Button
            disabled={isWaiting}
            onClick={() => handlePopup(false)}
            color="action"
            autoFocus
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" align="left">
            Detail User {data.userLoginId}
            {canDelete ? (
              <IconButton
                style={{ float: "right" }}
                onClick={() => handlePopup(true)}
                aria-label="Delete"
                component="span"
              >
                <DeleteIcon color="error"></DeleteIcon>
              </IconButton>
            ) : (
              ""
            )}
            {canEdit ? (
              <IconButton
                style={{ float: "right" }}
                onClick={() => history.push("/userlogin/" + partyId + "/edit")}
                aria-label="Edit"
                component="span"
              >
                <EditIcon color="action"></EditIcon>
              </IconButton>
            ) : (
              ""
            )}
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
    </div>
  );
}

export default UserDetail;
