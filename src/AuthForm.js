import React from "react";
import { Form, Button } from "react-bootstrap";
import Axios from "axios";

const AuthForm = () => {
  return (
    <Form
      onSubmit={({ value }) => {
        event.preventDefault();
        Axios.post("some-url", value).then((response) => {
          // If response is good then route to next page (add Reach Router)
          // If response is error, then show a snackbar saying that either username or password is incorrect.
        });
      }}
    >
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control placeholder="Enter username" />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      <Form.Group controlId="formRememberMe">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default AuthForm;
