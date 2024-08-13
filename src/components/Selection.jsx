"use client";
import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import AiFunction from "./AiFunction";
import "./style.css";
import { useRouter } from "next/navigation";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;

const Selection = (props) => {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  const [speechRecognitionSupported, setSpeechRecognitionSupported] =
    useState(null); // null or boolean

  const {
    transcript,
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    // sets to true or false after component has been mounted
    setSpeechRecognitionSupported(browserSupportsSpeechRecognition);
  }, [browserSupportsSpeechRecognition]);

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

  const [recognitionInstance, setRecognitionInstance] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (transcript) {
        if (transcript.toLocaleLowerCase().includes("diet")) {
          handleSpeak("Redirecting for Diet Checkup", true, "diet");
        } else if (transcript.toLocaleLowerCase().includes("cancer")) {
          handleSpeak("Redirecting for Cancer Checkup", true, "cancer");
        }
      }
    }
  }, [transcript]);

  const handleSpeak = async (textToSpeak, dontrecord, redirectval) => {
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
      utterance.onend = () => {
        if (redirectval == "diet") {
          router.push("/Dietcheckup");
          return;
        } else if (redirectval == "cancer") {
          router.push("/Cancercheckup");
          return;
        }

        if (!dontrecord) {
          SpeechRecognition.startListening();
        }
      };
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  return (
    <div
      onMouseEnter={() => {
        handleSpeak(
          "Say Diet for Diet Checkup or Say Cancer for Cancer Checkup",
          false
        );
      }}
      style={{ position: "relative", paddingTop: "3rem", height: "100vh" }}
    >
      <h3 className="selecthead">Feel Free And Tell Me How You Are Feeling</h3>
      {listening && (
        <p style={{ textAlign: "center", color: "white" }}>
          Listeing... Tap on model face to Re-record
        </p>
      )}
      <span className="listenbox">
        <span></span>
      </span>
      <div
        onClick={() => {
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
            router.push("/Dietcheckup");
          }}
          className="selectoutline"
          style={{ color: "white" }}
        >
          <span style={{ textAlign: "center" }}>Diet Checkup</span>
        </div>
        <div
          onClick={() => {
            router.push("/Cancercheckup");
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
