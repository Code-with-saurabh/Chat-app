import React, { Suspense, lazy, useEffect } from "react";

import "./Home.css";
// import Sidebar from "./Home_Components/Sidebar.jsx";
// import Chat from './Home_Components/Chat.jsx';
const Chat = lazy(() => import("./Home_Components/Chat.jsx"));
const Sidebar = lazy(() => import("./Home_Components/Sidebar.jsx"));
import { socket } from "../../socket.js";
import SidebarSkeleton from "../Skeleton/SidebarSkeleton.jsx";
import ChatSkeleton from "../Skeleton/ChatSkeleton.jsx";
import { addNotification } from "../../store/notificationSlice.js";

import { useDispatch, useSelector } from "react-redux";

// import { useSelector } from 'react-redux';
// Home_Components
// import io from 'socket.io-client';
function Home() {
  // const socket = io('http://localhost:5000');


  const activeConversation = useSelector(
    (state) => state.chat.activeConversation
  );
  const isChatOpen = Boolean(activeConversation);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("newNotification", (data) => {
      dispatch(addNotification(data));
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);


  return (
    <div className="Home">
      <div className={`container ${isChatOpen ? "chat-open" : ""}`}>
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />

          {/* <Chat /> */}
        </Suspense>
        <Suspense fallback={<ChatSkeleton />}>
          <Chat />
        </Suspense>
      </div>
    </div>
  );
}

export default React.memo(Home);
