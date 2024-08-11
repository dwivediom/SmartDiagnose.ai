"use client";
import React, { useEffect, useState } from "react";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const AiFunction = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const pauseTimeout = 3000; // 3 seconds

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let pauseTimer = null;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment + " ";
        }
      }

      setTranscript(finalTranscript);

      // Clear and reset the pause timer
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        recognition.stop();
      }, pauseTimeout);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (pauseTimer) clearTimeout(pauseTimer);
    };

    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    setRecognitionInstance(recognition);

    return () => {
      recognition.stop();
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [isRecording]);
  const handleRecordButtonClick = () => {
    setTranscript(""); // Clear previous transcript
    setIsRecording((prev) => !prev);
  };

  return (
    <div>
      {/* <button onClick={handleRecordButtonClick}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>Transcript: {transcript}</p>{" "}   */}
    </div>
  );
};

export default AiFunction;
