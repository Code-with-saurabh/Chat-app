import React, { useEffect, useRef } from "react";
import "./Messages.css";
import Message from "./Message.jsx";
import { useSelector } from "react-redux";

function Messages() {

  // ✅ Safe Redux selector (prevents undefined error)
  const userMessages = useSelector(
    (state) => state.userChat?.messages || []
  );

  // ✅ Current logged-in user
  const currentUser = sessionStorage.getItem("id");

  // ✅ Auto scroll reference
  const messagesEndRef = useRef(null);

  // ✅ Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [userMessages]);

  return (
    <div className="Messages">

      {userMessages.map((msg, index) => (
        <Message
          key={msg?._id || index}
          message={msg?.message}
          senderId={msg?.senderId || msg?.sender}
          isOwner={(msg?.senderId || msg?.sender) === currentUser}
          timestamp={msg?.time || msg?.timestamp || msg?.createdAt}
        />
      ))}

      {/* ✅ Scroll anchor */}
      <div ref={messagesEndRef} />

    </div>
  );
}

export default Messages;
