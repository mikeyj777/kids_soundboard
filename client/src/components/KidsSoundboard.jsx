import React, { useState, useEffect } from 'react';
import YouTubePlayer from './YouTubePlayer';
import { playSound, preloadSounds } from '../utils/playSound';
import soundButtons from '../utils/soundData';
import LoopEditor from './LoopEditor';

const ICON_FILE_LOCATION = '/assets/images/cat_icon.png';

const KidsSoundboard = () => {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [draggedSound, setDraggedSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Preload sounds when component mounts
  useEffect(() => {
    const loadSounds = async () => {
      setIsLoading(true);
      await preloadSounds(soundButtons);
      setIsLoading(false);
    };
    loadSounds();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedSound) {
      // Add loop properties when adding a new sound
      setSelectedSounds([...selectedSounds, {
        ...draggedSound,
        loop: {
          active: false,
          tempo: 1,
          interval: null
        }
      }]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // New method to update a specific sound in the selectedSounds array
  const handleUpdateSound = (index, updatedSound) => {
    const newSounds = [...selectedSounds];
    newSounds[index] = updatedSound;
    setSelectedSounds(newSounds);
  };

  // Optional: Method to remove a sound from the editor
  const handleRemoveSound = (index) => {
    const newSounds = selectedSounds.filter((_, i) => i !== index);
    setSelectedSounds(newSounds);
  };

  return (
    <div className="soundboard-container">
      {/* Header with icon */}
      <div className="header">
        <img 
          src={ICON_FILE_LOCATION} 
          width="100"
          alt="Music Kids Icon"
          className="app-icon"
        />
        <h1>Kids Music Studio 🎵</h1>
      </div>

      {/* Sound Buttons Section with Drop Target */}
      <div className="sound-section">
        {/* Vertical Drop Target */}
        <div 
          className="drop-target"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="drop-target-content">
            <span>Drop</span>
            <span>Sounds</span>
            <span>Here!</span>
            <span>🎵</span>
          </div>
        </div>

        {/* Sound Buttons Panel */}
        <div className="sound-buttons-panel">
          {soundButtons.map((sound) => (
            <button
              key={sound.id}
              className="sound-button"
              style={{ 
                backgroundColor: sound.color,
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'wait' : 'pointer'
              }}
              draggable={!isLoading}
              onDragStart={() => setDraggedSound(sound)}
              onClick={() => !isLoading && playSound(sound)}
              disabled={isLoading}
            >
              {sound.label}
              {isLoading && <span className="loading-indicator">⌛</span>}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Section */}
      <div className="youtube-section">
        <YouTubePlayer />
      </div>

      {/* Sound Editor Section */}
      <div className="editor-container">
        <LoopEditor 
          sounds={selectedSounds}
          onUpdateSound={handleUpdateSound}
          onRemoveSound={handleRemoveSound} // Optional removal functionality
        />
      </div>
    </div>
  );
};

export default KidsSoundboard;