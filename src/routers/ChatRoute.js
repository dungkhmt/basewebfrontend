import React from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import ChatMessengerMain from "../component/chat/ChatMessengerMain";
import ChatVoiceMain from "../component/chat/ChatVoiceMain/";
import Room from "../component/chat/ChatVoiceMain/room";
export default function ChatRoute() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route
          component={ChatMessengerMain}
          exact
          path={`${path}/messenger/main`}
        ></Route>
        <Route
          component={ChatVoiceMain}
          exact
          path={`${path}/voice/main`}
        ></Route>
        <Route
          component={Room}
          exact
          path={`${path}/voice/main/:id`}
        ></Route>
      </Switch>
    </div>
  );
}
