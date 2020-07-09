import React from "react";
import ReactDOM from "react-dom";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import About from "./About";
import DevReport from "./DevReport";
import { Router } from "@reach/router";
import {
  AppBar,
  Button,
  Typography,
  Toolbar,
  classes,
  IconButton,
  MenuIcon,
} from "@material-ui/core";

const App = () => {
  return (
    <React.StrictMode>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" href="/about">
            Sumry
          </Button>
          <Button color="inherit" href="/about">
            About Us
          </Button>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Router>
        <AuthForm path="/login" />
        <Dashboard path="/dashboard" />
        <About path="/about" />
        <DevReport path="/report/:id" />
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
