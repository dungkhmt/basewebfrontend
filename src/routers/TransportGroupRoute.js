import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ListContainer from "../component/tmscontainer/container/ListContainer";
import CreateRequestTransportContainerEmptyExport from "../component/tmscontainer/requestexportempty/CreateRequestTransportContainerEmptyExport";
import ListRequestTransportContainerEmptyExport from "../component/tmscontainer/requestexportempty/ListRequestTransportContainerEmptyExport";
import CreateRequestTransportFullExport from "../component/tmscontainer/requestexportfull/CreateRequestTransportFullExport";
import ListRequestTransportFullExport from "../component/tmscontainer/requestexportfull/ListRequestTransportFullExport";
import CreateRequestTransportContainerEmpty from "../component/tmscontainer/requestimportempty/CreateRequestTransportContainerEmpty";
import ListRequestTransportContainerEmpty from "../component/tmscontainer/requestimportempty/ListRequestTransportContainerEmpty";
import CreateRequestTransportContainerToWarehouse from "../component/tmscontainer/requestimportfull/CreateRequestTransportContainerToWarehouse";
import ListRequestTransportContainerToWareHouse from "../component/tmscontainer/requestimportfull/ListRequestTransportContainerToWareHouse";

export default function TransportGroupRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ListContainer} path={`${path}/containerfunc/list`} />
        <Route
          component={CreateRequestTransportContainerToWarehouse}
          path={`${path}/create-request-transport-container-to-warehouse`}
        />
        <Route
          component={ListRequestTransportContainerToWareHouse}
          path={`${path}/list-request-transport-container-to-warehouse`}
        />
        <Route
          component={CreateRequestTransportContainerEmpty}
          path={`${path}/create-request-transport-container-empty`}
        />
        <Route
          component={ListRequestTransportContainerEmpty}
          path={`${path}/list-request-transport-container-empty`}
        />
        <Route
          component={CreateRequestTransportContainerEmptyExport}
          path={`${path}/create-request-transport-container-empty-export`}
        />
        <Route
          component={ListRequestTransportContainerEmptyExport}
          path={`${path}/list-request-transport-container-empty-export`}
        />
        <Route
          component={CreateRequestTransportFullExport}
          path={`${path}/create-request-transport-full-export`}
        />
        <Route
          component={ListRequestTransportFullExport}
          path={`${path}/list-request-transport-full-export`}
        />
      </Switch>
    </div>
  );
}
