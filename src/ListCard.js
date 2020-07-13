import React from 'react';
import { Card, Typography, Grid } from '@material-ui/core';
import { Row } from 'react-bootstrap';

const ListCard = ({ id, title, status, link }) => {
	return (
		<Card href={link} className="listCard" variant="outlined">
			<Row id="listCardSubCard">
				<Grid item xs={1}>
					<Card id="statusCard" />
				</Grid>
				<Grid item xs={1}>
					<Typography variant="h6">{id}</Typography>
				</Grid>
				<Grid>
					<Card id="statusCardDivision" />
				</Grid>
				<Grid item xs={7}>
					<Typography variant="h6" id="titleCard">
						afihioghewo;gjipeqhguifhuigghqeuihvgiuqehivdiuhv9uqhgvqeougvouqehvgildhifvbqbvub
					</Typography>
				</Grid>
			</Row>
		</Card>
	);
};

export default ListCard;
