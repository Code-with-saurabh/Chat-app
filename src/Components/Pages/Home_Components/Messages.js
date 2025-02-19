import React from 'react';

import './Messages.css';  
import Message from './Message.js';
import { useSelector} from 'react-redux';

function Messages() {
	const UserMessage = useSelector((state) => state.userChat.message);
	const CurrectUser = useSelector((state) => state.userChat.senderId);
	const SecondUser = useSelector((state) => state.userChat.reciverId);
	const profileImage = sessionStorage.getItem("profileImage");
	const UserMain = sessionStorage.getItem("id");
	const userData = useSelector((state)=>state.secondUser);
	
  // const UserMessage = useSelector((state) => state.userChat.message);
  // console.log("from Messages Component : " + UserMessage);

 return (
    <div className="Messages">
       <Message/>
      
    </div>
  );
}


export default Messages;
