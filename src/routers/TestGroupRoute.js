import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import NumberFormatTextField from "../utils/NumberFormatTextField";

export default function TestGroupRoute() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={NumberFormatTextField}
          path={`${path}/number-format-text-field-test`}
        />
      </Switch>
    </div>
  );
}
