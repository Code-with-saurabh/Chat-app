import React, { useState } from "react";
import "./Chats.css";
import { useDispatch } from "react-redux";
import {
    setActiveConversation,
    setMessages,
} from "../../../store/chatSlice.js";

import axios from "../../../Utilities/axios.js";

function Chats({ img, username, message, userId }) {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleParticularUser = async () => {
        // prevent double click requests
        if (loading) return;

        try {
            setLoading(true);

            /* ==============================
               1️⃣ Create OR Get Conversation
            ============================== */
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
            const messagesRes = await axios.get(
                `/messages/conversation/${conversation._id}`
            );

            dispatch(setMessages(messagesRes.data.data || []));

        } catch (error) {
            console.error("❌ Conversation error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Chats">
            <div
                className={`userChat ${loading ? "disabled" : ""}`}
                onClick={handleParticularUser}
            >
                <img src={img} alt={username} />

                <div className="userInfo">
                    <span>{username}</span>
                    <p>{message || "Start conversation..."}</p>
                </div>
            </div>
        </div>
    );
}

export default Chats;
