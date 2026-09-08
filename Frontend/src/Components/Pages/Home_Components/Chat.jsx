import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import Messages from "./Messages.jsx";
import Input from "./input.jsx";
import { useSelector, useDispatch } from "react-redux";
import { markConversationRead } from "../../../store/notificationSlice.js";
import { setActiveConversation, setMessages, updateActiveUserStatus } from "../../../store/chatSlice.js";
import { socket } from "../../../socket.js";
import axios from "../../../Utilities/axios.js";
import { ENDPOINTS } from "../../../constants/api.js";
import Avatar from "../../common/Avatar.jsx";

function Chat() {
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const unreadCount = useSelector(
    (state) => state.notification.unreadCount
  );
  const activeConversation = useSelector(
    (state) => state.chat.activeConversation,
  );
  const currentUser = sessionStorage.getItem("id");

  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(markConversationRead(activeConversation._id));
    }
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowNotifications(false);
  }, [activeConversation?._id]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${ENDPOINTS.MESSAGES.SEARCH(activeConversation._id)}?q=${encodeURIComponent(query)}`
        );
        setSearchResults(res.data.data || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);
  };

  const fetchNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.MESSAGES.NOTIFICATIONS);
      setNotifications(res.data.data?.notifications || []);
    } catch (err) {
      console.error("Notifications error:", err);
    } finally {
      setNotifLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(ENDPOINTS.MESSAGES.MARK_READ);
      dispatch(markConversationRead("all"));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleTyping = ({ senderId }) => {
      if (senderId === activeConversation?.username) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === activeConversation?.username) {
        setIsTyping(false);
      }
    };

    const handleUserOnline = ({ userId }) => {
      dispatch(updateActiveUserStatus({ userId, isOnline: true }));
    };

    const handleUserOffline = ({ userId, lastSeen }) => {
      dispatch(updateActiveUserStatus({ userId, isOnline: false, lastSeen }));
    };

    socket.on("userTyping", handleTyping);
    socket.on("userStopTyping", handleStopTyping);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("userTyping", handleTyping);
      socket.off("userStopTyping", handleStopTyping);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [activeConversation?.username, dispatch]);

  const getLastSeen = (lastSeen) => {
    if (!lastSeen) return "";

    const date = new Date(lastSeen);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `last seen today at ${time}`;
    }

    if (isYesterday) {
      return `last seen yesterday at ${time}`;
    }

    return `last seen ${date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    })}`;
  };

  return (
    <div className="Chat">
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
          <span className="nameP-text">
            {activeConversation?.groupName ||
              activeConversation?.username ||
              "Chat"}
          </span>
          {(activeConversation?.username) &&
            (activeConversation?.online) ?
            <span className="online-Status">
              {isTyping ? "typing..." : "online"}
            </span> :
            <span className="online-Status">{getLastSeen(activeConversation?.lastSeen)}</span>
          }
        </span>

        <div className="ChatIcon">
          <span className="searchBtn" onClick={() => setShowSearch(!showSearch)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </span>

          <span className="notification" onClick={toggleNotifications} style={{cursor:"pointer"}}>
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

          {showNotifications && (
            <div className="notifPanel">
              <div className="notifHeader">
                <span>Notifications</span>
                <button onClick={markAllRead}>Mark all read</button>
              </div>
              <div className="notifList">
                {notifLoading ? (
                  <p className="notifEmpty">Loading...</p>
                ) : notifications.length === 0 ? (
                  <p className="notifEmpty">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n._id} className={`notifItem ${!n.isRead ? "unread" : ""}`}>
                      <Avatar src={n.sender?.ProfileImage} alt={n.sender?.Username} size={32} />
                      <div className="notifContent">
                        <span className="notifSender">{n.sender?.Username}</span>
                        <span className="notifType">{n.type === "message" ? "sent you a message" : "sent a friend request"}</span>
                        <span className="notifTime">{new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="searchBar">
          <input
            type="text"
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          <span className="searchClose" onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchResults([]); }}>✕</span>
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((msg) => (
                <div key={msg._id} className="searchResultItem">
                  <span className="searchResultSender">{msg.sender === currentUser ? "You" : activeConversation?.username}</span>
                  <span className="searchResultText">{msg.text}</span>
                  <span className="searchResultTime">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!activeConversation ? (
        <div className="Chat noChatSelected">
          <p>Select a user to start chatting...</p>
        </div>
      ) : (
        <>
          <Messages />
          <Input />
        </>
      )}
    </div>
  );
}

export default Chat;
