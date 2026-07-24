import React from "react";
import "./HomeSkeleton.css";

export default function HomeSkeleton() {
  return (
    <div className="Home">
      <div className="container">

        {/* ========== SIDEBAR SKELETON ========== */}
        <div className="Sidebar">

          {/* Navbar Skeleton */}
          <div className="navSk">
            <div className="sk logoSk"></div>
            <div className="sk profileSk"></div>
          </div>

          {/* Search Skeleton */}
          <div className="searchSkWrapper">
            <div className="sk searchSk"></div>
          </div>

          {/* Chat List Skeleton */}
          <div className="chatListSk">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="chatItemSk" key={i}>
                <div className="sk avatarSk"></div>
                <div className="textSk">
                  <div className="sk nameSk"></div>
                  <div className="sk msgSk"></div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ========== CHAT SKELETON ========== */}
        <div className="Chat">

          {/* Chat Header */}
          <div className="chatHeaderSk">
            <div className="sk chatTitleSk"></div>
          </div>

          {/* Messages */}
          <div className="messagesSk">
            {Array.from({ length: 10 }).map((_, i) => {
              const isOwner = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={isOwner ? "OwnerSk" : "MessageSk"}
                >
                  <div className="sk avatarMsgSk"></div>
                  <div className="sk bubbleSk"></div>
                </div>
              );
            })}
          </div>

          {/* Input Skeleton */}
          <div className="inputSkWrapper">
            <div className="sk inputSk"></div>
          </div>

        </div>

      </div>
    </div>
  );
}