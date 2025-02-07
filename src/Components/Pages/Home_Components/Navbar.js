import React from 'react';

import './Navbar.css';  
// import IMGP from'../../../assets/img/profile.jpg';
import {Link} from 'react-router-dom';

function Navbar() {
// const profileImage = localStorage.getItem('profileImage');
const profileImage = sessionStorage.getItem('profileImage');
const Username_session = sessionStorage.getItem('Username');

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
