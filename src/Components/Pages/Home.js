import React from 'react';

import './Home.css';  
import Sidebar from './Home_Components/Sidebar.js';
import Chat from './Home_Components/Chat.js';

// Home_Components
function Home() {
 
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
