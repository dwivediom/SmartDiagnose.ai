"use client";
import "./style.css";
import React from "react";
import Spline from "@splinetool/react-spline";
const FirstSection = (props) => {
  // useEffect(() => {}, []);
  return (
    <>
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
        {/* <h1
          style={{
            color: "white",
            width: "100%",
            justifyContent: "center",
            gap: "20rem",
            display: "flex",
          }}
        >
          <span>Welcome</span>
          <span>Center</span>
        </h1> */}
        <h1
          className="headtext"
          style={{
            color: "white",
            width: "100%",
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
        {/* <span
          className="top"
          style={{
            zIndex: 10,
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            position: "absolute",
            top: "47.4%",
            left: "52.5%",
            transform: "translate(-50%,-50%)",
            fontFamily: "Work Sans, sans-serif",
          }}
        >
          To <span className="aqcolor">Diagnose</span>
        </span>{" "} */}
        <div
          style={{
            position: "absolute",
            opacity: "1",
            height: "100vh",
            width: "100vw",
            top: "55%",
            left: "51%",
            zIndex: 5,
            transform: "translate(-50%,-50%)",
          }}
        >
          <Spline scene="https://prod.spline.design/htX0ZKOKL738CT6B/scene.splinecode" />
        </div>
      </div>
    </>
  );
};

export default FirstSection;
