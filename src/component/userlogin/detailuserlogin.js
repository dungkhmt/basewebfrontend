import React,{ useEffect, useState } from "react";
import { Redirect, Switch, useParams } from "react-router-dom";
import { API_URL } from "../../config/config";
import {connect} from "react-redux";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

function DetailUserLogin(props){
    let { username } = useParams();
    const [data,setData]= useState("");
    const [securityGroups, setSecurityGroups] = useState([]);
    const inputdata = {"userName":username};
    //const securityGroups = [];

    /*
    const securityGroups = [
      { label: "Apple", value: 1 },
      { label: "Facebook", value: 2 },
      { label: "Netflix", value: 3 },
      { label: "Tesla", value: 4 },
      { label: "Amazon", value: 5 },
      { label: "Alphabet", value: 6 },
    ];
    */

    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");
    headers.append("X-Auth-Token", props.token);
    
    
    useEffect(() => {
    fetch(`${API_URL}/get-detail-user-login`, {
      method: "POST",
      headers: headers,
      body:JSON.stringify(inputdata)
    })
      .then(res => {
        console.log("first then, res = ");
        console.log(res);
           setData(res);
           //setSecurityGroups(res.allSecurityGroups);
          return res.json()}
        )
      
      .then(
        res => {
           console.log("second then");
           console.log(res);
           setData(res);
           setSecurityGroups(res.allSecurityGroups);
           //securityGroups = res.allSecurityGroups;
           console.log(res.allSecurityGroups);
        },
        error => {
            //setData([]);
        }
      );
    },[]);

      return (        
        

        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          
          
        >
        {
          securityGroups.map(row =>(
            <MenuItem value={row.groupId}>{row.description}</MenuItem>
          ))
        }
        </Select>

      );
}

const mapStateToProps = state => ({
    token: state.auth.token
  });
  
  const mapDispatchToProps = dispatch => ({});
  
  export default connect(mapStateToProps, mapDispatchToProps)(DetailUserLogin);