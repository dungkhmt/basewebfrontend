import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreatePostOffice from "../component/postsystem/postoffice/CreatePostOffice";
import PostOfficeList from "../component/postsystem/postoffice/PostOfficeList";
import TripList from "../component/postsystem/posttrip/TripList";
import PostUserList from "../component/postsystem/postuser/PostCustomerList"
import PostShipOrderList from "../component/postsystem/postshiporder/PostShipOrderList"
import CreatePostShipOrder from "../component/postsystem/postshiporder/CreatePostShipOrder"
import ViewAllPostOffice from "../component/postsystem/postoffice/ViewAllPostOffice";
import ViewAllPostShipOrder from "../component/postsystem/postshiporder/ViewAllPostShipOrder";
import TripInfo from "../component/postsystem/posttrip/TripInfo";
import CreateTrip from "../component/postsystem/posttrip/CreateTrip"
import PostOrderDetail from "../component/postsystem/postshiporder/PostOrderDetail";
import PickAndDelivery from "../component/postsystem/planning/PickAndDelivery";
import PickAndDeliveryDetail from "../component/postsystem/planning/PickAndDeliveryDetail";
export default function PostOfficeRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={PostOfficeList} exact path={`${path}/list`} />
        <Route component={TripList} exact path={`${path}/triplist`} />
        <Route component={CreatePostOffice} exact path={`${path}/create`} />
        <Route component={PostUserList} exact path={`${path}/userlist`} />
        <Route component={PostShipOrderList} exact path={`${path}/orderlist`} />
        <Route component={CreatePostShipOrder} exact path={`${path}/createshiporder`} />
        <Route component={ViewAllPostOffice} exact path={`${path}/viewallpostoffice`} />
        <Route component={ViewAllPostShipOrder} exact path={`${path}/viewallshiporder`} />
        <Route component={PostOrderDetail} exact path={`${path}/shiporderdetail`} />
        <Route component={TripInfo} exact path={`${path}/tripinfo`} />
        <Route component={CreateTrip} exact path={`${path}/createtrip`} />
        <Route component={PickAndDelivery} exact path={`${path}/pickanddelivery`} />
        <Route component={PickAndDeliveryDetail} exact path={`${path}/pickanddeliverydetail`} />
      </Switch>
    </div>
  );
}
