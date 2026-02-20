import React, { useState, useEffect } from 'react';

import './Sidebar.css';
import Navbar from './Navbar.jsx';
import Search from './Search.jsx';
import Chats from './Chats.jsx';
// import IMGP from'../../../assets/img/profile.jpg';
// import axios from 'axios';

import axios from '../../../Utilities/axios.js';

function Sidebar() {
  // const [username, setUsersname] = useState("Saurabh");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Hello");

  const handlaUsers = async () => {
    try {
      const res = await axios.get("/users/allUsers");
      console.log("USER : ", res.data);
      setUsers(res.data.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };


  useEffect(() => {
    handlaUsers();
  }, []);// i wnat that this one only run once in whole page on user login and user logout // user ke massage ka bad me dekhege // vesebhi vo might be dusre route se aayega 
  //this one may be only work once when new user added

  function setUsernamforChat(e) {
    // sessionStorage.setItem("Username",username);
    // console.log(e);
  }
  return (
    <div className="Sidebar">
      <Navbar />
      <Search />

      {users?.map((user, index) => (
        <Chats onClick={setUsernamforChat}
          key={user.id || index}
          username={user.username}
          img={user.profileImage}
          userId={user.id}
          message={message}
          isOwner={false}
        />
      ))}

    </div>
  );
}


export default Sidebar;
