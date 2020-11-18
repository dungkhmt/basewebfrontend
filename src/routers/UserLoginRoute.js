import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import UserCreate from "../component/userlogin/createuser";
import UserDetail from "../component/userlogin/detailuserlogin";
import EditUser from "../component/userlogin/edituserlogin";
import UserList from "../component/userlogin/userlist";
import Update from "../component/userlogin/updatepassword";


export default function UserLoginRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Update} path={`${path}/update` } />
        <Route component={UserCreate} path={`${path}/create`} />
        <Route component={UserList} path={`${path}/list`} />
        <Route component={EditUser} path={`${path}/:partyId/edit`} />
        <Route component={UserDetail} path={`${path}/:partyId`} />
        
      
      </Switch>
    </div>
  );
}
