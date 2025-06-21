import React, { useState,useEffect } from 'react';
import './Chats.css';  
import {useDispatch} from 'react-redux';
import {addSecondUser} from '../../../store/secondUserSlice .js';
import { setAllMessages } from '../../../store/userChat.js';
import axios from 'axios';

function Chats({ img, username, message,userId }) {
	
	/*async function testFetchMessagesBetweenUsers(){
  const userX = "67ad03004b3560032caf7300"; // your ID
  const userY = "67ad042b4b3560032caf7821"; // receiver ID in DB

  try {
    const res = await axios.get(`http://localhost:5000/api/messages/${userX}/${userY}`);
    console.log("? All messages between X and Y:");
    console.log(res.data); // Should now print all actual messages
  } catch (err) {
    console.error("? Error fetching messages:", err);
  }
}
useEffect(() => {
  testFetchMessagesBetweenUsers();
}, []);*/	
	
	const dispatch = useDispatch();
	
     const [selectedUser, setSelectedUser] = useState({ img: '', username: '', message: '' });

    async function handleParticularUser(e) {
        const userChat = e.currentTarget; // Use currentTarget to get the clicked element
		const usernameNode = userChat.childNodes[1]?.childNodes[0];
		const profileImageNode = userChat.childNodes[0];
        /*const userData = {
            img: userChat.childNodes[0].src,
            username: userChat.childNodes[1].childNodes[0].textContent,
            message: userChat.childNodes[1].childNodes[1].textContent,
        };
	*/
	dispatch(addSecondUser({
	id:userId,
    username: usernameNode.textContent,
    profileImage: profileImageNode.src
	}));
	
	
	//here 10 june
	const currentUserId =sessionStorage.getItem("id");
	try{
		const res = await axios.get(`http://localhost:5000/api/messages/${currentUserId}/${userId}`);
		// const res = await axios.get("http://localhost:5000/api/messages/67ad03004b3560032caf7300/67ad042b4b3560032caf7821");
		dispatch(setAllMessages(res.data));
		/*
		console.log("\n\nCurrent User : "+currentUserId)
		console.log("\n\nCurrent User : "+userId)
		console.log("\n\nres Data : "+res.data)
	*/
	}catch(err){
		console.error("Error fetching messages : ".err);
	}

        // setSelectedUser(userData);
        // sessionStorage.setItem("SecondUserData", JSON.stringify(userData));
    }

    return (
        <div className="Chats">
            <div className="userChat" onClick={handleParticularUser}>
                <img src={img}alt="Profile" /> 
                <div className="userInfo">
                    <span>{username}</span>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Chats;