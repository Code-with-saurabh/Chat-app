import React, { useState } from 'react';
import './Message.css';
import { useSelector } from 'react-redux';
import Avatar from '../../common/Avatar.jsx';

function Message({ message, senderId, isOwner, timestamp }) {
  const profileImage = sessionStorage.getItem("profileImage");
  const userData = useSelector(
    (state) => state.secondUser || {}
  );

  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    if (isNaN(messageDate)) {
      return "Invalid time";
    }
    let hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesFormatted} ${ampm}`;
  };

  const avatarSrc = isOwner ? profileImage : userData.profileImage;
  const avatarName = isOwner
    ? sessionStorage.getItem("Username")
    : userData.username;

  return (
    <div className={isOwner ? "Owner" : "Message"}>
      <div className="messageInfo">
        <Avatar src={avatarSrc} alt={avatarName} size={36} />
        <span className="timestamp">
          {timestamp ? formatTimestamp(timestamp) : ""}
        </span>
      </div>
      <div className="messageContenet">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
