import React from "react";
import { Redirect, Switch, useParams } from "react-router-dom";
export default function DetailUserLogin(){
    let { username } = useParams();
    return (
        
    <h1>INFO: {username}</h1>
    );
}