import React from 'react';

import './Navbar.css';  
// import IMGP from'../../../assets/img/profile.jpg';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
 
const profileImage = sessionStorage.getItem('profileImage');
const Username_session = sessionStorage.getItem('Username');

 
const username = useSelector((state) => state.user.username);
// const profileImage = useSelector((state) => state.user.profileImage);
console.log("User : "+username);
 const handalLogout = (e)=>{
	 console.log("This is handalLogout Function..");
	 e.preventDefault();
 }
 // console.log("This is Navbar Componet \n\n\n : "+profileImage+"\n\n");
 return (
    <div className="Navbar">
      <span className="navLogo">Logo</span>
	  <div className="user">
	  {/*<img src={IMGP} alt=""/>*/}
	   <img src={`data:image/jpeg;base64,${profileImage}`} alt="Profile" /> 
	  <span>{Username_session}</span>
	  <button onClick={handalLogout}><Link to="/login">logout </Link></button>
	  </div>
    </div>
  );
}

 
export default Navbar;
