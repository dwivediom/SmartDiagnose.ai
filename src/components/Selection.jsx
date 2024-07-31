"use client";
import React from "react";
import ModelViewer from "./Model";
import { Environment } from "@react-three/drei";
import Spline from "@splinetool/react-spline";
import AiFunction from "./AiFunction";

const Selection = () => {
  return (
    <div style={{ position: "relative" }}>
      <h3 className="headtext">Feel Free And Tell Me How You Are Feeling</h3>
      <span className="listenbox">
        <span></span>
      </span>
      <div
        style={{
          borderRadius: "24px",
          background: " rgb(0, 143, 143)",
          // width: "100px",
          // height: "30px",
          position: "absolute",
          left: "50.1%",
          top: "95%",
          color: "white",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: "100",
          alignItems: "center",
          boxShadow: "0 0 5px rgba(0, 255, 255, 0.389)",
          transform: "translate(-50%,-50%)",
        }}
      >
        <AiFunction />
      </div>
      <Spline
        style={{
          zIndex: "3",
          position: "absolute",
          width: "100vw",
          height: "100vh",
          top: "70%",
          transform: "translate(-50%,-50%)",

          left: "51%",
        }}
        scene="https://prod.spline.design/yTtOKpWjLkRFa9NT/scene.splinecode"
      />
    </div>
  );
};

export default Selection;
