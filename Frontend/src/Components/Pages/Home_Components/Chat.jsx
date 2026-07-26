import React, { useEffect } from "react";
import "./Chat.css";
import Messages from "./Messages.jsx";
import Input from "./input.jsx";
import { useSelector, useDispatch } from "react-redux";
import { markConversationRead } from "../../../store/notificationSlice.js";
import { setActiveConversation } from "../../../store/chatSlice.js";
// ⚠️ VERIFY: upar wala import path + action name aapke chatSlice.js se match hona chahiye.
// Agar action ka naam alag hai (e.g. clearActiveConversation, resetChat, etc),
// to yahan import aur neeche wala dispatch() call dono me naam badal do.

function Chat() {

  const dispatch = useDispatch();

  const unreadCount = useSelector(
    (state) => state.notification.unreadCount
  );
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation,
  );

  useEffect(() => {
   
    
    if (activeConversation?._id) {
      dispatch(markConversationRead(activeConversation._id));
    }
  }, [activeConversation?._id]);


  return (
    <div className="Chat">
      {/* HEADER */}
      <div className="ChatInfo">
        <span
          className="backToSidebar"
          onClick={() => dispatch(setActiveConversation(null))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22px"
            viewBox="0 -960 960 960"
            width="22px"
            fill="#FFFFFF"
          >
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </span>

        <span className="nameP">
          {activeConversation?.groupName ||
            activeConversation?.username ||
            "Chat"}
        </span>

        <div className="ChatIcon">
          <span className="vediocall">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z" />
            </svg>
          </span>

          <span className="notification">
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M160-200v-80h80v-240q0-83 50-147.5T440-754v-26q0-17 11.5-28.5T480-820q17 0 28.5 11.5T520-780v26q100 23 150 87.5T720-520v240h80v80H160Zm320 120q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z" />
            </svg>
          </span>
          <span className="manuimg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T440-560q33 0 56.5 23.5T520-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
            </svg>
          </span>
        </div>
      </div>
      {
        !activeConversation ? <div className="Chat noChatSelected">
          <p>Select a user to start chatting...</p>
        </div> : <Messages />
      }
      {/* BODY */}

      <Input />
    </div>
  );
}

export default Chat;