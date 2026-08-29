import React, { useEffect, Suspense, lazy } from "react";
import "./Home.css";
import { socket } from "../../socket.js";
import SidebarSkeleton from "../Skeleton/SidebarSkeleton.jsx";
import ChatSkeleton from "../Skeleton/ChatSkeleton.jsx";
import { addNotification } from "../../store/notificationSlice.js";
import { useDispatch, useSelector } from "react-redux";

const Chat = lazy(() => import("./Home_Components/Chat.jsx"));
const Sidebar = lazy(() => import("./Home_Components/Sidebar.jsx"));

function Home() {
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
        </Suspense>
        <Suspense fallback={<ChatSkeleton />}>
          <Chat />
        </Suspense>
      </div>
    </div>
  );
}

export default React.memo(Home);
