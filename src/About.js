import React from 'react';
import { Container, Card, Col, Row, CardColumns } from 'react-bootstrap';
import ReactPlayer from 'react-player';

const About = () => {
	return (
		<Container fluid="md">
			<Card style={{}} classname="mt-5">
				<Col>
					<ReactPlayer url="https://www.youtube.com/watch?v=6KMGhUo36As&feature=youtu.be" />
				</Col>
				<Col>
					<Card.Body>
						<Card.Title>Sumry</Card.Title>
						<Card.Subtitle className="mb-2 text-muted">this is a random tagline</Card.Subtitle>
						<Card.Text>
							Lorem ipsum dolor sit amet, facer invidunt vix cu, ea constituto reprehendunt eos. Ceteros
							posidonium an quo, qui ut odio ferri. Ne congue bonorum mei, dicit constituam consequuntur
							qui ad, ei sint oportere per. Quem menandri eam ei, sit at graeci luptatum pertinax. Enim
							doctus aperiri et pri. Ex nostrud vivendo fabellas est, ea dicant nostrud similique cum. Per
							vidit putent cu, his cu moderatius vituperatoribus, his ea ignota dictas. Mea ea noster
							sapientem. Animal accumsan pri ut, veri tritani cu eos. Ea hinc referrentur pro. Ut sint
							neglegentur has, cum minim dicam deseruisse te. Mel eu soluta nemore, eligendi epicurei in
							cum. Nec detraxit conceptam intellegam cu, vim inciderint deterruisset id. In pro aperiri
							recusabo, sea id nibh labore placerat. Sit eu recteque elaboraret. An illud quaestio vel, cu
							labores interesset eum, legere malorum ad nec. Dicta possit vix an, at modus graeco vituper
						</Card.Text>
						<Card.Title>Our team</Card.Title>
						<Row>
							<CardColumns>
								<Card style={{ width: 200 }}>
									<Card.Body>
										<Card.Img
											src="https://avatars1.githubusercontent.com/u/44428198?v=4"
											variant="top"
											height="150"
											width="150"
										/>
										<Card.Title>Rachit Gupta</Card.Title>
									</Card.Body>
								</Card>
								<Card style={{ width: 200 }}>
									<Card.Body>
										<Card.Img
											src="https://avatars1.githubusercontent.com/u/44428198?v=4"
											variant="top"
											height="150"
											width="150"
										/>
										<Card.Title>Rachit Gupta</Card.Title>
									</Card.Body>
								</Card>
								<Card style={{ width: 200 }}>
									<Card.Body>
										<Card.Img
											src="https://avatars1.githubusercontent.com/u/44428198?v=4"
											variant="top"
											height="150"
											width="150"
										/>
										<Card.Title>Rachit Gupta</Card.Title>
									</Card.Body>
								</Card>
								<Card style={{ width: 200 }}>
									<Card.Body>
										<Card.Img
											src="https://avatars1.githubusercontent.com/u/44428198?v=4"
											variant="top"
											height="150"
											width="150"
										/>
										<Card.Title>Rachit Gupta</Card.Title>
									</Card.Body>
								</Card>
							</CardColumns>
						</Row>
					</Card.Body>
				</Col>
			</Card>
		</Container>
	);
};

export default About;
