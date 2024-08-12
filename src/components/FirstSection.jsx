"use client";
import "./style.css";
import React, { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";
import Modal from "./Modal";

const FirstSection = (props) => {
  const audioRef = useRef(null);
  const [playcount, setPlayCount] = useState(0);
  const [modalvisible, setmodalvisible] = useState(true);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("proceedtype")
    ) {
      setmodalvisible(false);
    }
    audioRef.current = new Audio("/voice1.mp3"); // Ensure path and format are correct

    // Log the audio object for debugging
    console.log("Audio initialized:", audioRef.current);

    // Log any errors during the loading of the audio file
    audioRef.current.onerror = (event) => {
      console.error("Audio error:", event);
    };
  }, []);

  const handlePlay = () => {
    if (playcount > 0) {
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
      setPlayCount(playcount + 1);
    }
  };

  return (
    <>
      <Modal
        text={"Choose which way you want to proceed"}
        home={true}
        modalvisible={modalvisible}
        setmodalvisible={setmodalvisible}
        handlePlay={() => {
          handlePlay();
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          overflow: "hidden",
          flexDirection: "column",
          height: "110vh",
        }}
      >
        <h1
          className="headtext"
          style={{
            color: "white",
            width: "fit-content",
            justifyContent: "center",
            gap: "20rem",
            display: "flex",
            marginTop: "13rem",
            zIndex: "20",
          }}
        >
          Welcome To Diagnose Center
        </h1>

        <h3 className="headtext" style={{ color: "white", zIndex: "20" }}>
          Powered by Gemini
        </h3>
        <div
          style={{
            position: "absolute",
            opacity: "1",
            height: "100vh",
            width: "100vw",
            top: "55%",
            left: "51%",
            zIndex: 6,
            transform: "translate(-50%,-50%)",
          }}
          // onMouseOver={() => {
          //   handlePlay();
          // }}
        >
          <Spline scene="https://prod.spline.design/htX0ZKOKL738CT6B/scene.splinecode" />
        </div>
      </div>
    </>
  );
};

export default FirstSection;
