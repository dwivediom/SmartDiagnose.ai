import React, { useState } from "react";
import "./style.css"; // Import CSS from an external file

const MicButton = (props) => {
  // Use state to track whether the button is in the "listening" state
  const [isListening, setIsListening] = useState(props.isListening);

  // Toggle the "listening" state when the button is clicked
  const handleMicClick = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="container">
      <button
        type="button"
        className={`mic ${isListening ? "listening" : ""}`}
        onClick={handleMicClick}
      >
        <i className="fa fa-microphone"></i>
      </button>
    </div>
  );
};

export default MicButton;
