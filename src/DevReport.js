import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Axios from 'axios';

const DevReport = (props) => {
	const start = new Date();
	start.setHours(0, 0, 0, 0);

	var end = new Date();
	end.setHours(23, 59, 59, 999);

	const [ pullsOpened, setPullsOpened ] = useState([]);
	const [ pullsMerged, setPullsMerged ] = useState([]);
	const [ pullsComments, setPullsComments ] = useState([]);
	const [ pullsUpdated, setPullsUpdated ] = useState([]);

	const issuesOpened = [];
	const issueComments = [];
	const issueResolved = [];

	const commitsCreated = [];
	const commitComments = [];

	const getOpenPulls = async () => {
		await Axios.get(
			`https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
			{
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
			}
		).then((response) => {
			const tempPullsOpened = [];
			response.data.values.map((pull) => {
				if (pull.author.uuid === props.location.state.id) {
					tempPullsOpened.push({
						title: pull.title,
						link: pull.links.html.href
					});
				}
			});
			setPullsOpened(tempPullsOpened);
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
			const tempPullsUpdated = [],
				tempPullsMerged = [],
				tempPullsComments = [];
			response.data.values.map((pull) => {
				if (pull.author.uuid === props.location.state.id) {
					if (pull.state === 'MERGED') {
						tempPullsMerged.push({
							title: pull.title,
							link: pull.links.html.href
						});
					} else {
						if (start >= pull.created_on) {
							tempPullsUpdated.push({
								title: pull.title,
								link: pull.links.html.href
							});
						}
					}
				} else {
					// Check PR if he has commented on it
					Axios.get('url-to-be-placed', {
						auth: {
							username: props.location.state.username,
							password: props.location.state.password
						}
					}).then((response) => {
						console.log(response.data);
					});
				}
			});
			setPullsUpdated(tempPullsUpdated);
			setPullsMerged(tempPullsMerged);
			setPullsComments(tempPullsComments);
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
		</Container>
	);
};

export default DevReport;
