// src/App.js
import React from 'react';
import './App.css';  // Import any styles for App component
import SingIn from './Components/authantication/Singin/Singin.js';

import Home from './Components/Pages/Home.js';

import Login from './Components/authantication/Login/Login.js';
import {Switch,Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
	 
	<Switch>
		<Route exact path="/" component={Home} />
		<Route path="/login" component={Login}/>
		<Route path="/singup" component={SingIn} />
	</Switch>
	 
      
    </div>
  );
}

export default App;
