import React, { useEffect, useState } from "react";
import Axios from "axios";
import { navigate } from "@reach/router";

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
      }
    });
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div>
        {users.map((user) => ({
          /*<Card
						key={user.id}
						tag="a"
						onClick={() => {
							navigate(`/report/${user.id}`, {
								state: {
									username: props.location.state.username,
									password: props.location.state.password,
									id: user.id
								}
							});
						}}
						style={{ cursor: 'pointer' }}
						border="primary"
					>
						<Card.Img variant="top" src={user.img_link} />
						<Card.Title>{user.name}</Card.Title>
					</Card> */
        }))}
      </div>
    </div>
  );
};

export default Dashboard;
