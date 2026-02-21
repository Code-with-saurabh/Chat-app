// src/App.jsx
import React,{Suspense, lazy, } from "react";
import "./App.css";

import SingIn from "./Components/authantication/Singin/Singin";
// import Home from "./Components/Pages/Home";
const Home = lazy(()=>import("./Components/Pages/Home")) 
import Login from "./Components/authantication/Login/Login";

import { Routes, Route } from "react-router-dom";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={
					<Suspense fallback={<div style={{width:"100%"}}>Loading Chat...</div>}>
						<Home />
					</Suspense>
					} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SingIn />} />
			</Routes>
		</div>
	);
}

export default App;
