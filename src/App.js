import React from "react";
import ReactDOM from "react-dom";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import About from "./About";
import DevReport from "./DevReport";
import { Router } from "@reach/router";
import { AppBar, Button, Typography } from "@material-ui/core";

const App = () => {
  return (
    <React.StrictMode>
      <AppBar position="static">
		  <Typography variant="h6">
			Sumry
		  </Typography>
        <Button color="inherit">Login</Button>
      </AppBar>
      <Router>
        <AuthForm path="/" />
        <Dashboard path="/dashboard" />
        <About path="/about" />
        <DevReport path="/report/:id" />
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
