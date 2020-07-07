import React, { useEffect, useState } from "react";
import { Card, Container, CardColumns } from "react-bootstrap";
import Axios from "axios";

const Dashboard = (props) => {
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    await Axios.get("https://api.bitbucket.org/2.0/workspaces/hmg65/members", {
      auth: {
        username: props.location.state.username,
        password: props.location.state.password,
      },
    }).then((response) => {
      if (response.status === 200) {
        const temp_users = [];
        response.data.values.map((u) => {
          temp_users.push({
            id: u.user.uuid,
            img_link: u.user.links.avatar.href,
            name: u.user.nickname,
          });
        });
        setUsers(temp_users);
        console.log(users);
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container>
      <CardColumns>
        {users.map((user) => (
          <Card border="primary" key={user.id}>
            <Card.Img variant="top" src={user.img_link} />
            <Card.Title>{user.name}</Card.Title>
          </Card>
        ))}
      </CardColumns>
    </Container>
  );
};

export default Dashboard;
