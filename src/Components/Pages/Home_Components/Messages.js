import React,{ useEffect, useRef } from 'react';

import './Messages.css';  
import Message from './Message.js';
import { useSelector} from 'react-redux';

function Messages() {
	
  const userMessages = useSelector((state) => state.userChat.messages);  // Get the list of messages
  const currentUser = useSelector((state) => state.userChat.senderId);
  
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
          senderId={message.senderId}
          isOwner={message.senderId === currentUser}   
        />
      ))}
	    <div ref={messagesEndRef} />
    </div>
	
  );
}


export default Messages;
