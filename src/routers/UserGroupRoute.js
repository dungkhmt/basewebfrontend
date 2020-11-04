import React from "react";
import {Route, Switch, useRouteMatch} from "react-router";
import ListDepartment from "../component/departments/listdepartment";
import Approve from "../component/userregister/Approve";
import NewApprove from "../component/userregister/approve/NewApprove";

export default function UserGroupRoute() {
  let {path, url} = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ListDepartment} path={`${path}/departments/list`}/>
        <Route component={NewApprove} path={`${path}/user/approve-register`}/>
      </Switch>
    </div>
  );
}
