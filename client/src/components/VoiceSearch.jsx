import { useState, useCallback } from 'react';

const MicrophoneIcon = ({ isListening }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      backgroundColor: isListening ? '#FF1493' : 'white',
      borderRadius: '50%',
      padding: '2px',
      transition: 'all 0.3s ease'
    }}
  >
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const VoiceSearch = ({ onTranscriptionComplete, onError, buttonStyle }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const startListening = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !window.SpeechRecognition && !window.webkitSpeechRecognition) {
        throw new Error("Voice recognition is not supported in your browser");
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscriptionComplete(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        const error = event.error === 'not-allowed' 
          ? 'Please enable microphone access'
          : 'Sorry, there was a problem with voice recognition';
        setErrorMessage(error);
        onError?.(error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      setErrorMessage(error.message);
      onError?.(error.message);
    }
  }, [onTranscriptionComplete, onError]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={startListening}
        disabled={isListening}
        style={{
          padding: '0.5rem',
          backgroundColor: '#FF69B4',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          ...buttonStyle
        }}
        title="Search with voice"
      >
        <MicrophoneIcon isListening={isListening} />
      </button>
      {errorMessage && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: '#FFE4E1',
          color: '#FF1493',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          marginTop: '0.5rem',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '0.875rem'
        }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;