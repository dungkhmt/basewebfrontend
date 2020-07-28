import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Routes from "./Routes";

class App extends Component {
  render() {
    return (
      <Router>
        <Routes />
        <ToastContainer
          position="bottom-left"
          transition={Slide}
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    );
  }
}

export default App;
