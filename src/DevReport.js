<<<<<<< HEAD
import React, { PureComponent } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

const data01 = [
	{ name: 'Group A', value: 400 },
	{ name: 'Group B', value: 300 },
	{ name: 'Group C', value: 300 },
	{ name: 'Group D', value: 200 },
	{ name: 'Group E', value: 278 },
	{ name: 'Group F', value: 189 }
];
=======
import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "axios";

const DevReport = (props) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  var end = new Date();
  end.setHours(23, 59, 59, 999);

  const pullsOpened = [];
  const pullsMerged = [];
  const pullsComments = [];
  const pullsUpdated = [];

  const issuesOpened = [];
  const issueComments = [];
  const issueResolved = [];

  const commitsCreated = [];
  const commitComments = [];


  useEffect(() => {
    Axios.get(
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(created_on>=${start.toISOString()} AND created_on<=${end.toISOString()})`,
      {
        auth: {
          username: "hmg65",
          password: "code@123",
        },
      }
    ).then((response) => {
      // Get PRs which are created by the dev today
      response.data.values.map((pull) => {
        console.log(pull);
      });
    });

    Axios.get(
      `https://api.bitbucket.org/2.0/repositories/hmg65/sia-lounge-backend/pullrequests?q=(updated_on>=${start.toISOString()} AND updated_on<=${end.toISOString()})`,
      {
        auth: {
          username: "hmg65",
          password: "code@123",
        },
      }
    ).then((response) => {
      // Check each PR manually to check dev's comment
      response.data.values.map((pull) => {
        console.log(pull);
      });
    });
  });
>>>>>>> 108a5f8022b24ef12209b56841e3d7f4c5017248

const data02 = [
	{ name: 'Group A', value: 2400 },
	{ name: 'Group B', value: 4567 },
	{ name: 'Group C', value: 1398 },
	{ name: 'Group D', value: 9800 },
	{ name: 'Group E', value: 3908 },
	{ name: 'Group F', value: 4800 }
];

export default class DevReport extends PureComponent {
	static jsfiddleUrl = 'https://jsfiddle.net/alidingling/k9jkog04/';

	render() {
		return (
			<PieChart width={400} height={400}>
				<Pie
					dataKey="value"
					isAnimationActive={false}
					data={data01}
					cx={200}
					cy={200}
					outerRadius={80}
					fill="#8884d8"
					label
				/>
				<Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
				<Tooltip />
			</PieChart>
		);
	}
}
