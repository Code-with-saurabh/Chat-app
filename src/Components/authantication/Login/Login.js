import React,{useState} from 'react';

import './Login.css';  
import {Link,useHistory} from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../../../store/userSlice.js';

function Login() {
	const dispatch = useDispatch();
	const history = useHistory();
	const [formErr,setFormErr]= useState("");
	 
    async function handleSubmit(e) {
        e.preventDefault();
	  
	  const Username = e.target[0].value;
	  const Password = e.target[1].value;
		
	 const  loginData = {
		username:Username,
		password:Password,
	 }
		console.log(loginData);
		
		try{
			const res = await axios.post("http://localhost:5000/api/users/login",loginData);
			
		if(res.status === 200){
		console.log("Login successful!");
		// console.log(res.data.profileImage);
		const profileImage=res.data.profileImage;
		const Username_session=res.data.Username;
		const Username_s =res.data.Username;
		const UserId =res.data.id;
		 
		
		//localStorage.setItem('profileImage',profileImage);
		//it must to store user to sessio donot delet the session line in futur becz of this authrizer access the '/' page 
		sessionStorage.setItem('profileImage',profileImage);
		sessionStorage.setItem('Username',Username_session);
		sessionStorage.setItem('id',UserId);
		// dispatch(addUser(res.data.Username));
		dispatch(addUser({ id:UserId,username: Username_s, profileImage }));
	 
		history.push("/");
		}
		if(res.status === 401){
		console.log("401 ERROR");
		// history.push("/LOGIN");
		}
	
	  
        console.log("Login Submitted");
		}catch(error){
		if (error.response) {
			if(error.response.status===401){
				setFormErr("Wrong Password..");
			}
			else if(error.response.status === 404){
				setFormErr("Username not found..");
			}else{
				setFormErr("an unexpected error occurred.");
			}
		}else{
			 setFormErr("Network error. Please try again.");
		}
		
        console.log("Error : "+error);
		}
    }

    
 return (
    <div className="Login formcontainer">
      <div className="Login formWrapper">
		<span className="logoup">Logo</span>
		<span className="logoups">Login</span>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="Username" required/>
				<input type="password" placeholder="Password" required/>
				<button>Sign Up</button>
			</form> 
			 {formErr && <p className="error-message" style={{ color: 'red' ,fontSize:'14px',margin:'0px',}}>{formErr}</p>} {/* Display error message */}
			<p>you don't have an accoutn?<Link to="/singup">SingUp</Link></p>
	  </div>
    </div>
  );
}


export default Login;
