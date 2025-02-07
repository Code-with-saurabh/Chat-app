import React from 'react';
import './sidebar.css';
import Users from './users/users.js';
function sidebar(){
	return(<div className="sidebar">
		 Side Bar 
		 <hr/>
		 <Users/>
	</div >);
	
}

export default sidebar;