import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  Typography,
  CardMedia,
} from "@material-ui/core";
import { Col, Row, Image } from "react-bootstrap";
import { PieChart, Pie, Tooltip } from "recharts";

const Dashboard = (props) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const [pullsOpened, setPullsOpened] = useState([]);
  const [pullsMerged, setPullsMerged] = useState([]);
  const [pullsComments, setPullsComments] = useState([]);
  const [pullsUpdated, setPullsUpdated] = useState([]);

  const [issuesOpened, setIssuesOpened] = useState([]);
  const [issueComments, setIssueComments] = useState([]);
  const [issueResolved, setIssueResolved] = useState([]);

  const [commitsCreated, setCommitsCreated] = useState([]);
  const [commitComments, setCommitComments] = useState([]);

  const getOpenPulls = async () => {
    await Axios.get(
      `https://api.bitbucket.org/2.0/pullrequests/${
        currentUser.id
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
        if (pull.author.uuid === currentUser.id) {
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
                currentUser.id === comment.user.uuid &&
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
        if (currentUser.id === issue.reporter.uuid) {
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
                comment.user.uuid === currentUser.id &&
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
        if (issue.reporter.uuid === currentUser.id) {
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
        if (commit.author.user !== undefined) {
          if (
            commit.date >= start.toISOString() &&
            commit.author.user.uuid === currentUser.id
          ) {
            setCommitsCreated((oldCommitsCreated) => [
              ...oldCommitsCreated,
              {
                title: commit.summary.raw,
                link: commit.links.html.href,
              },
            ]);
          }
          if (commit.author.user.uuid !== currentUser.id) {
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
                  comment.user.uuid === currentUser.id &&
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
        }
      });
    });
  };

  const getUsers = async () => {
    const tempUsers = [];
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
          tempUsers.push({
            id: u.user.uuid,
            img_link: u.user.links.avatar.href,
            name: u.user.nickname,
          });
        });
      }
    });
    setUsers(tempUsers);
    setCurrentUser(tempUsers[1]);
  };

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
    { name: "Group E", value: 278 },
    { name: "Group F", value: 189 },
  ];

  useEffect(() => {
    console.log(users);
    if (users.length === 0) {
      getUsers();
    } else {
      getOpenPulls();
      getUpdatedPulls();
      getOpenedIssues();
      getUpdatedIssues();
      getCommitsCreated();
    }
  }, [currentUser]);

  return (
    <div>
      <Row>
        <Col>
          <h1 className="reportOverview">Report Overview</h1>
        </Col>
        {currentUser !== undefined ? (
          <Image
            className="avatar"
            src={currentUser.img_link}
            roundedCircle
            height="70"
            width="70"
          />
        ) : null}
      </Row>
      <div className="dashLayout">
        <Grid container spacing={2} justify="center">
          <Grid container item direction="column" spacing={2} sm={9}>
            <Grid container item direction="row" spacing={2}>
              <Grid item sm={3}>
                <Card
                  style={{ height: "30vh", background: "#FFFFFF" }}
                  variant="outlined"
                >
                  <div className="topStats">
                    <h1>{pullsOpened.length}</h1>
                    <p>Pull Requests Opened</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      class="bi bi-box-arrow-in-up"
                      fill="#2E3B55"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.646 7.854a.5.5 0 0 0 .708 0L8 5.207l2.646 2.647a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 0 .708z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M8 15a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-1 0v9a.5.5 0 0 0 .5.5z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 13 12h-1.5a.5.5 0 0 1 0-1H13a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 1 0 1H3a1.5 1.5 0 0 1-1.5-1.5v-8z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{ height: "30vh", background: "#FFFFFF" }}
                  variant="outlined"
                >
                  <div className="topStats">
                    <h1>{issuesOpened.length}</h1>
                    <p>Issues Opened</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      class="bi bi-box-arrow-in-down"
                      fill="#2E3B55"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.646 8.146a.5.5 0 0 1 .708 0L8 10.793l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M8 1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0v-9A.5.5 0 0 1 8 1z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M1.5 13.5A1.5 1.5 0 0 0 3 15h10a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 13 4h-1.5a.5.5 0 0 0 0 1H13a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-8A.5.5 0 0 1 3 5h1.5a.5.5 0 0 0 0-1H3a1.5 1.5 0 0 0-1.5 1.5v8z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{ height: "30vh", background: "#FFFFFF" }}
                  variant="outlined"
                >
                  <div className="topStats">
                    <h1>{commitsCreated.length}</h1>
                    <p>Commits Created</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      class="bi bi-code-slash"
                      fill="#2E3B55"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0zm-.999-3.124a.5.5 0 0 1 .33.625l-4 13a.5.5 0 0 1-.955-.294l4-13a.5.5 0 0 1 .625-.33z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{ height: "30vh", background: "#FFFFFF" }}
                  variant="outlined"
                >
                  <div className="topStats">
                    <h1>
                      {pullsComments.length +
                        issueComments.length +
                        commitComments.length}
                    </h1>
                    <p>Comments</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      class="bi bi-chat-left-text"
                      fill="#2E3B55"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                      />
                      <path
                        fill-rule="evenodd"
                        d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item sm={6}>
                <Card
                  style={{ height: "60vh", background: "#fff" }}
                  variant="outlined"
                >
                  <PieChart width={400} height={400}>
                    <Pie
                      dataKey="value"
                      isAnimationActive={false}
                      data={data}
                      cx={200}
                      cy={200}
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </Card>
              </Grid>
              <Grid item sm={6}>
                <Paper style={{ height: "60vh", background: "purple" }} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item container direction="column" sm={3} spacing={2}>
            <Grid item>
              <Card
                style={{ height: "45vh", background: "orange" }}
                variant="outlined"
              >
                <Col>
                  <CardHeader
                    title="Developers"
                    subheader="September 14, 2016"
                  />
                  {users.map((user) => (
                    <Card variant="outlined" key={user.id} className="devNames">
                      <Typography>{user.name}</Typography>
                    </Card>
                  ))}
                </Col>
              </Card>
            </Grid>
            <Grid item>
              <Paper style={{ height: "45vh", background: "green" }} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
