import React, { useEffect, useState } from 'react';
import { Container, Card, Col, Image, CardColumns, Row } from 'react-bootstrap';
import Axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const DevReport = (props) => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);

	var end = new Date();
	end.setHours(23, 59, 59, 999);

	const [ pullsOpened, setPullsOpened ] = useState([]);
	const [ pullsMerged, setPullsMerged ] = useState([]);
	const [ pullsComments, setPullsComments ] = useState([]);
	const [ pullsUpdated, setPullsUpdated ] = useState([]);

	const [ issuesOpened, setIssuesOpened ] = useState([]);
	const [ issueComments, setIssueComments ] = useState([]);
	const [ issueResolved, setIssueResolved ] = useState([]);

	const [ commitsCreated, setCommitsCreated ] = useState([]);
	const [ commitComments, setCommitComments ] = useState([]);
	const [ commitBuildStatus, setCommitBuildStatus ] = useState([]);

	const getOpenPulls = async () => {
		await Axios.get(
			`https://api.bitbucket.org/2.0/pullrequests/${props.location.state
				.id}?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
			{
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
			}
		).then((response) => {
			// Get PRs which are created by the dev today
			response.data.values.map((pull) => {
				setPullsOpened((oldPullsOpened) => [
					...oldPullsOpened,
					{
						title: pull.title,
						link: pull.links.html.href
					}
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
              if (
                props.location.state.id === comment.user.uuid &&
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
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/issues?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      response.data.values.map((issue) => {
        if (props.location.state.id === issue.reporter.uuid) {
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
            `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/issues/${issue.id}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (
                comment.user.uuid === props.location.state.id &&
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
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/issues?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()}) AND state="resolved"`,
      {
        auth: {
          username: props.location.state.username,
          password: props.location.state.password,
        },
      }
    ).then((response) => {
      response.data.values.map((issue) => {
        if (issue.reporter.uuid === props.location.state.id) {
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
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/commits`,
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
          commit.author.user.uuid === props.location.state.id
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
          commit.author.user.uuid !== props.location.state.id
        ) {
          Axios.get(
            `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/commit/${commit.hash}/comments`,
            {
              auth: {
                username: props.location.state.username,
                password: props.location.state.password,
              },
            }
          ).then((response) => {
            response.data.values.map((comment) => {
              if (
                comment.user.uuid === props.location.state.id &&
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

  useEffect(() => {
    getOpenPulls();
    getUpdatedPulls();
    getOpenedIssues();
    getUpdatedIssues();
    getCommitsCreated();
  }, []);

  return (
    <Container>
      <h1>This is dev Name</h1>
      <h3>Open PR Count: {pullsOpened.length}</h3>
      <h3>Updated PR Count: {pullsUpdated.length}</h3>
      <h3>Merged PR Count: {pullsMerged.length}</h3>
      <h3>PR Comment Count: {pullsComments.length}</h3>
      <h3>Open Issue Count: {issuesOpened.length}</h3>
      <h3>Issue Comment Count: {issueComments.length}</h3>
      <h3>Resolved Issue Count: {issueResolved.length}</h3>
      <h3>Commit Created Count: {commitsCreated.length}</h3>
      <h3>Commit Comment Count: {commitComments.length}</h3>
    </Container>
  );
};

export default DevReport;
