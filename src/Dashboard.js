import React from "react";
import { Nav, Container } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container>
      <Nav defaultActiveKey="/login" as="ul">
        <Nav.Item as="li">
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>
        <Nav.Item as="li">
          <Nav.Link href="/login">Login</Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default Dashboard;
