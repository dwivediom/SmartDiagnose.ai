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
import { Color } from "three";
import MicButton from "@/components/Listening";
import { Capitalize, get_prompt_response } from "../../../utils/modle";
import Navbar from "@/components/Navbar";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const Cancerdiagnose = () => {
  const [CancerQuestionnaire, setCanceQue] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = 3000; // 2 seconds
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [voiceresponse, setvoiceresponse] = useState();
  const [selectedcancertype, setselectedcancertype] = useState();

  useEffect(() => {
    console.log(voiceresponse);
    if (!selectedcancertype && !voiceresponse) {
      handleSpeak(
        "Say Name of cancer to diagnose like Breast Cancer , Lung Cancer , Prostate Cancer , Colorectal Cancer or Stomach Cancer"
      );
    }
    if (voiceresponse) {
      console.log(voiceresponse, "bol bhai");
      if (voiceresponse.toLocaleLowerCase().includes("breast")) {
        console.log(voiceresponse);
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
  }, [voiceresponse]);

  useEffect(() => {
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
  }, [selectedcancertype]);
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
          if (diagnosestart) {
            let temp = CancerQuestionnaire;
            temp[currentindex].answer = finalTranscript;
            setCanceQue(temp);
            recognition.onend = () => {
              setcurrentindex(currentindex + 1);
              console.log(CancerQuestionnaire);
              setIsRecording(false);
              if (pauseTimer) clearTimeout(pauseTimer);
            };
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
          setIsRecording(false);
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
  const [resultbygemini, setresultbygemini] = useState();

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
  const [readysubmit, setreadysubmit] = useState(false);
  useEffect(() => {
    if (diagnosestart) {
      console.log(
        currentindex,
        CancerQuestionnaire,
        CancerQuestionnaire.length
      );
      if (currentindex < CancerQuestionnaire.length) {
        handleSpeak(CancerQuestionnaire[currentindex].question);
      } else {
        if (localStorage.getItem("proceedtype") == "voice") {
          handleSubmitToGemeni();
        }
        setreadysubmit(true);
      }
    } else if (!diagnosestart) {
      handleStopSpeak();
      setIsRecording(false);
    }
  }, [femaleVoice, currentindex, diagnosestart]);

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
      case "prostate":
        setCanceQue(prostatesymptoms);
        break;
      case "stomach":
        setCanceQue(stomachsymptoms);
        break;
      default:
        setCanceQue();
    }
  }, [selectedcancertype]);

  const [editans, seteditans] = useState(false);
  const [editansval, seteditansval] = useState("");
  const [editansid, seteditansid] = useState();

  const handleSubmitToGemeni = async () => {
    try {
      let tempstring1 = `i will give question and answer of patient you have to pridict the chance of ${selectedcancertype} cancer based on symtomps described by the patient and you have to give your answer  between  1% to 100% range  and 
and give the reason why and how you come to that range 
 Expected output example: {"chances" :" 30% to 40%" , "reason" :"because you have rectal bleeding , and other 1 , other2" }

    Do not add any conversational words in the response, keep verbosity as low as possible, just return the required dictionary
`;

      let tempstring2 = JSON.stringify(CancerQuestionnaire);
      let finalString = tempstring1 + " " + tempstring2;
      const result = await get_prompt_response(finalString);
      console.log(result, "Result is here");
      // setresultbygemini(result?.candidates[0]?.content?.parts);
      let iscolon = result.includes(":");
      if (iscolon) {
        let temp = result.split(":");
      }

      let resobj = JSON.parse(result);
      console.log(resobj);
      handleSpeak(
        `Report given by Gemini shows that you have ${resobj.chances} Chances of having ${selectedcancertype} Cancer and the reason Gemini giving in ${resobj.reason}`
      );
      setresultbygemini(resobj);
    } catch (error) {}
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "relative",
        paddingTop: "4rem",
      }}
    >
      <Navbar />
      {resultbygemini ? (
        <div
          className="chatmainbox resultbox"
          style={{ width: "65%", position: "relative" }}
        >
          <p
            style={{
              marginTop: "1rem",
              color: "white",
              fontSize: "1.4rem",
              textAlign: "center",
              fontWeight: 200,
            }}
          >
            Thankyou for answering
          </p>
          <p
            style={{
              marginTop: "1rem",
              color: "white",
              fontSize: "1.4rem",
              textAlign: "center",
              fontWeight: 200,
            }}
          >
            Here is your report - powered by <span>Gemini</span>{" "}
          </p>
          <p
            style={{
              textAlign: "center",
              color: "white",
              marginTop: "1rem",
              fontSize: "1.1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="responsechance">
              <h3>{resultbygemini.chances}</h3>
              <p>Chances of having {Capitalize(selectedcancertype)} cancer </p>

              <div className="reasondesc">
                <span>Description</span>
                <div>
                  Reason Gemini come with this result is {resultbygemini.reason}
                </div>
              </div>
            </div>
          </p>
        </div>
      ) : (
        <div
          className="chatmainbox"
          style={{ width: "65%", position: "relative" }}
        >
          {!selectedcancertype && (
            <div>
              <h4 style={{ color: "white", textAlign: "center" }}>
                {" "}
                Select cancer type to diagnose
              </h4>
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
            </div>
          )}

          {selectedcancertype && (
            <>
              <p
                style={{
                  marginBottom: "10px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Lets diagnose {Capitalize(selectedcancertype)} cancer
              </p>

              <button
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
              </button>
              {diagnosestart && (
                <p>*you will get to edit your response before submit</p>
              )}
            </>
          )}

          {selectedcancertype && (
            <button
              className="restartdiagnosebtn"
              onClick={() => {
                window.location.reload();
              }}
            >
              Restart
            </button>
          )}

          {diagnosestart &&
            CancerQuestionnaire &&
            CancerQuestionnaire.filter((q, id) => id <= currentindex).map(
              (item, index) => {
                return (
                  <>
                    <div className="chatquebox">
                      <p className="chatque">{item.question}</p>
                    </div>
                    <div className="chatansbox">
                      {isRecording && "recording"}{" "}
                      {readysubmit && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="size-6"
                          onClick={() => {
                            seteditansid(index);
                            seteditans(true);
                          }}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      )}
                      <p className="chatans">{item.answer}</p>
                      {readysubmit && editansid == index && (
                        <input
                          style={{
                            background: "transparent",
                            color: "white",
                            borderRadius: "12px",
                            padding: "2px",
                            border: "1px solid grey",
                          }}
                          placeholder={item.answer}
                          value={editansval}
                          onBlur={() => {
                            seteditans(false);
                            seteditansid();
                            let temp = CancerQuestionnaire;
                            temp[index].answer = editansval;
                            console.log(temp);
                            setCanceQue(temp);
                          }}
                          onChange={(e) => {
                            seteditansval(e.target.value);
                          }}
                        />
                      )}
                    </div>
                  </>
                );
              }
            )}
          {readysubmit && (
            <div
              onClick={() => {
                handleSubmitToGemeni();
                handleSpeak(
                  "Thankyou for your responses , heading to the results"
                );
              }}
              className="submitbtn"
            >
              Submit {`->`}
            </div>
          )}
        </div>
      )}

      <div style={{ width: "33%", position: "relative" }}>
        {isRecording && (
          <div>
            <img
              src="/listening.gif"
              style={{
                width: "180px",
                height: "120px",
                margin: "auto",
                marginTop: "2rem",
              }}
            />
            <p style={{ color: "white", textAlign: "center" }}>Listening...</p>
          </div>
        )}

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
      </div>
    </div>
  );
};

export default Cancerdiagnose;
