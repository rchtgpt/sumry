import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "axios";

const DevReport = (props) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const pullsOpened = [];
  const pullsMerged = [];
  const pullsComments = [];
  const pullsUpdated = [];

  const issuesOpened = [];
  const issueComments = [];
  const issueResolved = [];

  const commitsCreated = [];
  const commitComments = [];


  useEffect(() => {
    Axios.get(
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: "hmg65",
          password: "code@123",
        },
      }
    ).then((response) => {
      // Get PRs which are created by the dev today
      response.data.values.map((pull) => {
        console.log(pull);
      });
    });

    Axios.get(
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
      {
        auth: {
          username: "hmg65",
          password: "code@123",
        },
      }
    ).then((response) => {
      // Check each PR manually to check dev's comment
      response.data.values.map((pull) => {
        console.log(pull);
      });
    });
  });

  return (
    <Container>
      <h1>This is dev Name</h1>
    </Container>
  );
};

export default DevReport;
