import React, { useState } from "react";
import "./Chats.css";
import { setSecondUser } from "../../../store/secondUserSlice";
import { useDispatch } from "react-redux";
import {
  setActiveConversation,
  setMessages,
  setLoadingMessages,
} from "../../../store/chatSlice.js";
import axios from "../../../Utilities/axios.js";
import { ENDPOINTS } from "../../../constants/api.js";
import Avatar from "../../common/Avatar.jsx";

function Chats({ img, username, message, userId, unreadCount, online, lastSeen }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleParticularUser = async () => {
    if (loading) return;

    try {
      setLoading(true);
      dispatch(setLoadingMessages(true));
      dispatch(setMessages([]));

      const { data } = await axios.post(ENDPOINTS.MESSAGES.CONVERSATION, {
        receiverId: userId,
      });

      const conversation = data.data;

      if (!conversation?._id) {
        throw new Error("Conversation not found");
      }

      dispatch(
        setActiveConversation({ ...conversation, username, profileImage: img, online, lastSeen }),
      );

      dispatch(
        setSecondUser({
          id: userId,
          username: username,
          profileImage: img,
        }),
      );

      const messagesRes = await axios.get(
        ENDPOINTS.MESSAGES.BY_CONVERSATION(conversation._id),
      );

      dispatch(setMessages(messagesRes.data.data || []));
    } catch (error) {
      console.error("Conversation error:", error.response?.data || error.message);
    } finally {
      dispatch(setLoadingMessages(false));
      setLoading(false);
    }
  };

  return (
    <div className="Chats">
      <div
        className={`userChat ${loading ? "disabled" : ""}`}
        onClick={handleParticularUser}
      >
        <Avatar src={img} alt={username} size={40} />

        <div className="userInfo">
          <span>{username}</span>
          <p className="lastMessage">{message || "Start conversation..."}</p>
          {unreadCount > 0 && <div className="chatBadge">{unreadCount}</div>}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Chats);
