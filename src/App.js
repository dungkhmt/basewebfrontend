import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignIn from "./component/SignIn";
import PrivateRoute from "./common/PrivateRoute";
import SigninContainer from "./container/SigninContainer";
import HomeContainer from "./container/HomeContainer";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <PrivateRoute
            component={HomeContainer}
            isAuthenticated={this.props.isAuthenticated}
            exact
            path={process.env.PUBLIC_URL + "/"}
          />
          <Route
            path={process.env.PUBLIC_URL + "/login"}
            render={props => <SigninContainer {...props} />}
          />
        </div>
      </Router>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(App);
