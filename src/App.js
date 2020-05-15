import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";
import { SnackbarProvider } from "notistack";

class App extends Component {
  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Routes isAuthenticated={this.props.isAuthenticated} />
        </Router>
      </SnackbarProvider>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(App);
