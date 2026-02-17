import React, { useState, useEffect } from 'react';

import './Sidebar.css';
import Navbar from './Navbar.jsx';
import Search from './Search.jsx';
import Chats from './Chats.jsx';
// import IMGP from'../../../assets/img/profile.jpg';
// import axios from 'axios';

import axios from '../../../Utilities/axios.js';

function Sidebar() {
  const [username, setUsername] = useState("Saurabh");
  const [users, setUser] = useState([]);
  const [message, setMessage] = useState("Hello");

  const handlaUsers = async () => {
    // const res = await axios("http://localhost:5000/api/users/allUsers", {
    //   headers: {
    //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
    //   }
    // });
    const res = await axios.get("/users/allUsers");
    console.log("USER : ", res.data);
    // console.log("USER : ",res.data.users);
    setUser(res.data.data);
  }
  /*useEffect(() => {
    handlaUsers();
  }, []);*/ // Empty dependency array means this runs once on mount
  const dontChageValue = 0;
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

      {users.map((user, index) => (
        <Chats onClick={setUsernamforChat}
          key={index}
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
