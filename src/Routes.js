import { LinearProgress } from "@material-ui/core";
import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./common/PrivateRoute";
import SignInContainer from "./container/SignInContainer";
import { Layout } from "./layout";
import MainAppRoute from "./routers/MainAppRoutes";

const Register = lazy(() => import("../src/views/UserRegister/Register"));
const ForgetPassword = lazy(() =>
  import("../src/views/UserRegister/ForgetPassword")
);

// const MainAppRoute = lazy(() => import("./routers/MainAppRoutes"));
const ChangePassword = lazy(() =>
  import("./component/userlogin/changepassword")
);

function Routes(props) {
  //const isError = useSelector((state) => state.error.isError);
  //if (isError) return <Route component={Error500} path="*" />;
  return (
    <Suspense
      fallback={
        <LinearProgress
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            zIndex: 1202,
          }}
        />
      }
    >
      <Switch>
        <Route component={Register} layout={Layout} path="/user/register" />
        <Route
          component={ForgetPassword}
          layout={Layout}
          path="/user/forgetpassword"
        />
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
