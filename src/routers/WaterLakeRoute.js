import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import  LakeInfo  from "../component/waterresources/LakeInfo";
import  LakeLiveInfo  from "../component/waterresources/LakeLiveInfo";
import  LakeCreate  from "../component/waterresources/LakeCreate";
import  LakeList  from "../component/waterresources/LakeList";
import  LakeListAll  from "../component/waterresources/LakeListAll";
import LakeEdit from "../component/waterresources/LakeEdit";
export default function WaterLakeRoute() {
  let { path, url } = useRouteMatch();
  console.log('WaterLake path = ',path);
  return (
    <div>
      <Switch>
        <Route component={LakeCreate} path={`${path}/create`} />
        <Route component={LakeEdit} path={`${path}/edit/:lakeId`} />
        <Route component={LakeLiveInfo} path={`${path}/info/:lakeId`} />        
        <Route component={LakeList} path={`${path}/list`} />
        <Route component={LakeListAll} path={`${path}/listall`} />
      </Switch>
    </div>
  );
}