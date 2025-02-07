import React from 'react';

import './Message.css'; 
import MessageIMGP from'../../../assets/img/profile.jpg'; 
import IMGP from'../../../assets/img/profile.jpg'; 
function Message() {
 const isOwner =false;
   // <div className="Message">
// <div className="Owner">   
		const profileImage = sessionStorage.getItem("profileImage");
		
		const userData = JSON.parse(sessionStorage.getItem("SecondUserData")) || {};
		sessionStorage.removeItem('SecondUserData');
		
 return (

    isOwner ? (
    <div className="Owner">
      <div className="messageInfo">
		 <img src={`data:image/jpeg;base64,${profileImage}`} alt="Profile" />
		<span className="timestamp ">just Now</span>
	  </div>
      <div className="messageContenet">
	   <img src={MessageIMGP} alt=""/> 
		<p>Hii How Are You!?</p>
	  </div>
    </div>
	):(
	<div className="Message">
      <div className="messageInfo">
		 <img src={userData.img} alt=""/>
		<span className="timestamp ">just Now</span>
	  </div>
      <div className="messageContenet">
	   <img src={MessageIMGP} alt=""/> 
		<p>{userData.message}</p>
	  </div>
    </div>
	)

  );
}


export default Message;
