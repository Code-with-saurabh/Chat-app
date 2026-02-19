import React from "react";
import "./Chat.css";
import Messages from "./Messages.jsx";
import Input from "./Input.jsx";
import { useSelector } from "react-redux";

function Chat() {

	// ✅ NEW SOURCE OF TRUTH
	const activeConversation = useSelector(
		(state) => state.chat.activeConversation
	);

	/* =========================
	   NO CHAT SELECTED
	========================= */
	if (!activeConversation) {
		return (
			<div className="Chat noChatSelected">
				<p>Select a user to start chatting...</p>
			</div>
		);
	}

	return (
		<div className="Chat">

			{/* HEADER */}
			<div className="ChatInfo">
				<span className="nameP">
					{activeConversation.groupName ||
						activeConversation.username ||
						"Chat"}
				</span>

				<div className="ChatIcon">

					<span className="vediocall">
						<svg xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#FFFFFF">
							<path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Z" />
						</svg>
					</span>

					<span className="addperson">
						<svg xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#FFFFFF">
							<path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z" />
						</svg>
					</span>

					<span className="manuimg">
						<svg xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
							fill="#FFFFFF">
							<path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Z" />
						</svg>
					</span>

				</div>
			</div>

			{/* BODY */}
			<Messages />
			<Input />

		</div>
	);
}

export default Chat;
