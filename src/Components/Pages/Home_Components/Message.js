import React,{useState,useEffect} from 'react';

import './Message.css'; 
import MessageIMGP from'../../../assets/img/profile.jpg'; 
import IMGP from'../../../assets/img/profile.jpg'; 
import {useSelector} from 'react-redux';

function Message({ message, senderId, isOwner }) {
	 
 
   
  console.log("\n\nfrom   massage : " + message);
  console.log("from  id sender : " + senderId);
  console.log("\n\n\nIs Ownaer : " + isOwner);
	
 
	
 
		const profileImage = sessionStorage.getItem("profileImage");
		
		const userData = useSelector((state)=>state.secondUser);
		 
		// sessionStorage.removeItem('SecondUserData');
		
 
  return (
    <div className={isOwner ? "Owner" : "Message"}>
      <div className="messageInfo">
        <img 
          src={isOwner ? profileImage : userData.profileImage || MessageIMGP} 
          alt="Profile" 
        />
        <span className="timestamp">just Now</span>
      </div>
      <div className="messageContenet">
        <p>{message}</p>
      </div>
    </div>
  );
}


export default Message;
