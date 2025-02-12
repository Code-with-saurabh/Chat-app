import React, { useState } from 'react';
import './Chats.css';  
import {useDispatch} from 'react-redux';
import {addSecondUser} from '../../../store/secondUserSlice .js';

function Chats({ img, username, message }) {
	const dispatch = useDispatch();
	
     const [selectedUser, setSelectedUser] = useState({ img: '', username: '', message: '' });

    function handleParticularUser(e) {
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
    username: usernameNode.textContent,
    profileImage: profileImageNode.src
	}));

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