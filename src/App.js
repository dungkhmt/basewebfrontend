import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes isAuthenticated={this.props.isAuthenticated} />
      </Router>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = dispatch => ({});
export default connect(mapStateToProps, mapDispatchToProps)(App);
