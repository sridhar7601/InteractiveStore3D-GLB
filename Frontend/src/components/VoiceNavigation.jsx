import React, { useState, useEffect } from 'react';

function VoiceNavigation({ onNavigate }) {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("This browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.toLowerCase();

      if (command.includes('go to')) {
        const destination = command.split('go to')[1].trim();
        onNavigate(destination);
      }
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onNavigate]);

  return null;
    // <button onClick={() => setIsListening(!isListening)}>
    //   {/* {isListening ? 'Stop Listening' : 'Start Voice Navigation'} */}
    // </button>
  
}

export default VoiceNavigation;