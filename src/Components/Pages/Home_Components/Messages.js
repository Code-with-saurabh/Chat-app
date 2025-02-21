import React,{ useEffect, useRef,useState } from 'react';

import './Messages.css';  
import Message from './Message.js';
import { useSelector} from 'react-redux';

function Messages() {
const [isOwner,setIsOwner] = useState(true);
  const userMessages = useSelector((state) => state.userChat.messages);  // Get the list of messages
  // const currentUser = useSelector((state) => state.userChat.senderId);
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
          senderId={message.senderId}
          isOwner={true}   
        />
      ))}
	    <div ref={messagesEndRef} />
		 
    </div>
	
  );
}


export default Messages;
