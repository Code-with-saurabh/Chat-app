// src/App.jsx
import React from "react";
import "./App.css";

import SingIn from "./Components/authantication/Singin/Singin";
import Home from "./Components/Pages/Home";
import Login from "./Components/authantication/Login/Login";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SingIn />} />
			</Routes>
		</div>
	);
}

export default App;
