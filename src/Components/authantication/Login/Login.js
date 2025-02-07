import React,{useState} from 'react';

import './Login.css';  
import {Link,useHistory} from 'react-router-dom';
import axios from 'axios';

function Login() {
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
		
		//localStorage.setItem('profileImage',profileImage);
		sessionStorage.setItem('profileImage',profileImage);
		sessionStorage.setItem('Username',Username_session);
		
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
				<input type="text" placeholder="username" require="true"/>
				<input type="password" placeholder="Password" require="true"/>
				<button>Sing Up</button>
			</form>
			 {formErr && <p className="error-message" style={{ color: 'red' ,fontSize:'14px',margin:'0px',}}>{formErr}</p>} {/* Display error message */}
			<p>you don't have an accoutn?<Link to="/singup">SingUp</Link></p>
	  </div>
    </div>
  );
}


export default Login;
