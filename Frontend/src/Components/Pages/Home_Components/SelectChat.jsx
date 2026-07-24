import React from "react";
import "./SelectChat.css";

const SelectChat = () => {
  return (
    <div className="selectChat">
      <div className="left">
        <div className="cat">
          <div className="ears1"></div>

          <div className="head1">
            <div className="eyes1"></div>
            <div className="nose1"></div>
          </div>

          <div className="body1">
            <div className="left-paw1"></div>
            <div className="right-paw1"></div>
          </div>

          <div className="tail1"></div>

          <div className="PRlaptop">
            <div className="PRscreen"></div>
            <div className="PRkeyboard"></div>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="dog">
          <div className="ears2"></div>

          <div className="head2">
            <div className="eyes2"></div>
            <div className="nose2"></div>
          </div>

          <div className="body2">
            <div className="left-paw2"></div>
            <div className="right-paw2"></div>
          </div>

          <div className="tail2"></div>

          <div className="ORlaptop">
            <div className="ORscreen"></div>
            <div className="ORkeyboard"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectChat;