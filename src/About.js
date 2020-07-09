import React from "react";
import { Container, Card, Col, Row } from "react-bootstrap";
import ReactPlayer from "react-player";

const About = () => {
  return (
    <Container fluid="md">
      <Card style={{}} className="aboutCard">
        <Col className="yt-video">
          <ReactPlayer url="https://www.youtube.com/watch?v=6KMGhUo36As&feature=youtu.be" />
        </Col>
        <Col>
          <Card.Body>
            <Card.Title>Sumry</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              your project manager, for you.
            </Card.Subtitle>
            <Card.Text>
              Lorem ipsum dolor sit amet, facer invidunt vix cu, ea constituto
              reprehendunt eos. Ceteros posidonium an quo, qui ut odio ferri. Ne
              congue bonorum mei, dicit constituam consequuntur qui ad, ei sint
              oportere per. Quem menandri eam ei, sit at graeci luptatum
              pertinax. Enim doctus aperiri et pri. Ex nostrud vivendo fabellas
              est, ea dicant nostrud similique cum. Per vidit putent cu, his cu
              moderatius vituperatoribus, his ea ignota dictas. Mea ea noster
              sapientem. Animal accumsan pri ut, veri tritani cu eos. Ea hinc
              referrentur pro. Ut sint neglegentur has, cum minim dicam
              deseruisse te. Mel eu soluta nemore, eligendi epicurei in cum. Nec
              detraxit conceptam intellegam cu, vim inciderint deterruisset id.
              In pro aperiri recusabo, sea id nibh labore placerat. Sit eu
              recteque elaboraret. An illud quaestio vel, cu labores interesset
              eum, legere malorum ad nec. Dicta possit vix an, at modus graeco
              vituper
            </Card.Text>
            <Card.Title>Our team</Card.Title>
            <Row>
              <Card style={{ width: "18rem" }} className="teamCard">
                <Card.Body>
                  <Card.Title>Chirag Gupta</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Backend Developer
                  </Card.Subtitle>
                  <Card.Link href="#">LinkedIn</Card.Link>
                  <Card.Link href="#">Github</Card.Link>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="teamCard">
                <Card.Body>
                  <Card.Title>Rachit Gupta</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Frontend Developer
                  </Card.Subtitle>
                  <Card.Link href="#">LinkedIn</Card.Link>
                  <Card.Link href="#">Github</Card.Link>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="teamCard">
                <Card.Body>
                  <Card.Title>Laxya Pahuja</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Frontend Developer
                  </Card.Subtitle>
                  <Card.Link href="#">LinkedIn</Card.Link>
                  <Card.Link href="#">Github</Card.Link>
                </Card.Body>
              </Card>
              <Card style={{ width: "18rem" }} className="teamCard">
                <Card.Body>
                  <Card.Title>Hemant Gupta</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Backend Developer
                  </Card.Subtitle>
                  <Card.Link href="#">LinkedIn</Card.Link>
                  <Card.Link href="#">Github</Card.Link>
                </Card.Body>
              </Card>
            </Row>
          </Card.Body>
        </Col>
      </Card>
    </Container>
  );
};

export default About;
