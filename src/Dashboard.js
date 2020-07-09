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
                <Card style={{ height: "30vh", background: "#03A9F3" }}>
                  <div className="topStats">
                    <h1>{pullsOpened.length}</h1>
                    <p>Pull Requests Opened</p>
                    <i className="fa fa-code" />
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card style={{ height: "30vh", background: "#03A9F3" }}>
                  <div className="topStats">
                    <h1>{issuesOpened.length}</h1>
                    <p>Issues Opened</p>
                    <i className="fa fa-code" />
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card style={{ height: "30vh", background: "#03A9F3" }}>
                  <div className="topStats">
                    <h1>{commitsCreated.length}</h1>
                    <p>Commits Created</p>
                    <i className="fa fa-code" />
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card style={{ height: "30vh", background: "#03A9F3" }}>
                  <div className="topStats">
                    <h1>
                      {pullsComments.length +
                        issueComments.length +
                        commitComments.length}
                    </h1>
                    <p>Comments</p>
                    <i className="fa fa-code" />
                  </div>
                </Card>
              </Grid>
            </Grid>

            <Grid container item direction="row" spacing={2}>
              <Grid item sm={6}>
                <Card style={{ height: "60vh", background: "purple" }}>
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
              <Card style={{ height: "45vh", background: "orange" }}>
                <Col>
                  <CardHeader
                    title="Developers"
                    subheader="September 14, 2016"
                  />
                  {users.map((user) => (
                    <Card key={user.id} className="devNames">
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
