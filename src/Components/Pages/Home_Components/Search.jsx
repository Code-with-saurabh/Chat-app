import React, { useState } from 'react';

import './Search.css';
// import IMGP from'../../../assets/img/profile.jpg';
// import axios from 'axios';
import axios from '../../../Utilities/axios.js';
import { useDispatch } from 'react-redux';
import { setSecondUser } from '../../../store/secondUserSlice.js';
import { setActiveConversation, setLoadingMessages, setMessages } from '../../../store/chatSlice.js';

function Search() {
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [profileImage, setprofileImage] = useState(null);
	const [err, setErr] = useState(null);
	const [SecondUserId, SetsecondUserId] = useState(null);


	// const handleKey = async (e) => {
	// 	if (e.code === "Enter" && username) {
	// 		e.target.value = "";
	// 		try {
	// 			const res = await axios.get(`http://localhost:5000/api/users/search?username=${username}`);
	// 			// setUser(res.data.user);
	// 			setUser(res.data.Username);
	// 			SetsecondUserId(res.data.id);
	// 			setprofileImage(res.data.profileImage);
	// 			// const profileIMG = res.data.profileImage;
	// 			setErr(null);

	// 			// console.log(res.data);
	// 		} catch (error) {
	// 			setErr(error.response?.data?.message || "Failed to search user");
	// 			setUser(null);
	// 		}
	// 	}

	// }
	const handleKey = async (e) => {
		if (e.code === "Enter" && username) {
			e.target.value = "";

			try {
				const res = await axios.get(
					`/users/search?username=${username}`
				);

				const userData = res.data.data; // 👈 IMPORTANT

				setUser(userData.username);
				SetsecondUserId(userData.id);
				setprofileImage(userData.profileImage);
				setErr(null);

			} catch (error) {
				setErr(error.response?.data?.message || "Failed to search user");
				setUser(null);
			}
		}
	};
	const handlaUser = async (e) => {
		const userChat = e.currentTarget;
		const usernameNode = userChat.childNodes[1]?.childNodes[0];
		const profileImageNode = userChat.childNodes[0];

		try {
			dispatch(setLoadingMessages(true));
			dispatch(setMessages([]));

			console.log("SecondUserId:", SecondUserId);
			// 1. Create / Get conversation
			const { data } = await axios.post("/messages/conversation", {
				receiverId: SecondUserId,
			});



			console.log("Conversation API:", data);
			const conversation = data.data;

			if (!conversation?._id) {
				throw new Error("Conversation not found");
			}

			// 2. Save active conversation
			dispatch(setActiveConversation(conversation));

			// 3. Save second user
			dispatch(
				setSecondUser({
					id: SecondUserId,
					username: usernameNode.textContent,
					profileImage: profileImageNode.src,
				})
			);

			// 4. Load old messages
			const messagesRes = await axios.get(
				`/messages/conversation/${conversation._id}`
			);

			dispatch(setMessages(messagesRes.data.data || []));

			setUser(null);
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(setLoadingMessages(false));
		}
	};
	return (
		<div className="Search">
			<div className="Serachfor">
				<input type="text" placeholder="find user" onKeyDown={handleKey} onChange={e => { setUsername(e.target.value) }} />
			</div>
			{err && <span className="EPS">User not found!</span>}
			{user && <div className="userChat" onClick={handlaUser}>
				{/*} <img src={IMGP}/> //loading="lazy"*/}
				<img src={profileImage} alt="Profile" />
				<div className="userInfo">
					<span>
						{username}
					</span>
				</div>
			</div>}
		</div>
	);
}


export default React.memo(Search);
