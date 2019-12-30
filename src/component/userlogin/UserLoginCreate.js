import React,{ useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { API_URL } from "../../config/config";
import {connect} from "react-redux";
import { useHistory } from "react-router-dom";
import ListTrackLocations from "../tracklocations/listtracklocations";
import ListUserLogins from "../userlogin/listuserlogins";

function UserLoginCreate(props) {
  const history = useHistory();
  const [data,setData]= useState([]);
  const [userName, setUserName] = useState("");// new State (var) userName 
  const [password, setPassword] = useState("");// new State (var) password
  const [propsListTrackLocations, setPropsListTrackLocations] = useState(0);

const [isRequesting,setIsRequesting]= useState(false);



  const handleUserNameChange = event => {
    setUserName(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };
  const createUserLogin = e => {
    console.log("createUserLogin, token = " + props.token);
    const headers = new Headers();
    const data = {"userName":userName,"password":password};
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");
    headers.append("X-Auth-Token", props.token);
    setIsRequesting(true);
    fetch(`${API_URL}/create-userlogin`, {
      method: "POST",
      headers: headers,
      body:JSON.stringify(data)
    })
      .then(res => {
        console.log(res);
            setIsRequesting(false);
            //history.push("/tracklocations/list");
            setPropsListTrackLocations(propsListTrackLocations+1);
        return res.json()}
        )
      
      .then(
        res => {
           
        },
        error => {
            //setData([]);
        }
      );
  };



  

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Thong tin tai khoan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField required id="userName" label="User Name" fullWidth onChange={handleUserNameChange}/>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField required id="password" label="Password" fullWidth onChange={handlePasswordChange}/>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="secondary" onClick={createUserLogin} disabled={isRequesting}>
            Tạo mới
          </Button>
        </Grid>

      </Grid>
      <ListUserLogins isUpdate= {propsListTrackLocations}/>
     

    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  token: state.auth.token
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserLoginCreate);