import { CssBaseline } from "@material-ui/core";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import React, { Component } from "react";
import { Router } from "react-router-dom";
// import { BrowserRouter as Router } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import history from "./history.js";
import Routes from "./Routes";

const theme = createMuiTheme({
  typography: {
    fontFamily: `-apple-system, "Segoe UI", BlinkMacSystemFont, "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif`,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        // "*, *::before, *::after": {
        //   boxSizing: "content-box",
        // },
        // body: {
        //   height: "100%",
        //   backgroundColor: "#fff",
        // },
      },
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Router> */}
        <Router history={history}>
          <Routes />
          <ToastContainer
            position="bottom-left"
            transition={Slide}
            autoClose={3000}
            limit={3}
            hideProgressBar={true}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
        {/* </Router> */}
      </MuiThemeProvider>
    );
  }
}

export default App;
