import React from "react";
import MainLayout from "./components/MainLayout";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./components/Login";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>

      <Route exact path="/">
        <MainLayout>
          <h2>HOME PAGE</h2>
        </MainLayout>
      </Route>

      <Route path="/admin/create-user">
        <MainLayout>
          <h2>Create User</h2>
          <h2>Create User</h2>
          <h2>Create User</h2>
        </MainLayout>
      </Route>

      <Route path="/admin/view-users">
        <MainLayout>
          <h2>View Users</h2>
        </MainLayout>
      </Route>

      <Route path="/order/view-orders">
        <MainLayout>
          <h2>View Orders</h2>
        </MainLayout>
      </Route>

      <Route path="/order/create-order">
        <MainLayout>
          <h2>Create Order</h2>
        </MainLayout>
      </Route>

      <Route path="/error">
        <h1>ERROR</h1>
      </Route>

      <Redirect to="/error" />
    </Switch>
  </BrowserRouter>
);

export default App;
