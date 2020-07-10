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
			<AppBar position="fixed" color="#0054cf">
				<Toolbar>
					<div className="appBar">
						<Button color="inherit" className="SumryLogo">
							<img
								alt=""
								src="https://user-images.githubusercontent.com/44428198/87115326-83c49880-c290-11ea-8537-b8a305428172.png"
								width="40"
							/>
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
