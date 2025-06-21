import React from 'react';

import './Navbar.css';  
// import IMGP from'../../../assets/img/profile.jpg';
import {Link,useHistory} from 'react-router-dom';
import { useSelector} from 'react-redux';
import { removeSecondUser } from '../../../store/secondUserSlice .js';
import { removeUser } from '../../../store/userSlice.js';

function Navbar() {
 
const profileImage = sessionStorage.getItem('profileImage');
const Username_session = sessionStorage.getItem('Username');
const history = useHistory();

 
const username = useSelector((state) => state.user.username);
 if(Username_session === null || Username_session === '' || Username_session===""){
	 history.push("/login");
 }
// const profileImage = useSelector((state) => state.user.profileImage);
console.log("User : "+username);
 const handalLogout = (e)=>{
	 console.log("This is handalLogout Function..");
	 // e.preventDefault();
	 sessionStorage.removeItem('Username');
	 sessionStorage.removeItem('profileImage');
	 sessionStorage.removeItem('id');
	 
 }
 // console.log("This is Navbar Componet \n\n\n : "+profileImage+"\n\n");
 return (
    <div className="Navbar">
      <span className="navLogo">Logo</span>
	  <div className="user">
	  {/*<img src={IMGP} alt=""/>*/}
	  <img src={profileImage} alt="Profile" />

	  <span>{Username_session}</span>
	  <button onClick={handalLogout}><Link to="/login">logout </Link></button>
	  </div>
    </div>
  );
}

 
export default Navbar;
