import React, { useState, useEffect, useRef } from 'react';
import { CiSearch } from "react-icons/ci";
import { PiMicrophoneThin } from "react-icons/pi";
import "./UniversalSearch.css";

const UniversalSearch = ({ value, onChange, placeholder = "Search...", className = "" }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.warn("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      onChange(transcript); 
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [onChange]);

  const handleMicClick = () => {
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  return (
    <div className="SearchItem shadow-sm w-100">
      <div className="itemsSerarchIcon">
        <CiSearch size={20} />
      </div>
      <input
        type="text"
        className={`w-100 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
      />
   <div className={`TableSearch ${listening ? 'listening' : ''}`} onClick={handleMicClick}>
        <PiMicrophoneThin size={20} color={listening ? "red" : "#ffc300"} />
      </div>
    </div>
  );
};

export default UniversalSearch;
