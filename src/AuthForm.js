import React, { useState } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import Axios from "axios";
import { navigate } from "@reach/router";

const AuthForm = () => {
  const [loginError, setLoginError] = useState(false);

  return (
    <Container>
      {loginError ? (
        <Alert variant="danger">
          Either username or password is incorrect!
        </Alert>
      ) : null}
      <Form
        onSubmit={(value) => {
          event.preventDefault();
          Axios.get("https://api.bitbucket.org/2.0/repositories/hmg65", {
            auth: {
              username: value.formUsername,
              passowrd: value.formPassword,
            },
          })
            .then((response) => {
              if (response.status == 200) {
                navigate("/dashboard");
              }
            })
            .catch((error) => {
              if (error.response.status == 401) {
                setLoginError(true);
              }
            });
        }}
      >
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder="Enter username" />
        </Form.Group>

        <Form.Group controlId="formPassword">
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
    </Container>
  );
};

export default AuthForm;
