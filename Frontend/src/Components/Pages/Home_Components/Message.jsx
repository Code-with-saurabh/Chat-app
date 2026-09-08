import React, { useState } from 'react';
import './Message.css';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMessage, editMessage } from '../../../store/chatSlice.js';
import { socket } from '../../../socket.js';
import Avatar from '../../common/Avatar.jsx';

function Message({ message, senderId, isOwner, timestamp, isDeleted, isEdited, messageId }) {
  const profileImage = sessionStorage.getItem("profileImage");
  const userData = useSelector(
    (state) => state.secondUser || {}
  );
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);

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

  const handleDelete = () => {
    dispatch(deleteMessage({ messageId }));
    socket.emit("deleteMessage", { messageId });
    setShowMenu(false);
  };

  const handleEdit = () => {
    if (editText.trim() && editText !== message) {
      dispatch(editMessage({ messageId, text: editText }));
      socket.emit("editMessage", { messageId, text: editText });
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditText(message);
    }
  };

  const avatarSrc = isOwner ? profileImage : userData.profileImage;
  const avatarName = isOwner
    ? sessionStorage.getItem("Username")
    : userData.username;

  return (
    <div className={isOwner ? "Owner" : "Message"}>
      <div className="messageRow">
        <Avatar src={avatarSrc} alt={avatarName} size={36} />
        <div className="messageContenet">
          {isDeleted ? (
            <div className="msgBubble deletedBubble">
              <p className="deletedMsg">{message}</p>
            </div>
          ) : isEditing ? (
            <div className="editInput">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEdit}
                autoFocus
              />
            </div>
          ) : (
            <div className="msgBubble">
              <p>{message}</p>
              {isEdited && <span className="editedTag">edited</span>}
            </div>
          )}
          {isOwner && !isDeleted && (
            <div className="msgActions">
              <button className="msgMenuBtn" onClick={() => setShowMenu(!showMenu)}>⋮</button>
              {showMenu && (
                <div className="msgMenu">
                  <button onClick={() => { setIsEditing(true); setShowMenu(false); }}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <span className="timestamp">
        {timestamp ? formatTimestamp(timestamp) : ""}
      </span>
    </div>
  );
}

export default Message;
