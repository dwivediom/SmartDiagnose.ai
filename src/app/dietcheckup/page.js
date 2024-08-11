"use client";
import MicButton from "@/components/Listening";
import Spline from "@splinetool/react-spline";
import React, { useEffect, useState } from "react";
import "./page.css";
import { dietcheckup } from "../symptoms";
import { get_prompt_response } from "../../../utils/modle";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Dietcheckup = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [diagnosestart, setdiagnosestart] = useState(false);
  const [resultbygemini, setresultbygemini] = useState();
  const [DietQuestionnaire, setDietQue] = useState(dietcheckup);
  const [currentindex, setcurrentindex] = useState(0);
  const [femaleVoice, setfemaleVoice] = useState();
  const [editans, seteditans] = useState(false);
  const [editansval, seteditansval] = useState("");
  const [editansid, seteditansid] = useState();
  const [readysubmit, setreadysubmit] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const pauseTimeout = 2000; // 2 seconds

  const handleSubmitToGemeni = async () => {
    try {
      let tempstring1 = `i will give answers and questions about his diet based on that pridict the deficiency of the person ,  example output  [{"deficiency" :"vitamin D" , "improvment_tip" : "Take Sunbath or pill" , "vegan_option": "take more sunbath" } ] and Do not add any conversational words in the response, keep verbosity as low as possible, just return the required dictionary
`;

      let tempstring2 = JSON.stringify(DietQuestionnaire);
      let finalString = tempstring1 + " " + tempstring2;
      const result = await get_prompt_response(finalString);
      let resobj = JSON.parse(result);
      console.log(resobj);
      setresultbygemini(resobj);
    } catch (error) {}
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
      }, 500);
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
  useEffect(() => {
    if (diagnosestart) {
      console.log(currentindex, DietQuestionnaire.length);
      if (currentindex < DietQuestionnaire.length) {
        handleSpeak(DietQuestionnaire[currentindex].question);
      } else {
        setreadysubmit(true);
      }
    } else if (!diagnosestart) {
      handleStopSpeak();
      setIsRecording(false);
    }
  }, [femaleVoice, currentindex, diagnosestart]);

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
          let temp = DietQuestionnaire;
          temp[currentindex].answer = finalTranscript;
          setDietQue(temp);
          setIsRecording(false);
        }, pauseTimeout);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => {
        setcurrentindex(currentindex + 1);
        console.log(DietQuestionnaire);
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
  const FunctionRecordAnswer = () => {
    setIsRecording(true);
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
      }}
    >
      <div
        className="chatmainbox"
        style={{ width: "65%", position: "relative", paddingTop: "7rem" }}
      >
        {resultbygemini ? (
          <div>
            <h3 style={{ marginTop: "1rem", textAlign: "center" }}>
              Thankyou for answering
            </h3>
            <h3 style={{ marginTop: "1rem" }}>
              Here is your report - powered by <span>Gemini</span>{" "}
            </h3>
            <p
              style={{
                textAlign: "center",
                color: "white",
                marginTop: "1rem",
                fontSize: "1.1rem",
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {resultbygemini.map((i, id) => {
                return (
                  <div
                    key={id}
                    className="responsechance"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div className="reasondesc">
                      Deficiency - {i.deficiency}
                    </div>
                    <div className="reasondesc">
                      Improvement Tip - {i.improvment_tip}
                    </div>
                    <div className="reasondesc">
                      Vegan Option {i.vegan_option}
                    </div>
                  </div>
                );
              })}
              {/* <div className="responsechance">
                <h3>{resultbygemini[0].deficiency}</h3>
                <p></p>

                <div className="reasondesc">
                  <span>Description</span>
                  <div>
                    Reason Gemini come with this result is{" "}
                    {resultbygemini.reason}
                  </div>
                </div>
              </div> */}
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                position: "fixed",
                top: "0",
                alignSelf: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <p
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  textAlign: "center",
                  color: "white",
                }}
              >
                Lets do your Diet checkup
              </p>
              <button
                className="startdiagnosebtn"
                // start diagnose
                onClick={() => {
                  if (diagnosestart) {
                    setdiagnosestart(false);
                  } else {
                    setdiagnosestart(true);
                  }
                }}
              >
                {diagnosestart ? "Pause" : "Start"} Checkup
              </button>
            </div>
            {diagnosestart &&
              DietQuestionnaire &&
              DietQuestionnaire.filter((q, id) => id <= currentindex).map(
                (item, index) => {
                  return (
                    <>
                      <div className="chatquebox">
                        <p className="chatque">{item.question}</p>
                      </div>
                      <div className="chatansbox">
                        {isRecording && "recording"}{" "}
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
                              let temp = DietQuestionnaire;
                              temp[index].answer = editansval;
                              console.log(temp);
                              setDietQue(temp);
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
          </>
        )}

        {readysubmit && (
          <div
            onClick={() => {
              handleSubmitToGemeni();
            }}
            className="submitbtn"
          >
            Submit {`->`}
          </div>
        )}
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

export default Dietcheckup;
