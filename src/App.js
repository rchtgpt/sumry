import React from 'react';
import ReactDOM from 'react-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import About from './About';
import { Router } from '@reach/router';
import { AppBar, Button, Toolbar, img } from '@material-ui/core';

const App = () => {
	return (
		<React.StrictMode>
			<AppBar position="static">
				<Toolbar>
					<div className="appBar">
						<Button color="inherit" className="SumryLogo">
							<img alt="" src="https://avatars1.githubusercontent.com/u/38353418?v=4" width="40" />
						</Button>
						<Button color="inherit" href="/about" className="appBarItem">
							About Us
						</Button>
						<Button color="inherit" href="/login" className="appBarItem">
							Login
						</Button>
						<Button color="inherit" className="SumryLogo">
							<img
								alt=""
								src="https://secure.gravatar.com/avatar/321e8aa99254a96cb5a0ad3d997842c9?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FCG-0.png"
								width="40"
							/>
						</Button>
					</div>
				</Toolbar>
			</AppBar>
			<Router>
				<AuthForm path="/login" />
				<Dashboard path="/" />
				<About path="/about" />
			</Router>
		</React.StrictMode>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
