import React from 'react';
import ReactDOM from 'react-dom';
import AuthForm from './AuthForm';
import Dashboard from './Dashboard';
import About from './About';
import { Router } from '@reach/router';
import { AppBar, Button, Toolbar } from '@material-ui/core';

const App = () => {
	return (
		<React.StrictMode>
			<AppBar position="static">
				<Toolbar>
					<div className="appBar">
						<Button color="inherit" className="SumryLogo">
							Sumry
						</Button>

						<Button color="inherit" href="/about" className="appBarItem">
							About Us
						</Button>
						<Button color="inherit" href="/login" className="appBarItem">
							Login
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
