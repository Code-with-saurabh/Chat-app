import React, { useState, useEffect, useRef } from "react";

import "./Sidebar.css";
import Navbar from "./Navbar.jsx";
import Search from "./Search.jsx";
import Chats from "./Chats.jsx";
// import IMGP from'../../../assets/img/profile.jpg';
// import axios from 'axios';
import { useVirtualizer } from "@tanstack/react-virtual";
import axios from "../../../Utilities/axios.js";
import { useSelector } from "react-redux";

function Sidebar() {
  const parentRef = useRef(null);
  // const [username, setUsersname] = useState("Saurabh");
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Hello");

  const conversationUnread = useSelector(
    (state) => state.notification.conversationUnread,
  );

  const handlaUsers = async () => {
    try {
      const res = await axios.get("/users/allUsers");
      console.log("%cUSER : ", "color:lightblue", res.data);
      setUsers(res.data.data || []);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };
  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 5,
  });

  useEffect(() => {
    handlaUsers();
  }, []); // i wnat that this one only run once in whole page on user login and user logout // user ke massage ka bad me dekhege // vesebhi vo might be dusre route se aayega
  //this one may be only work once when new user added

  function setUsernamforChat(e) {
    // sessionStorage.setItem("Username",username);
    // console.log(e);
  }
  return (
    <div className="Sidebar">
      <Navbar />
      <Search />

      <div ref={parentRef} style={{ overflowY: "auto", flex: 1 }}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
            width: "100%",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const user = users[virtualRow.index];
            if (!user) return null;
            return (
              <div
                key={user.id}
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
                <Chats
                  username={user.username}
                  img={user.profileImage}
                  userId={user.id}
                  message={user.lastMessage?.text} // 🔥 latest message
                  unreadCount={conversationUnread[user.conversationId] || 0}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Sidebar);
