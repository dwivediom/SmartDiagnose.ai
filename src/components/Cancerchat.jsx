"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./style.css";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Spline from "@splinetool/react-spline";
import {
  breastcancersymptoms,
  colorectalsymptoms,
  lungcancersymptoms,
  prostatesymptoms,
  stomachsymptoms,
} from "@/app/symptoms";
import { get_prompt_response, parseJsonString } from "../../utils/modle";
// const SpeechRecognition2 =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
  let SpeechRecognition2 ;

  if (typeof window !== 'undefined') {
    SpeechRecognition2  = window.SpeechRecognition || window.webkitSpeechRecognition;
  }
  
  


const Cancerchat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = 2000; // 3 seconds
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [voiceresponse, setvoiceresponse] = useState();
  const [selectedcancertype, setselectedcancertype] = useState();
  const [currentindex, setcurrentindex] = useState(0);
  const [voices, setVoices] = useState([]);
  const [femaleVoice, setfemaleVoice] = useState(null);
  const [diagnosestart, setdiagnosestart] = useState(false);
  const [resultbygemini, setresultbygemini] = useState();
  const [readysubmit, setreadysubmit] = useState(false);
  const [editans, seteditans] = useState(false);
  const [editansval, seteditansval] = useState("");
  const [editansid, seteditansid] = useState();
  const [cancerQuestions, setcanerQuestions] = useState([]);

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
  const [speaking, setspeaking] = useState(false);
  const [readytostart, setreadytostart] = useState(false);
  const [tcount, settcount] = useState(0);

  const [answerlisten, setanswerlisten] = useState(false);

  const Submit = async () => {
    !speaking && handleSpeak("Generating Report", true, false);
    let temp1 = `i will give question and answer of patient you have to predict the chance of ${selectedcancertype} cancer based on symtomps described by the patient and you have to give your answer between 1% to 100% range and
and give the reason why and how to come to that range 
Expected output example: {"chances":"X% to Y%","reason":"give how symptoms related to given cancer" }

 Do not add any conversational words in the response, keep verbosity as low as possible, just return the required dictionary
`;

    let temp2 = JSON.stringify(cancerQuestions);
    let finalstr = temp1 + temp2;
    const data = await get_prompt_response(finalstr);

    const finalobj = parseJsonString(data);
    console.log(finalobj, "finalobj");
    setresultbygemini(finalobj);
    handleSpeak(
      `Thankyou for Your answers. As per Gemini your Report It Shows that you have ${finalobj.chances} Chances of having ${selectedcancertype} Cancer. and the Reason Gemini come to this point is ${finalobj.reason}`,
      true
    );
  };
  const handleStopSpeak = () => {
    console.log("stopping speak");
    // if ("speechSynthesis" in window) {
    //   window.speechSynthesis.cancel();
    // } else {
    //   alert("Sorry, your browser does not support speech synthesis.");
    // }
  };

  useEffect(() => {
    if (!SpeechRecognition2) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }
    if (isRecording) {
      const recognition = new SpeechRecognition2();
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
          const temp = [...cancerQuestions];
          temp[currentindex] = {
            ...temp[currentindex],
            answer: finalTranscript,
          };
          console.log(temp);
          setcanerQuestions(temp);
          setIsRecording(false);
          setcurrentindex(currentindex + 1);
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

  const messagesEndRef = useRef(null);
  const [answerinputvalue, setanswerinputvalue] = useState("");

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentindex]);
  const handleSpeak = async (textToSpeak, dontrecord, handleanswer) => {
    setspeaking(true);
    console.log("speaking", textToSpeak);
    if ("speechSynthesis" in window) {
      // Ensure any previous utterances are canceled
      window.speechSynthesis.cancel();
      setTimeout(() => {
        async function loadvoiceforspeaking() {
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
            setspeaking(false);
            if (!dontrecord) {
              if (handleanswer) {
                console.log("recording");
                setIsRecording(true);
              } else {
                SpeechRecognition.startListening();
              }
            }
          };

          utterance.onerror = (event) => {
            console.error("Speech synthesis error", event.error);
            setspeaking(false);
          };
        }

        loadvoiceforspeaking();
      }, 400);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
      setspeaking(false);
    }
  };

  useEffect(() => {
    async function handleqna() {
      if (diagnosestart && currentindex !== null && !listening) {
        console.log(currentindex, cancerQuestions, cancerQuestions.length);
        if (currentindex < cancerQuestions.length) {
          !speaking &&
            handleSpeak(cancerQuestions[currentindex].question, false, true);
        } else if (
          currentindex != 0 &&
          currentindex == cancerQuestions.length
        ) {
          if (localStorage.getItem("proceedtype" == "voice")) {
            Submit();
          }
        }
      } else if (!diagnosestart) {
        handleStopSpeak();
        setIsRecording(false);
      }
    }

    handleqna();
  }, [currentindex, diagnosestart, cancerQuestions.length, listening]);
  useEffect(() => {
    async function diagnosecheckup() {
      if (!diagnosestart && !selectedcancertype && !listening) {
        if (transcript.includes("breast")) {
          setselectedcancertype("breast");
        } else if (transcript.includes("colorectal")) {
          setselectedcancertype("colorectal");
        } else if (transcript.includes("stomach")) {
          setselectedcancertype("stomach");
        } else if (transcript.includes("lung")) {
          setselectedcancertype("lung");
        } else if (transcript.includes("prostate")) {
          setselectedcancertype("prostate");
        }
      } else if (selectedcancertype && !diagnosestart && !readytostart) {
        // await handleSpeak(
        //   `Lets Start ${selectedcancertype} Cancer Diagnose`,
        //   true
        // );
        setreadytostart(true);
      } else if (selectedcancertype && !diagnosestart && readytostart) {
        console.log("readytostart");
        if (tcount < 1) {
          !speaking && handleSpeak(`Say Start to Proceed`);
          settcount(1);
        }

        console.log(transcript);
        if (transcript.toLocaleLowerCase().includes("start")) {
          setdiagnosestart(true);
          // setdiagnosestart((prev) => {

          //   if (!prev) {
          //     resetTranscript();
          //   }
          // });
        }
      } else if (selectedcancertype && diagnosestart && readytostart) {
        switch (selectedcancertype) {
          case "breast":
            setcanerQuestions(breastcancersymptoms);
            break;
          case "stomach":
            setcanerQuestions(stomachsymptoms);
            break;
          case "prostate":
            setcanerQuestions(prostatesymptoms);
            break;
          case "colorectal":
            setcanerQuestions(colorectalsymptoms);
            break;
          case "lung":
            setcanerQuestions(lungcancersymptoms);
            break;
        }
      }
    }

    diagnosecheckup();

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [
    transcript,
    selectedcancertype,
    listening,
    readytostart,

    finalTranscript,
    diagnosestart,
  ]);

  if (speechRecognitionSupported === null) return null; // return null on first render, can be a loading indicator

  return (
    <>
      {resultbygemini ? (
        <div
          style={{
            width: "100%",
            borderRight: "2px solid aqua",
            paddingTop: "4rem",
            color: "white",
            height: "100vh",
          }}
        >
          <div className="responsechance">
            <h3>{resultbygemini.chances}</h3>
            <p style={{ textAlign: "center" }}>
              Chances of having {selectedcancertype} cancer{" "}
            </p>
            <div style={{ textAlign: "center" }} className="reasondesc">
              The reason Gemini come to this point is because{" "}
              {resultbygemini.reason}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            paddingTop: "4rem",
            color: "white",
            border: "2px solid grey",
          }}
          className="chatbox1"
          onMouseOver={() => {
            if (!selectedcancertype) {
              // SpeechRecognition.startListening();
              !speaking &&
                handleSpeak(
                  "Say name of cancer to diagnose like Breast Cancer , Lung Cancer , Prostate Cancer , Stomach Cancer or Colorectal Cancer"
                );
            }
          }}
        >
          {!selectedcancertype && (
            <div className="cancertype">
              <div
                onClick={() => {
                  setselectedcancertype("breast");
                }}
              >
                Breast Cancer
              </div>
              <div
                onClick={() => {
                  setselectedcancertype("lung");
                }}
              >
                Lung Cancer
              </div>
              <div
                onClick={() => {
                  setselectedcancertype("colorectal");
                }}
              >
                Colorectal Cancer
              </div>
              <div
                onClick={() => {
                  setselectedcancertype("prostate");
                }}
              >
                Prostate Cancer
              </div>
              <div
                onClick={() => {
                  setselectedcancertype("stomach");
                }}
              >
                Stomach Cancer
              </div>
            </div>
          )}
          {selectedcancertype && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <h3>Lets diagnose {selectedcancertype} cancer</h3>
                {diagnosestart ? (
                  <div
                    style={{
                      textAlign: "center",
                    }}
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Restart
                  </div>
                ) : (
                  <button
                    className="startdiagnosebtn"
                    onClick={() => {
                      setdiagnosestart(true);
                      setreadytostart(true);
                    }}
                  >
                    Start Diagnose
                  </button>
                )}
              </div>
            </>
          )}
          {/* <button
            onClick={() => {
              setcurrentindex(currentindex + 1);
            }}
          >
            Next Question
          </button> */}
          <div
            style={{
              position: "relative",
              height: "70vh",
              borderRadius: "12px",
              background: "black",
              padding: "8px",
              margin: "15px",
              overflow: "auto",
            }}
            className="chatscroll"
          >
            {diagnosestart &&
              cancerQuestions.length > 0 &&
              cancerQuestions
                .filter((i, index) => index <= currentindex)
                .map((item, id) => {
                  return (
                    <div key={id}>
                      <div className="chatquebox">
                        <div className="chatque">{item?.question}</div>
                      </div>
                      <div className="chatansbox">
                        {currentindex >= cancerQuestions.length &&
                          currentindex != 0 && (
                            <>
                              <svg
                                onClick={() => {
                                  seteditans(true);
                                  seteditansid(id);
                                  seteditansval(cancerQuestions[id].answer);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                              <input
                                onBlur={() => {
                                  let temp = cancerQuestions;
                                  temp[id] = {
                                    ...temp[id],
                                    answer: editansval,
                                  };
                                  setcanerQuestions(cancerQuestions);
                                  seteditansval("");
                                }}
                                onMouseEnter={() => {
                                  let temp = cancerQuestions;
                                  temp[id] = {
                                    ...temp[id],
                                    answer: editansval,
                                  };
                                  setcanerQuestions(cancerQuestions);
                                  seteditansval("");
                                }}
                                style={{ background: "#000" }}
                                value={editansval}
                                onChange={(e) => {
                                  seteditansval(e.target.value);
                                }}
                              />
                            </>
                          )}

                        <div className="chatans">{item.answer}</div>
                      </div>
                    </div>
                  );
                })}

            {currentindex != 0 && currentindex >= cancerQuestions.length && (
              <button
                onClick={() => {
                  Submit();
                }}
                className="submitbtn"
              >
                Submit {"->"}
              </button>
            )}
            {localStorage.getItem("proceedtype" == "voice") && (
              <div
                style={{ display: "flex", justifyContent: "center" }}
                ref={messagesEndRef}
              >
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const temp = [...cancerQuestions];
                      temp[currentindex] = {
                        ...temp[currentindex],
                        answer: e.target.value,
                      };
                      console.log(temp);
                      setcanerQuestions(temp);
                      setcurrentindex(currentindex + 1);
                    }
                  }}
                  style={{
                    margin: "auto",
                    borderRadius: "24px",
                    padding: "10px",
                    backgroundColor: "rgba(29, 29, 29, 0.66)",
                    width: "90%",
                  }}
                  value={answerinputvalue}
                  onChange={(e) => {
                    setanswerinputvalue(e.target.value);
                  }}
                  placeholder="Enter you answer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div
        style={{
          width: "30%",
          position: "relative",
        }}
      >
        {(isRecording || listening) && (
          <img
            src="/listening.gif"
            style={{
              width: "180px",
              height: "130px",
              alignSelf: "center",
              margin: "auto",
              marginTop: "4rem",
            }}
            alt="Listening indicator"
          />
        )}
        {/* <div> */}
        <Spline
          style={{
            zIndex: "3",
            marginLeft: "0.9rem",
            position: "absolute",

            top: "70%",
            transform: "translate(-50%,-50%)",

            left: "50%",
          }}
          scene="https://prod.spline.design/yTtOKpWjLkRFa9NT/scene.splinecode"
        />
        {/* </div> */}
      </div>
    </>
  );
};

export default Cancerchat;
