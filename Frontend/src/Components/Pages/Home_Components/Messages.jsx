import React, { useEffect, useMemo, useRef } from "react";
import "./Messages.css";
import Message from "./Message.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useVirtualizer } from "@tanstack/react-virtual";
import { deleteMessage, editMessage } from "../../../store/chatSlice.js";
import { socket } from "../../../socket.js";

function Messages() {
  const parentRef = useRef(null);
  const dispatch = useDispatch();
  const loadingMessages = useSelector(
    (state) => state.chat.loadingMessages
  );
  const messages = useSelector((state) => state.chat.messages);
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation,
  );

  const filteredMessages = useMemo(() => {
    return messages.filter(
      (msg) => msg.conversationId === activeConversation?._id,
    );
  }, [messages, activeConversation]);

  const currentUser = sessionStorage.getItem("id");

  useEffect(() => {
    const handleMessageDeleted = ({ messageId, conversationId }) => {
      if (conversationId === activeConversation?._id) {
        dispatch(deleteMessage({ messageId }));
      }
    };

    const handleMessageEdited = ({ messageId, text, conversationId }) => {
      if (conversationId === activeConversation?._id) {
        dispatch(editMessage({ messageId, text }));
      }
    };

    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("messageEdited", handleMessageEdited);

    return () => {
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("messageEdited", handleMessageEdited);
    };
  }, [activeConversation?._id, dispatch]);

  const rowVirtualizer = useVirtualizer({
    count: filteredMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  useEffect(() => {
    if (filteredMessages.length > 0) {
      rowVirtualizer.scrollToIndex(filteredMessages.length - 1);
    }
  }, [filteredMessages.length, rowVirtualizer]);

  if (loadingMessages) {
    return (
      <div className="Messages">
        <div className="Skeltoe-message-wrapper">
          {Array.from({ length: 12 }).map((_, index) => {
            const isOwner = index % 2 === 0;

            return (
              <div
                key={index}
                className={`Skeltoe-message-row ${
                  isOwner ? "owner" : "receiver"
                }`}
              >
                {!isOwner && (
                  <div className="Skeltoe-message-avatar"></div>
                )}

                <div className="Skeltoe-message-bubble"></div>

                {isOwner && (
                  <div className="Skeltoe-message-avatar"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="Messages" ref={parentRef}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const msg = filteredMessages[virtualRow.index];

          return (
            <div
              key={msg._id}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Message
                messageId={msg._id}
                senderId={msg?.senderId || msg?.sender}
                isOwner={(msg?.senderId || msg?.sender) === currentUser}
                message={msg?.isDeleted ? "This message was deleted" : (msg?.message || msg?.text)}
                timestamp={msg?.timestamp || msg?.createdAt}
                isDeleted={msg?.isDeleted}
                isEdited={msg?.isEdited}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
