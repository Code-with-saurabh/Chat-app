import React, { useState } from 'react';
import './Chats.css';  

function Chats({ img, username, message }) {
     const [selectedUser, setSelectedUser] = useState({ img: '', username: '', message: '' });

    function handleParticularUser(e) {
        const userChat = e.currentTarget; // Use currentTarget to get the clicked element
        const userData = {
            img: userChat.childNodes[0].src,
            username: userChat.childNodes[1].childNodes[0].textContent,
            message: userChat.childNodes[1].childNodes[1].textContent,
        };

        setSelectedUser(userData);
        sessionStorage.setItem("SecondUserData", JSON.stringify(userData));
    }

    return (
        <div className="Chats">
            <div className="userChat" onClick={handleParticularUser}>
                <img src={`data:image/jpeg;base64,${img}`} alt="Profile" /> 
                <div className="userInfo">
                    <span>{username}</span>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Chats;