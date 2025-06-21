import React,{useState,useEffect} from 'react';

import './Message.css'; 
import MessageIMGP from'../../../assets/img/profile.jpg'; 
import IMGP from'../../../assets/img/profile.jpg'; 
import {useSelector} from 'react-redux';

function Message({ message, senderId, isOwner ,timestamp}) {
	 
 
   
  console.log("\n\nfrom   massage : " + message);
  console.log("from  id sender : " + senderId);
  console.log("\n\n\nIs Ownaer : " + isOwner);
	
 
	
 
		const profileImage = sessionStorage.getItem("profileImage");
		
		const userData = useSelector((state)=>state.secondUser);
		 
		// sessionStorage.removeItem('SecondUserData');
		
/*	const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp); 
    
    let hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 12:00 AM/PM instead of 0:00
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${minutesFormatted} ${ampm}`; // Format as HH:MM AM/PM
  };*/
 
 const formatTimestamp = (timestamp) => {
  const messageDate = new Date(timestamp); 
  if (isNaN(messageDate)) {
    return "Invalid time";  // Handle invalid date
  }
  let hours = messageDate.getHours();
  const minutes = messageDate.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;  // 12:00 AM/PM instead of 0:00
  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${hours}:${minutesFormatted} ${ampm}`;  // HH:MM AM/PM
};

  return (
    <div className={isOwner ? "Owner" : "Message"}>
      <div className="messageInfo">
        <img 
          src={isOwner ? profileImage : userData.profileImage || MessageIMGP} 
          alt="Profile" 
        />
        <span className="timestamp">{formatTimestamp(timestamp)}</span>
      </div>
      <div className="messageContenet">
        <p>{message}</p>
      </div>
    </div>
  );
}


export default Message;
