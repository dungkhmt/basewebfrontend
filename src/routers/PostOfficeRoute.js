import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreatePostOffice from "../component/postsystem/postoffice/CreatePostOffice";
import PostOfficeList from "../component/postsystem/postoffice/PostOfficeList";

export default function PostOfficeRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={PostOfficeList} exact path={`${path}/list`} />
        <Route component={CreatePostOffice} exact path={`${path}/create`} />
      </Switch>
    </div>
  );
}
