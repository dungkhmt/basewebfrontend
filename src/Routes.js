import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import Register from "../src/views/UserRegister/Register";
import PrivateRoute from "./common/PrivateRoute";
import ChangePassword from "./component/userlogin/changepassword";
import SignInContainer from "./container/SignInContainer";
import { Layout } from "./layout";
import MainAppRoute from "./routers/MainAppRoutes";
import BouncingBallsLoader from "./views/common/BouncingBallsLoader";

function Routes(props) {
  //const isError = useSelector((state) => state.error.isError);
  //if (isError) return <Route component={Error500} path="*" />;
  return (
    <Suspense fallback={<BouncingBallsLoader />}>
      <Switch>
        <Route component={Register} layout={Layout} path="/user/register" />
        <PrivateRoute
          component={ChangePassword}
          path="/userlogin/change-password/:username"
        />
        <Route component={SignInContainer} path="/login" />
        <Route component={MainAppRoute} path="*" />
      </Switch>
    </Suspense>
  );
}

export default Routes;
