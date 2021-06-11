import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import CreatePostOffice from "../component/postsystem/postoffice/CreatePostOffice";
import PostOfficeList from "../component/postsystem/postoffice/PostOfficeList";
import TripList from "../component/postsystem/posttrip/TripList";
import PostUserList from "../component/postsystem/postuser/PostCustomerList";
import PostShipOrderList from "../component/postsystem/postshiporder/PostShipOrderList";
import CreatePostShipOrder from "../component/postsystem/postshiporder/CreatePostShipOrder";
import ViewAllPostOffice from "../component/postsystem/postoffice/ViewAllPostOffice";
import ViewAllPostShipOrder from "../component/postsystem/postshiporder/ViewAllPostShipOrder";
import TripInfo from "../component/postsystem/posttrip/TripInfo";
import CreateTrip from "../component/postsystem/posttrip/CreateTrip";
import ExecuteTrip from "../component/postsystem/posttrip/ExecuteTrip";
import PostOrderDetail from "../component/postsystem/postshiporder/PostOrderDetail";
import PickAndDelivery from "../component/postsystem/planning/PickAndDelivery";
import PickAndDeliveryDetail from "../component/postsystem/planning/PickAndDeliveryDetail";
import ShipAndDelivery from "../component/postsystem/planning/ShipAndDelivery";
import ShipAndDeliveryDetail from "../component/postsystem/planning/ShipAndDeliveryDetail";
import PostDriverExecuteTrip from "../component/postsystem/posttrip/PostDriverExecuteTrip";
import ManagePostman from "../component/postsystem/postuser/ManagePostman";
import PostDriverDetail from "../component/postsystem/postuser/PostDriverDetail";
import PostmanOrderAssignmentDetail from "../component/postsystem/postuser/PostmanOrderAssignmentDetail";
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
        <Route
          component={CreatePostShipOrder}
          exact
          path={`${path}/createshiporder`}
        />
        <Route
          component={ViewAllPostOffice}
          exact
          path={`${path}/viewallpostoffice`}
        />
        <Route
          component={ViewAllPostShipOrder}
          exact
          path={`${path}/viewallshiporder`}
        />
        <Route
          component={PostOrderDetail}
          exact
          path={`${path}/shiporderdetail`}
        />
        <Route component={TripInfo} exact path={`${path}/tripinfo`} />
        <Route component={CreateTrip} exact path={`${path}/createtrip`} />
        <Route
          component={PickAndDelivery}
          exact
          path={`${path}/pickanddelivery`}
        />
        <Route
          component={PickAndDeliveryDetail}
          exact
          path={`${path}/pickanddeliverydetail`}
        />
        <Route
          component={ShipAndDelivery}
          exact
          path={`${path}/shipanddelivery`}
        />
        <Route
          component={ShipAndDeliveryDetail}
          exact
          path={`${path}/shipanddeliverydetail`}
        />
        <Route component={ExecuteTrip} exact path={`${path}/executetrip`} />
        <Route
          component={PostDriverExecuteTrip}
          exact
          path={`${path}/view-post-driver-post-trip`}
        />
        <Route
          component={ManagePostman}
          exact
          path={`${path}/manage-postman`}
        />
        <Route
          component={PostDriverDetail}
          exact
          path={`${path}/post-driver-detail/:postDriverId`}
        />
        <Route
          component={PostmanOrderAssignmentDetail}
          exact
          path={`${path}/view-postman-assignment`}
        />
      </Switch>
    </div>
  );
}
