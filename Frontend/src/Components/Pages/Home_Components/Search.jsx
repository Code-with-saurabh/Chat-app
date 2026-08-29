import React, { useState, useEffect } from 'react';
import './Search.css';
import axios from '../../../Utilities/axios.js';
import { useDispatch } from 'react-redux';
import { setSecondUser } from '../../../store/secondUserSlice.js';
import { setActiveConversation, setLoadingMessages, setMessages } from '../../../store/chatSlice.js';
import { ENDPOINTS } from '../../../constants/api.js';
import Avatar from '../../common/Avatar.jsx';

function Search() {
	const dispatch = useDispatch();
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);
	const [profileImage, setprofileImage] = useState(null);
	const [err, setErr] = useState(null);
	const [SecondUserId, SetsecondUserId] = useState(null);

	const handleKey = async (e) => {
		if (e.code === "Enter" && username) {
			e.target.value = "";

			try {
				const res = await axios.get(
					`${ENDPOINTS.USERS.SEARCH}?username=${username}`
				);

				const userData = res.data.data;

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

			const { data } = await axios.post(ENDPOINTS.MESSAGES.CONVERSATION, {
				receiverId: SecondUserId,
			});

			const conversation = data.data;

			if (!conversation?._id) {
				throw new Error("Conversation not found");
			}

			dispatch(setActiveConversation(conversation));

			dispatch(
				setSecondUser({
					id: SecondUserId,
					username: usernameNode.textContent,
					profileImage: profileImageNode.src,
				})
			);

			const messagesRes = await axios.get(
				ENDPOINTS.MESSAGES.BY_CONVERSATION(conversation._id)
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
				<Avatar src={profileImage} alt={username} size={40} />
				<div className="userInfo">
					<span>{username}</span>
				</div>
			</div>}
		</div>
	);
}

export default React.memo(Search);
