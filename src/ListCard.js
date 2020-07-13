import React from "react";
import { Card, Typography, Grid } from "@material-ui/core";
import { Row } from "react-bootstrap";

const ListCard = ({ id, title, status, link }) => {
  var colors = new Map([
    ["created", "#00875A"],
    ["merged", "#5243AA"],
    ["resolved", "#5243AA"],
    ["updated", "#FFDA5B"],
  ]);

  return (
    <a href={link} target="_blank" rel="noreferrer">
      <Card className="listCard" variant="outlined">
        <Row id="listCardSubCard">
          <Grid item xs={1}>
            <Card
              id="statusCard"
              style={{ backgroundColor: colors.get(status) }}
            />
          </Grid>
          {id.length > 3 ? (
            <Grid item xs={1}>
            <Typography variant="body1" id="commit-sha">{id}</Typography>
          </Grid>
          ) : (
            <Grid item xs={1}>
              <Typography variant="body1">{id}</Typography>
            </Grid>
          )}
          <Grid>
            <Card id="statusCardDivision" />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" id="titleCard">
              {title}
            </Typography>
          </Grid>
        </Row>
      </Card>
    </a>
  );
};

export default ListCard;
