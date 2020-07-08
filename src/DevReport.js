import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Axios from "axios";

const DevReport = (props) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const [pullsOpened, setPullsOpened] = useState([]);
  const [pullsMerged, setPullsMerged] = useState([]);
  const [pullsComments, setPullsComments] = useState([]);
  const [pullsUpdated, setPullsUpdated] = useState([]);

  const issuesOpened = [];
  const issueComments = [];
  const issueResolved = [];

  const commitsCreated = [];
  const commitComments = [];

  const getOpenPulls = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/pullrequests/${
        props.location.state.id
      }?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      // Get PRs which are created by the dev today
      response.data.values.map((pull) => {
        setPullsOpened((oldPullsOpened) => [
          ...oldPullsOpened,
          {
            title: pull.title,
            link: pull.links.html.href,
          },
        ]);
      });
    });
  };

  const getUpdatedPulls = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      // Check each PR manually to check dev's comment
      response.data.values.map((pull) => {
        if (pull.author.uuid === props.location.state.id) {
          if (pull.state === "MERGED") {
            setPullsMerged((oldPullsMerged) => [
              ...oldPullsMerged,
              {
                title: pull.title,
                link: pull.links.html.href,
              },
            ]);
          } else {
            if (start >= pull.created_on) {
              setPullsUpdated((oldPullsUpdated) => [
                ...oldPullsUpdated,
                {
                  title: pull.title,
                  link: pull.links.html.href,
                },
              ]);
            }
          }
        } else {
          Axios.get(
            `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests/${pull.id}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (props.location.state.id === comment.user.uuid) {
                setPullsComments((oldPullsComments) => [
                  ...oldPullsComments,
                  {
                    pull_title: comment.pullrequest.title,
                    pull_link: comment.pullrequest.links.html.href,
                    comment: comment.content.raw,
                    pull_id: comment.pullrequest.id,
                  },
                ]);
              }
            });
          });
        }
      });
    });
  };

  useEffect(() => {
    getOpenPulls();
    getUpdatedPulls();
  }, []);

  return (
    <Container>
      <h1>This is dev Name</h1>
      <h3>Open PR Count: {pullsOpened.length}</h3>
      <h3>Updated PR Count: {pullsUpdated.length}</h3>
      <h3>Merged PR Count: {pullsMerged.length}</h3>
      <h3>PR Comment Count: {pullsComments.length}</h3>
    </Container>
  );
};

export default DevReport;
