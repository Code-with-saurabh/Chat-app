import React, { useState, useEffect, useRef } from 'react';
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
	const [users, setUsers] = useState([]);
	const [err, setErr] = useState(null);
	const [focusedIndex, setFocusedIndex] = useState(-1);
	const debounceRef = useRef(null);
	const inputRef = useRef(null);

	const searchUser = async (query) => {
		if (!query) {
			setUsers([]);
			setErr(null);
			return;
		}

		try {
			const res = await axios.get(
				`${ENDPOINTS.USERS.SEARCH}?username=${query}`
			);

			setUsers(res.data.data || []);
			setFocusedIndex(-1);
			setErr(null);

		} catch (error) {
			setErr(error.response?.data?.message || "Failed to search user");
			setUsers([]);
			setFocusedIndex(-1);
		}
	};

	const handleKey = (e) => {
		if (!users.length && e.code !== "Enter") return;

		if (e.code === "ArrowDown") {
			e.preventDefault();
			setFocusedIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
		} else if (e.code === "ArrowUp") {
			e.preventDefault();
			setFocusedIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
		} else if (e.code === "Enter") {
			e.preventDefault();
			if (focusedIndex >= 0 && focusedIndex < users.length) {
				handlaUser(users[focusedIndex]);
			} else if (username) {
				if (debounceRef.current) clearTimeout(debounceRef.current);
				searchUser(username);
			}
		} else if (e.code === "Escape") {
			setUsers([]);
			setFocusedIndex(-1);
		}
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setUsername(value);
		setFocusedIndex(-1);

		if (debounceRef.current) clearTimeout(debounceRef.current);

		debounceRef.current = setTimeout(() => {
			searchUser(value);
		}, 400);
	};

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const handlaUser = async (selectedUser) => {
		try {
			dispatch(setLoadingMessages(true));
			dispatch(setMessages([]));

			const { data } = await axios.post(ENDPOINTS.MESSAGES.CONVERSATION, {
				receiverId: selectedUser.id,
			});

			const conversation = data.data;

			if (!conversation?._id) {
				throw new Error("Conversation not found");
			}

			dispatch(setActiveConversation(conversation));

			dispatch(
				setSecondUser({
					id: selectedUser.id,
					username: selectedUser.username,
					profileImage: selectedUser.profileImage,
				})
			);

			const messagesRes = await axios.get(
				ENDPOINTS.MESSAGES.BY_CONVERSATION(conversation._id)
			);

			dispatch(setMessages(messagesRes.data.data || []));

			setUsers([]);
			setUsername("");
		} catch (error) {
			console.error(error);
		} finally {
			dispatch(setLoadingMessages(false));
		}
	};

	return (
		<div className="Search">
			<div className="Serachfor">
				<input
					ref={inputRef}
					type="text"
					placeholder="find user"
					onKeyDown={handleKey}
					onChange={handleChange}
				/>
			</div>
			{err && <span className="EPS">User not found!</span>}
			{users.map((u, i) => (
				<div
					className={`userChat ${i === focusedIndex ? "searchFocused" : ""}`}
					key={u.id}
					onMouseEnter={() => setFocusedIndex(i)}
					onClick={() => handlaUser(u)}
				>
					<Avatar src={u.profileImage} alt={u.username} size={40} />
					<div className="userInfo">
						<span>{u.username}</span>
					</div>
				</div>
			))}
		</div>
	);
}

export default React.memo(Search);
