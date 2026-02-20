import React, { useEffect } from 'react';

import './Home.css';
import Sidebar from './Home_Components/Sidebar.jsx';
import Chat from './Home_Components/Chat.jsx';
import { socket } from "../../socket.js";
// import { useSelector } from 'react-redux';
// Home_Components
// import io from 'socket.io-client';
function Home() {
  // const socket = io('http://localhost:5000');


  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  return (
    <div className="Home">
      <div className="container">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}


export default Home;
