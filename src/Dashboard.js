import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import {
	Grid,
	Paper,
	Card,
	CardHeader,
	Typography,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination
} from '@material-ui/core';
import { Col, Row, Image } from 'react-bootstrap';
import { PieChart, Pie, Tooltip, RadialBarChart, RadialBar } from 'recharts';

const Dashboard = (props) => {
	const [ users, setUsers ] = useState([]);
	const [ currentUser, setCurrentUser ] = useState();

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

	const lightGray = '#CDD5D1';
	const white = '#FFFFFF';
	const [ colors, setColors ] = useState([ lightGray, white, white, white ]);

	const getOpenPulls = async () => {
		await Axios.get(
			`https://api.bitbucket.org/2.0/pullrequests/${currentUser.id}?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
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
			`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
			{
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
			}
		).then((response) => {
			// Check each PR manually to check dev's comment
			response.data.values.map((pull) => {
				if (pull.author.uuid === currentUser.id) {
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
						`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/pullrequests/${pull.id}/comments`,
						{
							auth: {
								username: props.location.state.username,
								password: props.location.state.password
							}
						}
					).then((response) => {
						response.data.values.map((comment) => {
							if (currentUser.id === comment.user.uuid && start.toISOString() <= comment.created_on) {
								setPullsComments((oldPullsComments) => [
									...oldPullsComments,
									{
										pull_title: comment.pullrequest.title,
										pull_link: comment.pullrequest.links.html.href,
										comment: comment.content.raw,
										pull_id: comment.pullrequest.id,
										id: comment.id
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
			`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
			{
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
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
							type: issue.kind
						}
					]);
				} else {
					Axios.get(
						`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues/${issue.id}/comments`,
						{
							auth: {
								username: props.location.state.username,
								password: props.location.state.password
							}
						}
					).then((response) => {
						response.data.values.map((comment) => {
							if (comment.user.uuid === currentUser.id && start.toISOString() <= comment.created_on) {
								setIssueComments((oldIssueComments) => [
									...oldIssueComments,
									{
										issue_title: comment.issue.title,
										comment: comment.content.raw,
										issue_id: comment.issue.id,
										id: comment.id
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
			`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/issues?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()}) AND state="resolved"`,
			{
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
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
							type: issue.kind
						}
					]);
				}
			});
		});
	};

	const getCommitsCreated = async () => {
		await Axios.get(`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/commits`, {
			auth: {
				username: props.location.state.username,
				password: props.location.state.password
			}
		}).then((response) => {
			response.data.values.map((commit) => {
				if (commit.author.user !== undefined) {
					if (commit.date >= start.toISOString() && commit.author.user.uuid === currentUser.id) {
						setCommitsCreated((oldCommitsCreated) => [
							...oldCommitsCreated,
							{
								title: commit.summary.raw,
								link: commit.links.html.href
							}
						]);
					}
					if (commit.author.user.uuid !== currentUser.id) {
						Axios.get(
							`https://api.bitbucket.org/2.0/repositories/codetest0/codegeist/commit/${commit.hash}/comments`,
							{
								auth: {
									username: props.location.state.username,
									password: props.location.state.password
								}
							}
						).then((response) => {
							response.data.values.map((comment) => {
								if (comment.user.uuid === currentUser.id && comment.created_on >= start.toISOString()) {
									setCommitComments((oldCommitComments) => [
										...oldCommitComments,
										{
											link: comment.links.html.href,
											comment: comment.content.raw,
											id: comment.id
										}
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
		await Axios.get('https://api.bitbucket.org/2.0/workspaces/codetest0/members', {
			auth: {
				username: props.location.state.username,
				password: props.location.state.password
			}
		}).then((response) => {
			if (response.status === 200) {
				response.data.values.map((u) => {
					tempUsers.push({
						id: u.user.uuid,
						img_link: u.user.links.avatar.href,
						name: u.user.nickname
					});
				});
			}
		});
		setUsers(tempUsers);
		setCurrentUser(tempUsers[1]);
	};

	const data = [
		{ name: 'Group A', value: 400 },
		{ name: 'Group B', value: 300 },
		{ name: 'Group C', value: 300 },
		{ name: 'Group D', value: 200 },
		{ name: 'Group E', value: 278 },
		{ name: 'Group F', value: 189 }
	];

	function createData(name, calories, fat, carbs, protein) {
		return { name, calories, fat, carbs, protein };
	}

	const rows = [
		createData(1, 'Fix: Hover over cards', 'Open'),
		createData(2, 'Fix: Hover over cards', 'Open'),
		createData(3, 'Fix: Hover over cards', 'Open'),
		createData(4, 'Fix: Hover over cards', 'Open'),
		createData(5, 'Fix: Hover over cards', 'Open'),
		createData(6, 'Fix: Hover over cards', 'Open'),
		createData(7, 'Fix: Hover over cards', 'Open'),
		createData(8, 'Fix: Hover over cards', 'Open'),
		createData(9, 'Fix: Hover over cards', 'Open'),
		createData(10, 'Fix: Hover over cards', 'Open')
	];

	useEffect(
		() => {
			if (users.length === 0) {
				getUsers();
			} else {
				getOpenPulls();
				getUpdatedPulls();
				getOpenedIssues();
				getUpdatedIssues();
				getCommitsCreated();
			}
		},
		[ currentUser ]
	);

	const handlePullClick = () => {
		if (colors[0] !== lightGray) {
			setColors([ lightGray, white, white, white ]);
		}
	};

	const handleIssueClick = () => {
		if (colors[1] !== lightGray) {
			setColors([ white, lightGray, white, white ]);
		}
	};

	const handleCommitClick = () => {
		if (colors[2] !== lightGray) {
			setColors([ white, white, lightGray, white ]);
		}
	};

	const handleCommentClick = () => {
		if (colors[3] !== lightGray) {
			setColors([ white, white, white, lightGray ]);
		}
	};

	const projectStats = [
		{
			name: '18-24',
			uv: 31.47,
			pv: 2400,
			fill: '#8884d8'
		},
		{
			name: '25-29',
			uv: 26.69,
			pv: 4567,
			fill: '#0052CC'
		}
	];

	return (
		<div>
			<Row>
				<Col>
					<h1 className="reportOverview">Report Overview</h1>
				</Col>
				{currentUser !== undefined ? (
					<Image className="avatar" src={currentUser.img_link} roundedCircle height="70" width="70" />
				) : null}
			</Row>
			<div className="dashLayout">
				<Grid container spacing={2} justify="center">
					<Grid container item direction="column" spacing={2} sm={9}>
						<Grid container item direction="row" spacing={2}>
							<Grid item sm={3}>
								<Card
									style={{
										height: '30vh',
										background: colors[0],
										cursor: 'pointer'
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
										height: '30vh',
										background: colors[1],
										cursor: 'pointer'
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
										height: '30vh',
										background: colors[2],
										cursor: 'pointer'
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
										height: '30vh',
										background: colors[3],
										cursor: 'pointer'
									}}
									variant="outlined"
									onClick={handleCommentClick}
								>
									<div className="topStats">
										<h1>{pullsComments.length + issueComments.length + commitComments.length}</h1>
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
								<Card style={{ height: '60vh', background: '#fff' }} variant="outlined">
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
								<Card style={{ height: '60vh' }} variant="outlined">
									<CardHeader title="Pull Requests" className="cardHeader" />
									<CardContent>
										<TableContainer component={Paper}>
											<Table size="small" aria-label="a dense table">
												<TableHead>
													<TableRow>
														<TableCell className="tableHeader">
															<b>Sr. no.</b>
														</TableCell>
														<TableCell className="tableHeader">
															<b>Title</b>
														</TableCell>
														<TableCell className="tableHeader">
															<b>Status</b>
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{rows.map((row) => (
														<TableRow key={row.name}>
															<TableCell component="th" scope="row">
																{row.name}
															</TableCell>
															<TableCell>{row.calories}</TableCell>
															<TableCell>{row.fat}</TableCell>
															<TableCell>{row.carbs}</TableCell>
															<TableCell>{row.protein}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Grid>

					<Grid item container direction="column" sm={3} spacing={2}>
						<Grid item>
							<Card style={{ height: '45vh', background: '#0052CC' }} variant="outlined">
								<Col>
									<CardHeader title="Developers" className="devListHeader" />
									{users.map((user) => (
										<Card
											variant="outlined"
											key={user.id}
											className="devNames"
											onClick={() => setCurrentUser(user)}
										>
											<Typography>{user.name}</Typography>
										</Card>
									))}
								</Col>
							</Card>
						</Grid>
						<Grid item>
							<Card style={{ height: '45vh', background: '#fffZ' }} variant="outlined">
								<CardHeader title="Project Stats" className="cardHeader" />
								<CardContent>
									<RadialBarChart
										className="projectStatPie"
										width={250}
										height={300}
										cx={150}
										cy={150}
										innerRadius={20}
										outerRadius={140}
										barSize={10}
										data={projectStats}
									>
										<RadialBar
											minAngle={15}
											label={{ position: 'insideStart', fill: '#fff' }}
											background
											clockWise
											dataKey="uv"
										/>
									</RadialBarChart>
									<p id="projectStatText">14/28 Pull Requests</p>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default Dashboard;
