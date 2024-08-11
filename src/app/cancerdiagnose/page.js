"use client";
import Spline from "@splinetool/react-spline";
import "./page.css";
import React, { useEffect, useState } from "react";
import {
  breastcancersymptoms,
  colorectalsymptoms,
  lungcancersymptoms,
  prostatesymptoms,
  stomachsymptoms,
} from "../symptoms";
import MicButton from "@/components/Listening";
import { Capitalize, get_prompt_response } from "../../../utils/modle";
import Navbar from "@/components/Navbar";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Cancerdiagnose = () => {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(voiceresponse);
      if (!selectedcancertype && !voiceresponse) {
        handleSpeak(
          "Say Name of cancer to diagnose like Breast Cancer, Lung Cancer, Prostate Cancer, Colorectal Cancer or Stomach Cancer"
        );
      }
      if (voiceresponse) {
        if (voiceresponse.toLocaleLowerCase().includes("breast")) {
          setselectedcancertype("breast");
          return;
        } else if (voiceresponse.toLocaleLowerCase().includes("lung")) {
          setselectedcancertype("lung");
          return;
        } else if (voiceresponse.toLocaleLowerCase().includes("stomach")) {
          setselectedcancertype("stomach");
          return;
        } else if (voiceresponse.toLocaleLowerCase().includes("colorectal")) {
          setselectedcancertype("colorectal");
          return;
        } else if (voiceresponse.toLocaleLowerCase().includes("prostate")) {
          setselectedcancertype("prostate");
          return;
        }
      }
      return handleStopSpeak();
    }
  }, [voiceresponse]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (selectedcancertype) {
        handleSpeak(
          `Let's Diagnose ${selectedcancertype} Cancer Say Start to Start the checkup`
        );
        setTimeout(() => {
          if (!diagnosestart) {
            handleSpeak("Please Say Start");
          }
        }, 2000);
      }
    }
  }, [selectedcancertype]);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
            if (diagnosestart) {
              setCanceQue((prev) => {
                const newQuestions = [...prev];
                newQuestions[currentindex].answer = finalTranscript;
                return newQuestions;
              });
              setcurrentindex((prev) => prev + 1);
              console.log(CancerQuestionnaire);
              setIsRecording(false);
              if (pauseTimer) clearTimeout(pauseTimer);
            } else if (
              !diagnosestart &&
              finalTranscript.toLocaleLowerCase().includes("start")
            ) {
              setdiagnosestart(true);
              setIsRecording(false);
            } else {
              setvoiceresponse(finalTranscript);
              setIsRecording(false);
            }
          }, pauseTimeout);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
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
    }
  }, [isRecording, currentindex]);

  const FunctionRecordAnswer = () => {
    setIsRecording(true);
  };

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
      }, 1000);
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
    if (typeof window !== "undefined") {
      if (diagnosestart) {
        console.log(
          currentindex,
          CancerQuestionnaire,
          CancerQuestionnaire.length
        );
        if (currentindex < CancerQuestionnaire.length) {
          handleSpeak(CancerQuestionnaire[currentindex].question);
        } else {
          if (localStorage.getItem("proceedtype") === "voice") {
            handleSubmitToGemeni();
          }
          setreadysubmit(true);
        }
      } else if (!diagnosestart) {
        handleStopSpeak();
        setIsRecording(false);
      }
    }
  }, [currentindex, diagnosestart, CancerQuestionnaire]);

  useEffect(() => {
    switch (selectedcancertype) {
      case "breast":
        setCanceQue(breastcancersymptoms);
        break;
      case "lung":
        setCanceQue(lungcancersymptoms);
        break;
      case "colorectal":
        setCanceQue(colorectalsymptoms);
        break;
      case "stomach":
        setCanceQue(stomachsymptoms);
        break;
      case "prostate":
        setCanceQue(prostatesymptoms);
        break;
      default:
        break;
    }
  }, [selectedcancertype]);

  const handleeditans = () => {
    const newData = [...CancerQuestionnaire];
    newData[editansid].answer = editansval;
    setCanceQue(newData);
    seteditans(false);
  };

  const handleSubmitToGemeni = async () => {
    const payload = {
      prompt: CancerQuestionnaire.map(
        (question) =>
          `Answer as Yes or No \n\nQ. ${question.question} \n\nA. ${question.answer} \n\n`
      ).join("\n\n"),
      task_type: "text_completion",
      model: "gemini-medium",
    };

    try {
      const response = await get_prompt_response(payload);
      console.log(response);
      setresultbygemini(response);
      handleSpeak(response);
    } catch (error) {
      console.error("Error while submitting to Gemini", error);
    }
  };

  const handleResultbyGemini = (e) => {
    setresultbygemini(e.target.value);
  };

  return (
    <>
      <Navbar />

      <div className="col-md-12">
        <div className="p-3">
          <div className="p-3 d-flex justify-content-center align-items-center">
            <div style={{ width: 500, height: 400 }}>
              <Spline scene="https://prod.spline.design/GMNjNNIVET7fsrOW/scene.splinecode" />
            </div>
          </div>

          {!diagnosestart ? (
            <div className="d-flex justify-content-center align-items-center mt-4">
              <MicButton
                onClick={() => FunctionRecordAnswer()}
                recording={isRecording}
              />
            </div>
          ) : (
            <>
              <div className="pt-4 p-2 p-md-3">
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-2 text-uppercase fw-bold">Questions</h6>
                  </div>
                  <div className="p-2">
                    {CancerQuestionnaire.map((question, index) => (
                      <div
                        key={index}
                        className={`mb-2 p-3  rounded-3 ${
                          currentindex > index
                            ? "bg-light-success"
                            : currentindex === index
                            ? "bg-light-primary"
                            : "bg-light"
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="d-flex justify-content-start flex-column">
                              <div className="d-flex align-items-center">
                                <span className="fs-5 fw-bold me-2">
                                  {index + 1}.
                                </span>
                                <span className="fs-6 fw-bold">
                                  {Capitalize(question.question)}
                                </span>
                              </div>
                              {question.answer ? (
                                <div className="d-flex align-items-center pt-2">
                                  <span className="fs-6 fw-bold text-muted">
                                    Answer:{" "}
                                    <span className="text-dark">
                                      {Capitalize(question.answer)}
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                <div className="d-flex align-items-center pt-2">
                                  <span className="fs-6 fw-bold text-muted">
                                    Waiting for answer...
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {question.answer && (
                            <div
                              className="d-flex align-items-center cursor-pointer text-primary"
                              onClick={() => {
                                seteditans(true);
                                seteditansid(index);
                              }}
                            >
                              Edit
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {readysubmit && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="btn btn-primary btn-block"
                      onClick={handleSubmitToGemeni}
                    >
                      Submit to Gemini
                    </button>
                  </div>
                )}
              </div>

              {editans && (
                <div className="mt-4">
                  <h6 className="text-uppercase fw-bold">Edit Answer</h6>
                  <textarea
                    className="form-control"
                    value={editansval}
                    onChange={(e) => seteditansval(e.target.value)}
                    rows="3"
                  ></textarea>
                  <div className="mt-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleeditans}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {resultbygemini && (
                <div className="mt-4">
                  <h6 className="text-uppercase fw-bold">Result by Gemini</h6>
                  <textarea
                    className="form-control"
                    value={resultbygemini}
                    onChange={handleResultbyGemini}
                    rows="5"
                    readOnly
                  ></textarea>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cancerdiagnose;
