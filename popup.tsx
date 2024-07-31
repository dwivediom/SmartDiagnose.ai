import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const api_key = "AIzaSyCKLs6nN4UYYz2Tj11zOT6wkiNhQbK3h8Y";

function IndexPopup() {
  const genAI = new GoogleGenerativeAI(api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const [data, setData] = useState("");
  const [prompt, setPrompt] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const [funs, setFuns] = useState(0);

  const startSound = new Audio('https://www.dropbox.com/scl/fi/g9tr66onxcik12iknciph/start.mp3?rlkey=eckv4nn1zfww85uyq2eaholhe&st=fm8l1uio&dl=0&raw=1');
  const stopSound = new Audio("https://www.dropbox.com/scl/fi/5sgqgrf1ay64umzdozzgw/stop.mp3?rlkey=8oi3fphodyhgz6w4o53qzxmuf&st=04mbno7h&dl=0&raw=1");

  async function run() {
    const psrompt = "Write a poem in 10 words";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    setData(text);
    console.log(text);
  }

  const handleSpeak = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const femaleVoice = voices.find(voice => voice.name.includes('Veena') || voice.name.includes('female') || voice.gender === 'female');
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support speech synthesis.');
    }
  };

  

  //   loadVoices();
  //   window.speechSynthesis.onvoiceschanged = loadVoices;
  // }, []);

  const fun = async () => {
    console.log("Hello world");
    setFuns(funs + 1);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      
      recognition.onresult = event => {
        let interimTranscription = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscription(prev => prev + transcript);
          } else {
            interimTranscription += transcript;
          }
        }
        setTranscription(prev => prev + interimTranscription);
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log(transcription, "it is ended", data);
        stopSound.play();
        handleSpeak(transcription);
        setData("");
      };

      recognition.onerror = event => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onstart = () => {
        console.log("We are listening. Try speaking into the microphone.");
        setTranscription("");
        setData("");
        startSound.play();
        setIsListening(true);
      };

      recognition.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  useEffect(() => {
    if (transcription.length > 0) {
      setData(transcription);
    }
  }, [transcription]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Welcome to Salesman Extension!</h2>
      <input onChange={(e) => setPrompt(e.target.value)} value={prompt} />
      <h3>{data}</h3>
      <button onClick={run}>Send Prompt</button>
      <button onClick={fun}>Start Voice Typing</button>
      {funs}
      <p>{transcription}</p>
    </div>
  );
}

export default IndexPopup;
