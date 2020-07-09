import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Grid,
  Paper,
} from "@material-ui/core";

const Dashboard = (props) => {
  const [users, setUsers] = useState([]);

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const [, setPullsOpened] = useState([]);
  const [, setPullsMerged] = useState([]);
  const [, setPullsComments] = useState([]);
  const [, setPullsUpdated] = useState([]);

  const [, setIssuesOpened] = useState([]);
  const [, setIssueComments] = useState([]);
  const [, setIssueResolved] = useState([]);

  const [, setCommitsCreated] = useState([]);
  const [, setCommitComments] = useState([]);
  const [] = useState([]);

  const getOpenPulls = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/pullrequests/${
        users[0].id
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
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      // Check each PR manually to check dev's comment
      response.data.values.map((pull) => {
        if (pull.author.uuid === users[0].id) {
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
            `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests/${pull.id}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (
                users[0].id === comment.user.uuid &&
                start.toISOString() <= comment.created_on
              ) {
                setPullsComments((oldPullsComments) => [
                  ...oldPullsComments,
                  {
                    pull_title: comment.pullrequest.title,
                    pull_link: comment.pullrequest.links.html.href,
                    comment: comment.content.raw,
                    pull_id: comment.pullrequest.id,
                    id: comment.id,
                  },
                ]);
              }
            });
          });
        }
      });
    });
  };

  const getOpenedIssues = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      response.data.values.map((issue) => {
        if (users[0].id === issue.reporter.uuid) {
          setIssuesOpened((oldIssuesOpened) => [
            ...oldIssuesOpened,
            {
              id: issue.id,
              title: issue.title,
              link: issue.links.html.href,
              type: issue.kind,
            },
          ]);
        } else {
          Axios.get(
            `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues/${issue.id}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (
                comment.user.uuid === users[0].id &&
                start.toISOString() <= comment.created_on
              ) {
                setIssueComments((oldIssueComments) => [
                  ...oldIssueComments,
                  {
                    issue_title: comment.issue.title,
                    comment: comment.content.raw,
                    issue_id: comment.issue.id,
                    id: comment.id,
                  },
                ]);
              }
            });
          });
        }
      });
    });
  };

  const getUpdatedIssues = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()}) AND state="resolved"`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      response.data.values.map((issue) => {
        if (issue.reporter.uuid === users[0].id) {
          setIssueResolved((oldIssueResolved) => [
            ...oldIssueResolved,
            {
              id: issue.id,
              title: issue.title,
              link: issue.links.html.href,
              type: issue.kind,
            },
          ]);
        }
      });
    });
  };

  const getCommitsCreated = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/commits`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      response.data.values.map((commit) => {
        if (
          commit.date >= start.toISOString() &&
          commit.author.user.uuid === users[0].id
        ) {
          setCommitsCreated((oldCommitsCreated) => [
            ...oldCommitsCreated,
            {
              title: commit.summary.raw,
              link: commit.links.html.href,
            },
          ]);
          /**      Axios.get(
            `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/commit/${commit.hash}/statuses/build`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            console.log(response.data);
          }); */
        }
        if (
          commit.author.user !== undefined &&
          commit.author.user.uuid !== users[0].id
        ) {
          Axios.get(
            `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/commit/${commit.hash}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (
                comment.user.uuid === users[0].id &&
                comment.created_on >= start.toISOString()
              ) {
                setCommitComments((oldCommitComments) => [
                  ...oldCommitComments,
                  {
                    link: comment.links.html.href,
                    comment: comment.content.raw,
                    id: comment.id,
                  },
                ]);
              }
            });
          });
        }
      });
    });
  };

  const getUsers = async () => {
    await Axios.get(
      "https://api.bitbucket.org/2.0/workspaces/codetest0/members",
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        response.data.values.map((u) => {
          setUsers((oldUsers) => [
            ...oldUsers,
            {
              id: u.user.uuid,
              img_link: u.user.links.avatar.href,
              name: u.user.nickname,
            },
          ]);
        });
      }
    });

    getOpenPulls();
    getUpdatedPulls();
    getOpenedIssues();
    getUpdatedIssues();
    getCommitsCreated();
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Grid container spacing={2} justify="center">
        <Grid container item direction="column" spacing={2} sm={9}>
          <Grid container item direction="row" spacing={2}>
            <Grid item sm={3}>
              <Paper style={{ height: "30vh", background: "red" }} />
            </Grid>
            <Grid item sm={3}>
              <Paper style={{ height: "30vh", background: "red" }} />
            </Grid>
            <Grid item sm={3}>
              <Paper style={{ height: "30vh", background: "red" }} />
            </Grid>
            <Grid item sm={3}>
              <Paper style={{ height: "30vh", background: "red" }} />
            </Grid>
          </Grid>

          <Grid container item direction="row" spacing={2}>
            <Grid item sm={6}>
              <Paper style={{ height: "60vh", background: "purple" }} />
            </Grid>
            <Grid item sm={6}>
              <Paper style={{ height: "60vh", background: "purple" }} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item container direction="column" sm={3} spacing={2}>
          <Grid item>
            <Paper style={{ height: "45vh", background: "orange" }} />
          </Grid>
          <Grid item>
            <Paper style={{ height: "45vh", background: "green" }} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
