"use client";
import React, { useEffect, useState } from "react";
import ModelViewer from "./Model";
import { Environment } from "@react-three/drei";
import Spline from "@splinetool/react-spline";
import AiFunction from "./AiFunction";
import { useRouter } from "next/navigation";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Selection = (props) => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

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
  const FunctionRecordAnswer = () => {
    setIsRecording(true);
  };
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [voiceresponse, setvoiceresponse] = useState();
  useEffect(() => {
    if (voiceresponse) {
      if (voiceresponse.toLowerCase().includes("diet")) {
        handleSpeak("Redirecting for Diet Checkup", true);
        setTimeout(() => {
          router.push("/dietcheckup");
        }, 2000);
      } else if (voiceresponse.toLowerCase().includes("cancer")) {
        handleSpeak("Redirecting for Cancer Checkup", true);
        setTimeout(() => {
          router.push("/cancerdiagnose");
        }, 2000);
      }
    }
  }, [voiceresponse]);
  let pauseTimeout = 2000;
  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }
    if (isRecording) {
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
          console.log("final", finalTranscript);
          setvoiceresponse(finalTranscript);
          setIsRecording(false);
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
    }
  }, [isRecording]);
  const handleSpeak = async (textToSpeak, dontrecord) => {
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
      if (!dontrecord) {
        setTimeout(() => {
          FunctionRecordAnswer();
        }, 1000);
      }
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  return (
    <div style={{ position: "relative", paddingTop: "3rem" }}>
      <h3 className="headtext">Feel Free And Tell Me How You Are Feeling</h3>
      <span className="listenbox">
        <span></span>
      </span>
      <div
        onClick={() => {
          setvoiceresponse();
          handleSpeak(
            "Say Diet for Diet Checkup or Say Cancer for Cancer Checkup"
          );
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "center",
          // alignItems: "center",
          // width: "100vw",
          // height: "100vh",
        }}
      >
        {" "}
        <Spline
          style={{
            zIndex: "3",
            marginLeft: "0.9rem",
            // position: "absolute",

            // top: "70%",
            // transform: "translate(-50%,-50%)",

            // left: "50%",
          }}
          scene="https://prod.spline.design/yTtOKpWjLkRFa9NT/scene.splinecode"
        />
        {
          <span
            onClick={() => {
              setvoiceresponse();
              handleSpeak(
                "Say Diet for Diet Checkup or Say Cancer for Cancer Checkup"
              );
              // setTimeout(() => {
              //   setIsRecording(true);
              // }, 1000);
            }}
            style={{
              cursor: "pointer",
              color: "white",
              textAlign: "center",
              zIndex: 20,
            }}
          >
            Record again
          </span>
        }
      </div>

      <div className="selectdiv">
        <div
          onClick={() => {
            router.push("/dietcheckup");
          }}
          className="selectoutline"
          style={{ color: "white" }}
        >
          <span style={{ textAlign: "center" }}>Diet Checkup</span>
        </div>
        <div
          onClick={() => {
            router.push("/cancerdiagnose");
          }}
          className="selectfull"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <span style={{ textAlign: "center" }}>Cancer Checkup</span>{" "}
        </div>
      </div>
    </div>
  );
};

export default Selection;
