import React,{useState,useEffect} from 'react';

import './Message.css'; 
import MessageIMGP from'../../../assets/img/profile.jpg'; 
import IMGP from'../../../assets/img/profile.jpg'; 
import {useSelector} from 'react-redux';

function Message() {
	const [isOwner,setOwner] = useState(false);
 const UserMessage = useSelector((state) => state.userChat.message);
 const CurrectUser = useSelector((state) => state.userChat.senderId);
 const SecondUser = useSelector((state) => state.userChat.reciverId);
 const UserMain = sessionStorage.getItem("id");
 
  console.log("from Message Component : " + UserMessage);
  console.log("\n\nfrom  id Component : " + CurrectUser);
  console.log("from  id session  Component : " + UserMain);
  console.log("\n\n\nIs Ownaer : " + isOwner);
	
 
	
 
		const profileImage = sessionStorage.getItem("profileImage");
		
		const userData = useSelector((state)=>state.secondUser);
		 
		// sessionStorage.removeItem('SecondUserData');
		
useEffect(()=>{
	if(UserMain !== CurrectUser){
		setOwner(true);
	}
},[UserMain,CurrectUser]);
	
 return (
<>
<div className={isOwner ? "Owner" : "Message"}>
  <div className="messageInfo">
    <img src={isOwner ? profileImage : userData.profileImage} alt="Profile" />
    <span className="timestamp">just Now</span>
  </div>
  <div className="messageContenet">
    <img src={MessageIMGP} alt="" />
		{/*<p>{isOwner ? "Hii How Are You!?" : userData.username}</p>*/}
    <p>{UserMessage}</p>
  </div>
</div>

</>
  );
}


export default Message;
