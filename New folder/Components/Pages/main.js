import React from 'react';
import './main.css';

import SideBar from './sidebar/sidebar.js';
import MainBar from './mainbar/mainbar.js';
import Deteails from './deteails/deteails.js';
function main(){
	return(<div className="mainPG">
		<SideBar className="s"/>
		<MainBar className="s1"/>
		<Deteails className="s2"/>
	</div >);
	
}

export default main;