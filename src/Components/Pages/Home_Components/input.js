import React, { useState,useEffect } from "react";
import "./Input.css";
import { useSelector} from 'react-redux';
import socketIOClient from "socket.io-client";


function Input() {
	
const socket = socketIOClient("http://localhost:5000/");
   
  const [currentMessage, setCurrentMessage] = useState("");
	const currentUserId = useSelector((state) => state.user.id);

	const secondUserId = useSelector((state) => state.secondUser.id);

  function handleMessage() {
    console.log(currentMessage);
    // Reset the message after sending (optional)
    setCurrentMessage("");
  }

  function handleCurrentMessage(e) {
    setCurrentMessage(e.target.value);
    e.preventDefault();
	
  }
  function handleKeyDown(e) {
  if (e.key === "Enter") {
    handleMessage();
	 
	 socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: secondUserId,
      message: currentMessage,
    }); 
	console.log("id User1 :"+currentUserId);
	console.log("id User2 :"+secondUserId);
	console.log("id User2 :"+socket.id);
  }
}
 return (
    <div className="input">
     <input type="text" 
	 placeholder="Type.." 
	 value={currentMessage}
	  onChange={handleCurrentMessage} 
	  onKeyDown={handleKeyDown}
	 />
	 <div className="send">
		<input type="file" style={{display:"none"}} id="file"/>
		<label htmlFor="file">
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="lightgray"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
		</label>
		  <input type="file" style={{ display: 'none' }} id="img" accept="image/*" />
		<label htmlFor="img">
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="lightgray"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
		</label>
		   <button onClick={handleMessage}>Send</button>
	 </div>
    </div>
  );
}


export default Input;
