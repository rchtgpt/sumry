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
					password: props.location.state.password
				}
			}
		).then((response) => {
			// Check each PR manually to check dev's comment
			response.data.values.map((pull) => {
				if (pull.author.uuid === props.location.state.id) {
					if (pull.state === 'MERGED') {
						setPullsMerged((oldPullsMerged) => [
							...oldPullsMerged,
							{
								title: pull.title,
								link: pull.links.html.href
							}
						]);
					} else {
						if (start >= pull.created_on) {
							setPullsUpdated((oldPullsUpdated) => [
								...oldPullsUpdated,
								{
									title: pull.title,
									link: pull.links.html.href
								}
							]);
						}
					}
				} else {
					Axios.get(
						`https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests/${pull.id}/comments`,
						{
							auth: {
								username: props.location.state.username,
								password: props.location.state.password
							}
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
										pull_id: comment.pullrequest.id
									}
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
					password: props.location.state.password
				}
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
							type: issue.kind
						}
					]);
				} else {
					Axios.get(
						`https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/issues/${issue.id}/comments`,
						{
							auth: {
								username: props.location.state.username,
								password: props.location.state.password
							}
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
										issue_id: comment.issue.id
									}
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
					password: props.location.state.password
				}
			}
		).then((response) => {
			response.data.values.map((issue) => {
				setIssueResolved((oldIssueResolved) => [
					...oldIssueResolved,
					{
						id: issue.id,
						title: issue.title,
						link: issue.links.html.href,
						type: issue.kind
					}
				]);
			});
		});
	};

	const data = [
		{ name: 'Group A', value: 400 },
		{ name: 'Group B', value: 300 },
		{ name: 'Group C', value: 300 },
		{ name: 'Group D', value: 200 }
	];

	const COLORS = [ '#0088FE', '#00C49F', '#FFBB28', '#FF8042' ];

	const RADIAN = Math.PI / 180;
	const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	useEffect(() => {
		getOpenPulls();
		getUpdatedPulls();
		getOpenedIssues();
		getUpdatedIssues();
	}, []);

	return (
		<Container>
			<Card border="light" body>
				<Row>
					<Col>
						<h1>Rachit Gupta</h1>{' '}
					</Col>
					<div className="userImageReport">
						<Col>
							<Image
								width="100"
								className="pullRight"
								src="https://i0.wp.com/avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/CG-0.png?ssl=1"
								roundedCircle
							/>
						</Col>
					</div>
				</Row>
			</Card>
			<Card body>
				<Row>
					<Col>
						<Card>
							<h1>New PRs: {pullsOpened.length}</h1>
						</Card>
					</Col>
					<Col>
						<Card>
							<h1>New Issues: {issuesOpened.length}</h1>
						</Card>
					</Col>
					<Col>
						<Card>
							<h1>New Commits: {issuesOpened.length}</h1>
						</Card>
					</Col>
					<Col>
						<Card>
							<h1>Total Comments: {issuesOpened.length}</h1>
						</Card>
					</Col>
				</Row>
			</Card>
			<Card body>
				<Row>
					<Col>
						<Card>
							<PieChart width={400} height={400}>
								<Pie
									data={data}
									cx={200}
									cy={200}
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</Card>
					</Col>
					<Col>
						<Card>
							<PieChart width={400} height={400}>
								<Pie
									data={data}
									cx={200}
									cy={200}
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</Card>
					</Col>
				</Row>
			</Card>
			<CardColumns>
				<Card>
					<Card.Body>
						<Card.Title>Issues Created</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Issues</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Pull Requests</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Commits</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />{' '}
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />{' '}
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
				<Card>
					<Card.Body>
						<Card.Title>Card title</Card.Title>
						<Card.Text>
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />
							• https://bitbucket.org/ <br />{' '}
						</Card.Text>
					</Card.Body>
					<Card.Footer>
						<small className="text-muted">Comments</small>
					</Card.Footer>
				</Card>
			</CardColumns>

			<h1>This is dev Name</h1>
			<h3>Open PR Count: {pullsOpened.length}</h3>
			<h3>Updated PR Count: {pullsUpdated.length}</h3>
			<h3>Merged PR Count: {pullsMerged.length}</h3>
			<h3>PR Comment Count: {pullsComments.length}</h3>
			<h3>Open Issue Count: {issuesOpened.length}</h3>
			<h3>Issue Comment Count: {issueComments.length}</h3>
			<h3>Resolved Issue Count: {issueResolved.length}</h3>
		</Container>
	);
};

export default DevReport;
