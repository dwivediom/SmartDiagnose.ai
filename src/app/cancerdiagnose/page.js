"use client";
import Spline from "@splinetool/react-spline";
import "./page.css";
import React, { useEffect, useState } from "react";
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const canceldiagnose = () => {
  const [breastCancerQuestionnaire, setbreastCanceQue] = useState([
    // Symptoms and Changes
    {
      question: "Hey hi can you specify your gender",
      answer: "",
    },
    {
      question:
        "Do you have a lump or thickening in your breast or underarm area?",
      answer: "Yes i have somewhat",
    },
    {
      question:
        "Have you noticed any change in the size or shape of your breast?",
      answer: "",
    },
    {
      question:
        "Do you experience any persistent pain in your breast or nipple?",
      answer: "",
    },
    {
      question: "Is there any nipple discharge that is not breast milk?",
      answer: "",
    },
    {
      question:
        "Have you noticed any dimpling or puckering of the skin on your breast?",
      answer: "",
    },
    {
      question:
        "Is there any redness or flaky skin in the nipple area or on the breast?",
      answer: "",
    },
    {
      question:
        "Do you have any swelling in part of your breast, even if no lump is felt?",
      answer: "",
    },
    {
      question:
        "Have you experienced any changes in the appearance of one or both nipples?",
      answer: "",
    },
    {
      question:
        "Is there any inverted nipple or other nipple changes you've observed?",
      answer: "",
    },

    // Family History and Genetics
    {
      question:
        "Do you have a family history of breast cancer? If yes, which relatives and at what age were they diagnosed?",
      answer: "",
    },
    {
      question:
        "Have you undergone genetic testing that showed a BRCA1 or BRCA2 gene mutation?",
      answer: "",
    },
    {
      question:
        "Has anyone in your family had ovarian cancer, prostate cancer, or pancreatic cancer?",
      answer: "",
    },

    // Personal Medical History
    {
      question:
        "Have you had a previous breast biopsy showing atypical hyperplasia?",
      answer: "",
    },
    {
      question:
        "Have you ever received radiation therapy to the chest or breast area?",
      answer: "",
    },
    {
      question:
        "Do you have a personal history of breast cancer or other breast diseases?",
      answer: "",
    },
    {
      question:
        "Have you ever been informed by a doctor that you have dense breast tissue?",
      answer: "",
    },
    {
      question:
        "Have you ever had an abnormal mammogram or breast ultrasound result?",
      answer: "",
    },

    // Reproductive History
    {
      question: "Did you start menstruating before age 12?",
      answer: "",
    },
    {
      question: "Did you experience menopause after age 55?",
      answer: "",
    },
    {
      question:
        "Have you had your first child after age 30, or are you childless?",
      answer: "",
    },
    {
      question: "Have you breastfed any of your children?",
      answer: "",
    },
    {
      question:
        "Have you ever taken oral contraceptives or birth control pills?",
      answer: "",
    },

    // Lifestyle and Hormone Factors
    {
      question:
        "Do you consume alcohol regularly? If yes, how many drinks per week?",
      answer: "",
    },
    {
      question: "Are you overweight or obese, especially after menopause?",
      answer: "",
    },
    {
      question:
        "Do you have a sedentary lifestyle with little physical activity?",
      answer: "",
    },
    {
      question:
        "Have you used hormone replacement therapy (HRT) for menopause symptoms?",
      answer: "",
    },
    {
      question: "Do you smoke or have you ever smoked?",
      answer: "",
    },
    {
      question: "Do you follow a balanced diet rich in fruits and vegetables?",
      answer: "",
    },
    {
      question: "Do you engage in regular physical exercise?",
      answer: "",
    },

    // Other Relevant Questions
    {
      question:
        "Are you currently experiencing any unusual fatigue or weakness?",
      answer: "",
    },
    {
      question:
        "Do you have any other health conditions that you think might be relevant?",
      answer: "",
    },
    {
      question:
        "Are you aware of any changes in your overall health that concern you?",
      answer: "",
    },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const pauseTimeout = 3000; // 3 seconds
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition API.");
      return;
    }

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
        let temp = breastCancerQuestionnaire;
        temp[currentindex].answer = finalTranscript;
        setbreastCanceQue(temp);
        setIsRecording(false);
      }, pauseTimeout);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      setcurrentindex(currentindex + 1);
      console.log(breastCancerQuestionnaire);
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
      }, 2000);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };
  useEffect(() => {
    handleSpeak(breastCancerQuestionnaire[currentindex].question);
  }, [femaleVoice, currentindex]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100vw",

        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="chatmainbox" style={{ width: "65%" }}>
        <h2>Be relax and we will see how you are feeling! 😇</h2>
        {breastCancerQuestionnaire
          .filter((q, id) => id <= currentindex)
          .map((item, index) => {
            return (
              <>
                <div className="chatquebox">
                  <p className="chatque">{item.question}</p>
                </div>
                <div className="chatansbox">
                  {isRecording && "recording"}{" "}
                  <p className="chatans">{item.answer}</p>
                </div>
              </>
            );
          })}
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
      </div>
    </div>
  );
};

export default canceldiagnose;
