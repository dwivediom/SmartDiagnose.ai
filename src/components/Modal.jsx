import React, { useState } from "react";
import "./style.css";

const Modal = (props) => {
  return (
    <div
      style={{
        display: !props.modalvisible && "none",
      }}
      className="modalbox"
    >
      <div className="modal">
        <p>{props.text}</p>

        {props.home && (
          <div>
            <button
              onClick={() => {
                props.setmodalvisible(false);
                localStorage.setItem("proceedtype", "voice");
                props.handlePlay();
              }}
            >
              Voice
            </button>
            <button
              onClick={() => {
                props.setmodalvisible(false);
                localStorage.setItem("proceedtype", "text");
                props.handlePlay();
              }}
            >
              Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
