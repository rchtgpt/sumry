import React from "react";
import ReactDOM from "react-dom";
import AuthForm from "./AuthForm";
import Dashboard from "./Dashboard";
import About from "./About";
import { Router } from "@reach/router";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <React.StrictMode>
      <Router>
        <AuthForm path="/login" />
        <Dashboard path="/dashboard" />
        <About path="/about" />
      </Router>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
