import React, { useState,useEffect,useRef } from "react";
import "./Input.css";
import { useSelector,useDispatch} from 'react-redux';
import socketIOClient from "socket.io-client";
import { setMessage } from '../../../store/userChat.js';


function Input() {
	const [currentMessage, setCurrentMessage] = useState("");
	// const currentUserId = useSelector((state) => state.user.id);
	const currentUserId = sessionStorage.getItem("id");
	const senderUsername = sessionStorage.getItem("Username");
	// const timestamp = new Date.now();
	const timestamp = new Date().toISOString();
	
	const secondUserId = useSelector((state) => state.secondUser.id);
	
	const disptch = useDispatch();
	 const socket = useRef(null)
	// const socket = socketIOClient("http://localhost:5000/");
	useEffect(() => {
	if (!socket.current) {
     socket.current = socketIOClient("http://localhost:5000/");
    }
	
	
	socket.current.on('connect', () => {
        console.log("Socket connected! ID: ", socket.current.id);   
        // socket.current.emit('userConnected', currentUserId);  // Inform the server that this user is connected
      });
	 
	socket.current.emit("join",{
		userId:currentUserId,
	});
	 
	 socket.current.on("receiveMessage", (data) => {
	if(data.receiverId === currentUserId){
      disptch(
        setMessage({
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.message,
        })
	);}
	console.log("Data From Another User : "+data);
    });
    // Cleanup on unmount
    return () => {
       socket.current.disconnect();
      console.log("Socket disconnected!");
    };
  }, [disptch]);
   
	

  function handleMessage() {
    if (currentMessage.trim()) {
      disptch(setMessage({
        senderId: currentUserId,
        // reciverId: secondUserId,
        receiverId: secondUserId,
        message: currentMessage,
		time : timestamp,
      }));
 
	socket.current.emit('SetMessage', {
		senderId: currentUserId,
		receiverId: secondUserId,
		message: currentMessage,
		time:timestamp,
	});
		
	
      setCurrentMessage("");  
    }
  }
  function handleCurrentMessage(e) {
    setCurrentMessage(e.target.value);
    e.preventDefault();
	
	socket.current.emit("typing",{
		senderId:currentUserId,
		receiverId:secondUserId
	});
  }
  
  function handleKeyDown(e) {
  if (e.key === "Enter") {
    handleMessage();
	 
	console.log("fromInput Componet\nid User1 :"+currentUserId);
	console.log("fromInput Componet\nid User2 :"+secondUserId);
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
