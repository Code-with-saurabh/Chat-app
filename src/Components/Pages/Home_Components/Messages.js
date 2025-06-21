import React,{ useEffect, useRef } from 'react';

import './Messages.css';  
import Message from './Message.js';
import { useSelector} from 'react-redux';

function Messages() {
 
 const TimeC =  Date.now();
  const userMessages = useSelector((state) => state.userChat.messages);  
 
  
  const currentUser = sessionStorage.getItem("id");
  
   
	 
	 console.log("\n\nStore:"+userMessages)
	 const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userMessages]); 
 
 return (
    <div className="Messages">
     {userMessages.map((message, index) => (
        <Message 
          key={index} 
          message={message.message}  
          senderId={message.sender}
          isOwner={message.sender=== currentUser || message.senderId=== currentUser} 
		  timestamp = {message.time || message.timestamp} 
        />
      ))}
	    <div ref={messagesEndRef} />
		 
    </div>
	
  );
}


export default Messages;
