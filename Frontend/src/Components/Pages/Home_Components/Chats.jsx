import React, { useState } from "react";
import "./Chats.css";
import { setSecondUser } from "../../../store/secondUserSlice";

import { useDispatch } from "react-redux";
import {
  setActiveConversation,
  setMessages,
} from "../../../store/chatSlice.js";
import { setLoadingMessages } from "../../../store/chatSlice";
import axios from "../../../Utilities/axios.js";

function Chats({ img, username, message, userId,unreadCount  }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleParticularUser = async () => {
    // prevent double click requests
    if (loading) return;

    try {
      setLoading(true);

      //  Create OR Get Conversation
      dispatch(setLoadingMessages(true)); // ✅ START LOADER
    dispatch(setMessages([])); // optional clear

      const { data } = await axios.post("/messages/conversation", {
        receiverId: userId,
      });

      const conversation = data.data;

      if (!conversation?._id) {
        throw new Error("Conversation not found");
      }

      /* ==============================
               2️⃣ Save Active Conversation
            ============================== */
      console.log("Active Conversation:", conversation);
      dispatch(setActiveConversation(conversation));

      /* ==============================
               3️⃣ Fetch Messages
            ============================== */

      dispatch(
        setSecondUser({
          id: userId,
          username: username,
          profileImage: img,
        }),
      );

      const messagesRes = await axios.get(
        `/messages/conversation/${conversation._id}`,
      );

      dispatch(setMessages(messagesRes.data.data || []));
    } catch (error) {
      console.error(
        "❌ Conversation error:",
        error.response?.data || error.message,
      );
    } finally {
      dispatch(setLoadingMessages(false)); // ✅ STOP LOADER
    setLoading(false);
    }
  };

  return (
    <div className="Chats">
      
      <div
        className={`userChat ${loading ? "disabled" : ""}`}
        onClick={handleParticularUser}
      >
        <img src={img} alt={username} loading="lazy" />

        <div className="userInfo">
          <span>{username}</span>
          <p className="lastMessage">{message || "Start conversation..."}</p>
          {unreadCount > 0 && (
  <div className="chatBadge">
    {unreadCount}
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Chats);
