import React, { useEffect, useRef } from "react";
import "./Messages.css";
import Message from "./Message.jsx";
import { useSelector } from "react-redux";

function Messages() {

  const messages = useSelector(
    (state) => state.chat.messages
  );

  const userMessages = useSelector(
    (state) => state.userChat?.messages || []
  );
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation
  );
  const filteredMessages = messages.filter(
    msg => msg.conversationId === activeConversation?._id
  );
  // ✅ Safe Redux selector (prevents undefined error)

  // ✅ Current logged-in user
  const currentUser = sessionStorage.getItem("id");

  // ✅ Auto scroll reference
  const messagesEndRef = useRef(null);

  // ✅ Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [filteredMessages]);

  return (
    <div className="Messages">

      {filteredMessages.map((msg, index) => (
        <Message
          key={msg?._id || index}
          senderId={msg?.senderId || msg?.sender}
          isOwner={(msg?.senderId || msg?.sender) === currentUser}
          message={msg?.message || msg?.text}
          senderProfileImage={msg.senderProfileImage}
          timestamp={msg?.timestamp || msg?.createdAt}
        />
      ))}

      {/* ✅ Scroll anchor */}
      <div ref={messagesEndRef} />

    </div>
  );
}

export default Messages;
