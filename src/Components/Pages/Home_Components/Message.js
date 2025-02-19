import React,{useState,useEffect} from 'react';

import './Message.css'; 
import MessageIMGP from'../../../assets/img/profile.jpg'; 
import IMGP from'../../../assets/img/profile.jpg'; 
import {useSelector} from 'react-redux';

function Message() {
	const [isOwner,setOwner] = useState(true);
 
		const profileImage = sessionStorage.getItem("profileImage");
		
		const userData = useSelector((state)=>state.secondUser);
		 
		// sessionStorage.removeItem('SecondUserData');
		
 
 return (
<>
<div className={isOwner ? "Owner" : "Message"}>
  <div className="messageInfo">
    <img src={isOwner ? profileImage : userData.profileImage} alt="Profile" />
    <span className="timestamp">just Now</span>
  </div>
  <div className="messageContenet">
    <img src={MessageIMGP} alt="" />
		<p>{isOwner ? "Hii How Are You!?" : userData.username}</p>
   {/* <p>{UserMessage}</p>*/}
  </div>
</div>

</>
  );
}


export default Message;
