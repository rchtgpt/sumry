import React, { useEffect } from 'react';
import { Card, Col, Row, Container, Button } from 'react-bootstrap';
import Axios from 'axios';

const Dashboard = (props) => {
	const users = [];

	useEffect(
		() => {
			Axios.get('https://api.bitbucket.org/2.0/workspaces/hmg65/members', {
				auth: {
					username: props.location.state.username,
					password: props.location.state.password
				}
			}).then((response) => {
				if (response.status === 200) {
					response.data.values.map((u) => {
						users.push({
							userid: u.user.uuid,
							img_link: u.user.links.avatar.href,
							name: u.user.nickname
						});
					});
					console.log(users);
				}
			});
		},
		[ props.location.state.password, props.location.state.username, users ]
	);

	return (
		<Container>
			<Col>
				<Row md={4}>
					<Col>
						<Card>
							<Card.Body>
								<Card.Img
									variant="top"
									src="https://secure.gravatar.com/avatar/e165b6d5ef6a10ea53218113faf83646?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FRG-4.png"
									round
								/>
								<Card.Title>Rachit Gupta</Card.Title>
								<Button href="https://google.co.in" target="blank">
									Summary
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Img
									variant="top"
									src="https://secure.gravatar.com/avatar/321e8aa99254a96cb5a0ad3d997842c9?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FCG-0.png"
								/>
								<Card.Title>Chiru</Card.Title>
								<Button href="https://google.co.in" target="blank">
									Summary
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Img
									variant="top"
									src="https://secure.gravatar.com/avatar/17705709650009fc191be6011554ef84?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHG-6.png"
								/>
								<Card.Title>Hemant Gupta</Card.Title>
								<Button href="https://google.co.in" target="blank">
									Summary
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Img
									variant="top"
									src="https://secure.gravatar.com/avatar/17705709650009fc191be6011554ef84?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHG-6.png"
								/>
								<Card.Title>Hemant Gupta</Card.Title>
								<Button href="https://google.co.in" target="blank">
									Summary
								</Button>
							</Card.Body>
						</Card>
					</Col>
					<Col>
						<Card>
							<Card.Body>
								<Card.Img
									variant="top"
									src="https://secure.gravatar.com/avatar/17705709650009fc191be6011554ef84?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FHG-6.png"
								/>
								<Card.Title>Hemant Gupta</Card.Title>
								<Button href="https://google.co.in" target="blank">
									Summary
								</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Col>
		</Container>
	);
};

export default Dashboard;
