import React,{useState,useEffect} from 'react';

import './Sidebar.css'; 
import Navbar from './Navbar.js';
import Search from './Search.js';
import Chats from './/Chats.js';
// import IMGP from'../../../assets/img/profile.jpg';
import axios from 'axios';
function Sidebar() {
 const [username,setUsername]=useState("Saurabh");
 const [users,setUser]=useState([]);
 const [message,setMessage]=useState("Hello");
 
  const handlaUsers = async()=>{
	 const res =  await axios("http://localhost:5000/api/users/allUsers");
	 console.log(res.data.users);
	 setUser(res.data.users);
 }
  /*useEffect(() => {
    handlaUsers();
  }, []);*/ // Empty dependency array means this runs once on mount
  const dontChageValue=0;
  useEffect(() => {
    handlaUsers();
  },[]);// i wnat that this one only run once in whole page on user login and user logout // user ke massage ka bad me dekhege // vesebhi vo might be dusre route se aayega 
  //this one may be only work once when new user added
	function setUsernamforChat(e){
		// sessionStorage.setItem("Username",username);
		// console.log(e);
	}
 return (
    <div className="Sidebar">
      <Navbar/>
	  <Search/>
	 
	  {users.map((user, index) => (
  <Chats  onClick={setUsernamforChat}
	key={index} 
    username={user.username} 
    img={user.profileImage} 
    message={message}
	  isOwner={false}
  />
))}
 
    </div>
  );
}


export default Sidebar;
