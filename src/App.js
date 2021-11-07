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

console.log(
  "%c\n\n \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2557  \u2588\u2588\u2557\u2003\u2003\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557\n\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551\u2003\u2003\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\n\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2554\u2588\u2588\u2557\u2588\u2588\u2551\u2003\u2003\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\n\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u255D \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2551\u2003\u2003\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u255D\n\u255A\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2551\u2003\u2003\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551\n \u255A\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D     \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u2550\u255D\u2003\u2003\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D\n\n",
  "font-family:monospace;color:#1976d2;font-size:12px;"
);

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {/* <Router> */}
        <Router history={history}>
          <Routes />
          <ToastContainer
            position="bottom-center"
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
