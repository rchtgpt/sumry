import React, { useEffect, useState } from "react";
import Axios from "axios";
import {
  Grid,
  Paper,
  Card,
  CardHeader,
  Typography,
  CardContent,
} from "@material-ui/core";
import { Col, Row, Image } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PolarRadiusAxis,
} from "recharts";
import { navigate } from "@reach/router";
import ListCard from "./ListCard";

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
  const [totalPullsOpened, setTotalPullsOpened] = useState(0);
  const [totalPullsMerged, setTotalPullsMerged] = useState(0);

  const [issuesOpened, setIssuesOpened] = useState([]);
  const [issueComments, setIssueComments] = useState([]);
  const [issueResolved, setIssueResolved] = useState([]);
  const [totalIssuesOpened, setTotalIssuesOpened] = useState(0);
  const [totalIssuesResolved, setTotalIssuesResolved] = useState(0);

  const [commitsCreated, setCommitsCreated] = useState([]);
  const [commitComments, setCommitComments] = useState([]);
  const [totalCommitsCreated, setTotalCommitsCreated] = useState(0);

  const [linkList, setLinkList] = useState([]);

  const lightGray = "#D4E0ED";
  const white = "#FFFFFF";
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const [colors, setColors] = useState([lightGray, white, white, white]);
  const [devColors, setDevColors] = useState([]);
  const [title, setTitle] = useState("Pull Requests");

  const [projectStats, setProjectStats] = useState([]);

  const getOpenPulls = async () => {
    setPullsOpened([]);
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
            id: pull.id,
            title: pull.title,
            link: pull.links.html.href,
          },
        ]);
      });
      Axios.get(
        `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
        {
          auth: {
            username: props.location.state.username,
            password: props.location.state.password,
          },
        }
      ).then((response) => {
        setTotalPullsOpened(
          response.data.values.filter((pull) => pull.status === "OPEN").length
        );
      });
    });
  };

  const getUpdatedPulls = async () => {
    setPullsMerged([]);
    setPullsUpdated([]);
    setPullsComments([]);
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      setTotalPullsMerged(
        response.data.values.filter((pull) => pull.state === "MERGED").length
      );
      // Check each PR manually to check dev's comment
      response.data.values.map((pull) => {
        if (pull.author.uuid === currentUser.id) {
          if (pull.state === "MERGED") {
            setPullsMerged((oldPullsMerged) => [
              ...oldPullsMerged,
              {
                id: pull.id,
                title: pull.title,
                link: pull.links.html.href,
              },
            ]);
          } else {
            if (start >= pull.created_on) {
              setPullsUpdated((oldPullsUpdated) => [
                ...oldPullsUpdated,
                {
                  id: pull.id,
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
    setIssuesOpened([]);
    setIssueComments([]);
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      setTotalIssuesOpened(response.data.values.length);
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
    setIssueResolved([]);
    await Axios.get(
      `https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()}) AND state="resolved"`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      setTotalIssuesResolved(response.data.values.length);
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
    setCommitsCreated([]);
    setCommitComments([]);
    var tempCommitCount = 0;
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
                id: commit.hash.substring(0, 8),
                title: commit.summary.raw,
                link: commit.links.html.href,
              },
            ]);
          }
          if (commit.date >= start.toISOString()) {
            tempCommitCount++;
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
    setTotalCommitsCreated(tempCommitCount);
  };

  const getUsers = async () => {
    const tempUsers = [];
    const tempDevColors = [lightGray];
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
    setCurrentUser(tempUsers[0]);
    for (var i = 0; i < tempUsers.length - 1; i++) {
      tempDevColors.push(white);
    }
    setDevColors(tempDevColors);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    if (props.location.state === null) {
      navigate("/login");
    } else {
      if (users.length === 0) {
        getUsers();
      } else {
        setDevColors([]);
        const tempDevColors = [];
        for (var i = 0; i < users.length; i++) {
          if (users.findIndex((user) => user === currentUser) === i) {
            tempDevColors.push(lightGray);
          } else {
            tempDevColors.push(white);
          }
        }
        setDevColors(tempDevColors);
        getOpenPulls();
        getUpdatedPulls();
        getOpenedIssues();
        getUpdatedIssues();
        getCommitsCreated();
        handlePullClick();
      }
    }
  }, [currentUser]);

  useEffect(() => {
    preparePullLinkList();
  }, [pullsOpened, pullsMerged, pullsUpdated]);

  useEffect(() => {
    setProjectStats([
      {
        subject: "Pulls Opened",
        A: pullsOpened.length,
        fullMark: totalPullsOpened,
      },
      {
        subject: "Pulls Merged",
        A: pullsMerged.length,
        fullMark: totalPullsMerged,
      },
      {
        subject: "Issues Opened",
        A: issuesOpened.length,
        fullMark: totalIssuesOpened,
      },
      {
        subject: "Issues Resolved",
        A: issueResolved.length,
        fullMark: totalIssuesResolved,
      },
      {
        subject: "Commits Created",
        A: commitsCreated.length,
        fullMark: totalCommitsCreated,
      },
    ]);
  }, [
    commitsCreated,
    issueResolved,
    issuesOpened,
    pullsMerged,
    pullsOpened,
    totalCommitsCreated,
    totalIssuesOpened,
    totalIssuesResolved,
    totalPullsMerged,
    totalPullsOpened,
  ]);

  const preparePullLinkList = () => {
    setLinkList([]);
    const tempLinkList = [];
    pullsOpened.forEach((pull) =>
      tempLinkList.push({
        id: pull.id,
        title: pull.title,
        link: pull.link,
        status: "created",
      })
    );
    pullsUpdated.forEach((pull) =>
      tempLinkList.push({
        id: pull.id,
        title: pull.title,
        link: pull.link,
        status: "updated",
      })
    );
    pullsMerged.forEach((pull) =>
      tempLinkList.push({
        id: pull.id,
        title: pull.title,
        link: pull.link,
        status: "merged",
      })
    );
    setLinkList(tempLinkList);
    setData([]);
    setData([
      { name: "Pull Requests Opened", value: pullsOpened.length },
      { name: "Pull Requests Merged", value: pullsMerged.length },
      { name: "Pull Requests Updated", value: pullsUpdated.length },
    ]);
  };

  const prepareIssueLinkList = () => {
    setLinkList([]);
    const tempLinkList = [];
    issuesOpened.forEach((issue) =>
      tempLinkList.push({
        id: issue.id,
        title: issue.title,
        link: issue.link,
        status: "created",
      })
    );
    issueResolved.forEach((issue) =>
      tempLinkList.push({
        id: issue.id,
        title: issue.title,
        link: issue.link,
        status: "resolved",
      })
    );
    setLinkList(tempLinkList);
    setData([]);
    setData([
      { name: "Issues Opened", value: issuesOpened.length },
      { name: "Issues Resolved", value: issueResolved.length },
    ]);
  };

  const prepareCommitLinkList = () => {
    setLinkList([]);
    const tempLinkList = [];
    commitsCreated.forEach((commit) =>
      tempLinkList.push({
        id: commit.id,
        title: commit.title,
        link: commit.link,
        status: "created",
      })
    );
    setLinkList(tempLinkList);
  };

  const handlePullClick = () => {
    if (colors[0] !== lightGray) {
      setColors([lightGray, white, white, white]);
      setTitle("Pull Requests");
      preparePullLinkList();
    }
  };

  const handleIssueClick = () => {
    if (colors[1] !== lightGray) {
      setColors([white, lightGray, white, white]);
      setTitle("Issues");
      prepareIssueLinkList();
    }
  };

  const handleCommitClick = () => {
    if (colors[2] !== lightGray) {
      setColors([white, white, lightGray, white]);
      setTitle("Commits");
      prepareCommitLinkList();
    }
  };

  const handleCommentClick = () => {
    if (colors[3] !== lightGray) {
      setColors([white, white, white, lightGray]);
      setTitle("Comments");
      setLinkList([]);
      setData([]);
      setData([
        { name: "Pull Requests", value: pullsComments.length },
        { name: "Issues", value: issueComments.length },
        { name: "Commits", value: commitComments.length },
      ]);
    }
  };

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
                  style={{
                    height: "30vh",
                    background: colors[0],
                    cursor: "pointer",
                  }}
                  variant="outlined"
                  onClick={handlePullClick}
                >
                  <div className="topStats">
                    <h1>{pullsOpened.length}</h1>
                    <p>Pull Requests Opened</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      className="bi bi-file-earmark-diff"
                      fill="#0052cc"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 1h5v1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6h1v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" />
                      <path d="M9 4.5V1l5 5h-3.5A1.5 1.5 0 0 1 9 4.5z" />
                      <path
                        fillRule="evenodd"
                        d="M5.5 11.5A.5.5 0 0 1 6 11h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zM8 5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4A.5.5 0 0 1 8 5z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M5.5 7.5A.5.5 0 0 1 6 7h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{
                    height: "30vh",
                    background: colors[1],
                    cursor: "pointer",
                  }}
                  variant="outlined"
                  onClick={handleIssueClick}
                >
                  <div className="topStats">
                    <h1>{issuesOpened.length}</h1>
                    <p>Issues Opened</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      className="bi bi-exclamation-circle"
                      fill="#0052cc"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                      />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{
                    height: "30vh",
                    background: colors[2],
                    cursor: "pointer",
                  }}
                  variant="outlined"
                  onClick={handleCommitClick}
                >
                  <div className="topStats">
                    <h1>{commitsCreated.length}</h1>
                    <p>Commits Created</p>
                    <svg
                      width="2em"
                      height="2em"
                      viewBox="0 0 16 16"
                      className="bi bi-code-slash"
                      fill="#0052cc"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0zm-.999-3.124a.5.5 0 0 1 .33.625l-4 13a.5.5 0 0 1-.955-.294l4-13a.5.5 0 0 1 .625-.33z"
                      />
                    </svg>
                  </div>
                </Card>
              </Grid>
              <Grid item sm={3}>
                <Card
                  style={{
                    height: "30vh",
                    background: colors[3],
                    cursor: "pointer",
                  }}
                  variant="outlined"
                  onClick={handleCommentClick}
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
                      className="bi bi-chat-left-text"
                      fill="#0052cc"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 1H2a1 1 0 0 0-1 1v11.586l2-2A2 2 0 0 1 4.414 11H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
                      />
                      <path
                        fillRule="evenodd"
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
                      isAnimationActive={true}
                      data={data}
                      cx={200}
                      cy={200}
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip />
                  </PieChart>
                </Card>
              </Grid>
              <Grid item sm={6}>
                <Card style={{ height: "60vh" }} variant="outlined">
                  <CardHeader title={title} className="cardHeader" />
                  <CardContent>
                    {linkList.length === 0 ? (
                      <Typography variant="h2" className="errorText">
                        Nothing to show :(
                      </Typography>
                    ) : (
                      linkList.map((item) => (
                        <ListCard
                          key={item.id}
                          id={item.id}
                          status={item.status}
                          title={item.title}
                          link={item.link}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item container direction="column" sm={3} spacing={2}>
            <Grid item>
              <Card
                style={{ height: "45vh", background: "#0052CC" }}
                variant="outlined"
              >
                <Col>
                  <CardHeader title="Developers" className="devListHeader" />
                  {users.map((user, index) => (
                    <Card
                      variant="outlined"
                      key={user.id}
                      className="devNames"
                      onClick={() => setCurrentUser(user)}
                      style={{ background: devColors[index] }}
                    >
                      <Typography>{user.name}</Typography>
                    </Card>
                  ))}
                </Col>
              </Card>
            </Grid>
            <Grid item>
              <Card
                style={{ height: "45vh", background: "#fffZ" }}
                variant="outlined"
              >
                <CardHeader title="Project Stats" className="cardHeader" />
                <RadarChart
                  outerRadius={70}
                  width={450}
                  height={300}
                  data={projectStats}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} />
                  <Radar
                    name={currentUser !== undefined ? currentUser.name : "Test"}
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.8}
                  />
                  <Legend />
                </RadarChart>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
