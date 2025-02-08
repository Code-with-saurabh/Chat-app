import React,{useState} from 'react';

import './Search.css';  
// import IMGP from'../../../assets/img/profile.jpg';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import { addSecondUser } from '../../../store/secondUserSlice .js';

function Search() {
	const dispatch = useDispatch();
	const [username,setUsername] = useState("");
	const [user,setUser]=useState(null);
	const [profileImage,setprofileImage]=useState(null);
	const [err,setErr]=useState(null);

	 
	const handleKey = async (e)=>{
		 if (e.code === "Enter" && username) {
			 e.target.value="";
			 try{
				 const res = await axios.get(`http://localhost:5000/api/users/search?username=${username}`);
				 // setUser(res.data.user);
				 setUser(res.data.Username);
				 setprofileImage(res.data.profileImage);
				 // const profileIMG = res.data.profileImage;
				 setErr(null);
				
				 // console.log(res.data);
			 }catch(error){
				 setErr(error.response?.data?.message || "Failed to search user");
        setUser(null); 
			 }
		 }
		
	}
	function handlaUser(e){
		// console.log(e.currentTarget);
		const userChat=e.currentTarget;
		const usernameNode = userChat.childNodes[1]?.childNodes[0];
		const profileImageNode = userChat.childNodes[0];
		dispatch(addSecondUser({
    username: usernameNode.textContent,
    profileImage: profileImageNode.src
	}));
		setUser(null);
	}
 return (
 <div className="Search">
     <div className="Serachfor">
		<input type="text" placeholder="find user"   onKeyDown={handleKey} onChange={e=>{setUsername(e.target.value)}}/>
	 </div>
	 {err && <span className="EPS">User not found!</span>}
	 {user && <div className="userChat" onClick={handlaUser}>
	 {/*} <img src={IMGP}/> //loading="lazy"*/}
		 <img src={`data:image/jpeg;base64,${profileImage}`}  alt="Profile" />
		<div className="userInfo">
			<span>
				{username}
			</span>
		</div>
	 </div>}
    </div>
  );
}


export default Search;
