import React,{useState} from 'react';

import './Singin.css';  
import {Link} from   'react-router-dom';
import {useHistory} from   'react-router-dom';

import axios from 'axios';


function Singin() {
 // const history = useHistory();
  const history = useHistory();
  const [formErr,setFormErr]= useState("");
 
 const handlForm = async (e) =>{
	 e.preventDefault();
	const Username = e.target[0].value;
	const Email = e.target[1].value;
	const Password = e.target[2].value;
	// const File = e.target[3].files[0].buffer;
	const File = e.target[3].files[0];
	// const File ="File";
	const userData ={		
		username:Username,
		email:Email,
		password:Password,
	}
	console.log(userData);
	 
	const formData = new FormData();
	formData.append("username",Username);
	formData.append("email",Email);
	formData.append("password",Password);
	formData.append("file", File);
	
	try{
		const res = await axios.post("http://localhost:5000/api/users/register", formData,{
        headers: {
          'Content-Type': 'multipart/form-data' // Set the content type
        }
      } );
		 if (res.status === 201) {
        console.log("Registration successful!");
		
		localStorage.setItem("name","Saurabh");
		
		history.push("/login");
      }
 
	}catch(error){
		if(error.response){
			if(error.response.status === 400 ){
				setFormErr(error.response.data.message);
				console.log(error.response.data.message)
			}
			else if(error.response.status === 401){
				setFormErr(error.response.data.message);
				console.log(error.response.data.message)
			}else{
			// setFormErr("Network error. Please try again.",error.response.status );
			setFormErr(error.response.data.message);
			}
		}else{
			setFormErr("an unexpected error occurred.");
		}
		 console.error("There was an error registering!", error);
	}
	
	
	
 }
 return (
    <div className="Singin formcontainer">
		<div className="Singin formWrapper">
		<span className="logoup">Logo</span>
		<span className="logoups">Sing Up</span>
			<form onSubmit={handlForm}>
				<input type="text" placeholder="Username" required/>
				<input type="email" placeholder="email" required/>
				<input type="Password" placeholder="Password" required/>
				<input style={{display:"none"}} type="file" id="file" required accept="image/*"/>
				<label htmlFor="file">
				<svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
				<span>Add an Avatar</span>
				</label>
				<button  type="submit">Sing Up</button>
			</form>
			{formErr && <p style={{ color: 'red' ,fontSize:'14px',margin:'0px',}}>{formErr}</p>}
			<p>you do have an accoutn?<Link to="/login" >Login</Link></p>
		</div>
    </div>
  );
}


export default Singin;
