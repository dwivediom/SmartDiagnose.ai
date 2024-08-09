"use client";
import Spline from "@splinetool/react-spline";
import "./page.css";
import React, { useEffect, useState } from "react";
import { breastcancersymptoms } from "../symptoms";
import { Color } from "three";
import MicButton from "@/components/Listening";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const canceldiagnose = () => {
  const [breastCancerQuestionnaire, setbreastCanceQue] =
    useState(breastcancersymptoms);
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = 2000; // 2 seconds
  const [recognitionInstance, setRecognitionInstance] = useState(null);

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

      // Clear and reset the pause timer
      if (pauseTimer) clearTimeout(pauseTimer);
      pauseTimer = setTimeout(() => {
        recognition.stop();
        let temp = breastCancerQuestionnaire;
        temp[currentindex].answer = finalTranscript;
        setbreastCanceQue(temp);
        setIsRecording(false);
      }, pauseTimeout);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      setcurrentindex(currentindex + 1);
      console.log(breastCancerQuestionnaire);
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
  const FunctionRecordAnswer = () => {
    setIsRecording(true);
  };
  const [currentindex, setcurrentindex] = useState(0);
  const [voices, setVoices] = useState([]);
  const [femaleVoice, setfemaleVoice] = useState();

  const loadVoices = () => {
    return new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }

      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    });
  };
  const [diagnosestart, setdiagnosestart] = useState(false);

  const handleSpeak = async (textToSpeak) => {
    if ("speechSynthesis" in window) {
      const voices = await loadVoices();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Veena") ||
          voice.name.toLowerCase().includes("female") ||
          voice.gender === "female"
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.lang = "en-IN";
      window.speechSynthesis.speak(utterance);
      setTimeout(() => {
        FunctionRecordAnswer();
      }, 2000);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  const handleStopSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  const handleStopListening = (recognition) => {
    if (recognition && typeof recognition.stop === "function") {
      recognition.stop();
    } else {
      alert("Speech recognition is not active or supported in your browser.");
    }
  };
  useEffect(() => {
    if (diagnosestart) {
      if (currentindex <= breastCancerQuestionnaire.length) {
        handleSpeak(breastCancerQuestionnaire[currentindex].question);
      }
    } else if (!diagnosestart) {
      handleStopSpeak();
      setIsRecording(false);
    }
  }, [femaleVoice, currentindex, diagnosestart]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",

        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="chatmainbox" style={{ width: "65%" }}>
        <h2>Be relax and we will see how you are feeling! 😇</h2>

        <div>
          <h4 style={{ color: "white", textAlign: "center" }}>
            {" "}
            Select cancer type to diagnose
          </h4>
          <div className="cancertype">
            <div>Breast Cancer</div>
            <div>Lung Caner</div>
            <div>Colorectal Cancer</div>
            <div>Prostate Cancer</div>
            <div>Stomach Cancer</div>
          </div>
        </div>
        {/* <button
          className="startdiagnosebtn"
          onClick={() => {
            if (diagnosestart) {
              setdiagnosestart(false);
            } else {
              setdiagnosestart(true);
            }
          }}
        >
          {diagnosestart ? "Pause" : "Start"} Diagnose
        </button> */}
        {diagnosestart && (
          <button
            className="restartdiagnosebtn"
            onClick={() => {
              setcurrentindex(0);
              setbreastCanceQue(breastcancersymptoms);
            }}
          >
            Restart
          </button>
        )}

        {diagnosestart &&
          breastCancerQuestionnaire
            .filter((q, id) => id <= currentindex)
            .map((item, index) => {
              return (
                <>
                  <div className="chatquebox">
                    <p className="chatque">{item.question}</p>
                  </div>
                  <div className="chatansbox">
                    {isRecording && "recording"}{" "}
                    <p className="chatans">{item.answer}</p>
                  </div>
                </>
              );
            })}
      </div>
      <div style={{ width: "33%", position: "relative" }}>
        <Spline
          style={{
            zIndex: "3",
            position: "absolute",
            width: "100%",
            // height: "100",
            top: "70%",
            transform: "translate(-50%,-50%)",

            left: "51%",
          }}
          scene="https://prod.spline.design/yTtOKpWjLkRFa9NT/scene.splinecode"
        />
        <p style={{ color: "white" }}>
          {isRecording ? <MicButton isListening={true} /> : ""}
        </p>
      </div>
    </div>
  );
};

export default canceldiagnose;
