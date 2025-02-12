import React from 'react';

import './Home.css';  
import Sidebar from './Home_Components/Sidebar.js';
import Chat from './Home_Components/Chat.js';
// import { useSelector } from 'react-redux';
// Home_Components
// import io from 'socket.io-client';

function Home() {
	 // const socket = io('http://localhost:5000');
 return (
    <div className="Home">
      <div className="container">
		<Sidebar/>
		<Chat/>
	  </div>
    </div>
  );
}


export default Home;
