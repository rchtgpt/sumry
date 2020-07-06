import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "axios";

const Dashboard = (props) => {
  const users = [];

  useEffect(() => {
    Axios.get("https://api.bitbucket.org/2.0/workspaces/hmg65/members", {
      auth: {
        username: props.location.state.username,
        password: props.location.state.password,
      },
    }).then((response) => {
      if (response.status === 200) {
        response.data.values.map((u) => {
          users.push({
            userid: u.user.uuid,
            img_link: u.user.links.avatar.href,
            name: u.user.nickname,
          });
        });
        console.log(users);
      }
    });
  }, [props.location.state.password, props.location.state.username, users]);

  return <Container></Container>;
};

export default Dashboard;
