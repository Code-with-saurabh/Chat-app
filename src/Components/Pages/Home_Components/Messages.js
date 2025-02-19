import React from 'react';

import './Messages.css';  
import Message from './Message.js';
 
function Messages() {
	 
	
  // const UserMessage = useSelector((state) => state.userChat.message);
  // console.log("from Messages Component : " + UserMessage);

 return (
    <div className="Messages">
       <Message/>
       <Message/>
      
    </div>
  );
}


export default Messages;
