import React,{ useEffect, useState } from "react";
import { Redirect, Switch, useParams } from "react-router-dom";
import { API_URL } from "../../config/config";
import {connect} from "react-redux";

function DetailUserLogin(props){
    let { username } = useParams();
    const [data,setData]= useState("");
    const inputdata = {"userName":username};
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type","application/json");
    headers.append("X-Auth-Token", props.token);
    
    fetch(`${API_URL}/get-detail-user-login`, {
      method: "POST",
      headers: headers,
      body:JSON.stringify(inputdata)
    })
      .then(res => {
        console.log(res);
           setData(res);
        return res.json()}
        )
      
      .then(
        res => {
           
        },
        error => {
            //setData([]);
        }
      );
        
    return (
        
    <h1>INFO: {username},{data.userName}</h1>
    );
}

const mapStateToProps = state => ({
    token: state.auth.token
  });
  
  const mapDispatchToProps = dispatch => ({});
  
  export default connect(mapStateToProps, mapDispatchToProps)(DetailUserLogin);