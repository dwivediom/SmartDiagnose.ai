"use client";
import React, { useEffect, useState } from "react";
import "./page.css";
import {
  breastcancersymptoms,
  colorectalsymptoms,
  lungcancersymptoms,
  prostatesymptoms,
  stomachsymptoms,
} from "../symptoms";
import { Capitalize, get_prompt_response } from "../../../utils/modle";
import Navbar from "@/components/Navbar";
import Cancerchat from "@/components/Cancerchat";

const Cancercheckup = () => {
  const [NewSpeechRecognition, setNewSpeechRecognition] = useState();

  const [CancerQuestionnaire, setCanceQue] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = 3000; // 3 seconds
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [voiceresponse, setvoiceresponse] = useState("");
  const [selectedcancertype, setselectedcancertype] = useState("");
  const [currentindex, setcurrentindex] = useState(0);
  const [voices, setVoices] = useState([]);
  const [femaleVoice, setfemaleVoice] = useState(null);
  const [diagnosestart, setdiagnosestart] = useState(false);
  const [resultbygemini, setresultbygemini] = useState(null);
  const [readysubmit, setreadysubmit] = useState(false);
  const [editans, seteditans] = useState(false);
  const [editansval, seteditansval] = useState("");
  const [editansid, seteditansid] = useState();

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          border: "2px solid grey",
          overflow: "hidden",
          // flexDirection,
        }}
      >
        <Cancerchat />
      </div>
    </>
  );
};

export default Cancercheckup;
