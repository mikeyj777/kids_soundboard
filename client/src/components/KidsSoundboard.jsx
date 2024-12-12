import React, { useState } from 'react';

const KidsSoundboard = () => {
  const [selectedSounds, setSelectedSounds] = useState([]);
  const [draggedSound, setDraggedSound] = useState(null);

  const soundButtons = [
    { id: 1, label: '🥁 Drums', color: '#FFB6C1' },
    { id: 2, label: '🎹 Piano', color: '#98FB98' },
    { id: 3, label: '🎸 Guitar', color: '#87CEEB' },
    { id: 4, label: '🎺 Trumpet', color: '#DDA0DD' },
    { id: 5, label: '🎻 Violin', color: '#F0E68C' },
    { id: 6, label: '🎤 Voice', color: '#FFA07A' },
  ];

  const recommendedVideos = [
    { id: 1, title: 'Baby Shark Dance', thumbnail: '/api/placeholder/160/90' },
    { id: 2, title: 'Wheels on the Bus', thumbnail: '/api/placeholder/160/90' },
    { id: 3, title: 'ABC Song', thumbnail: '/api/placeholder/160/90' },
    { id: 4, title: 'Twinkle Twinkle', thumbnail: '/api/placeholder/160/90' },
  ];

  // ... (keeping the same handler functions)
  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedSound) {
      setSelectedSounds([...selectedSounds, 
        { ...draggedSound, tempo: 1, active: true }
      ]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const adjustTempo = (index, delta) => {
    const newSounds = [...selectedSounds];
    newSounds[index].tempo = Math.max(0.5, Math.min(2, newSounds[index].tempo + delta));
    setSelectedSounds(newSounds);
  };

  const toggleActive = (index) => {
    const newSounds = [...selectedSounds];
    newSounds[index].active = !newSounds[index].active;
    setSelectedSounds(newSounds);
  };

  return (
    <div className="soundboard-container">
      {/* Header with icon */}
      <div className="header">
        <img 
          src="/api/placeholder/50/50" 
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
              style={{ backgroundColor: sound.color }}
              draggable
              onDragStart={() => setDraggedSound(sound)}
            >
              {sound.label}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Section */}
      <div className="youtube-section">
        {/* YouTube Search Bar */}
        <div className="youtube-search">
          <div className="search-container">
            <input 
              type="text"
              placeholder="Search for kids songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="voice-search">🎤</button>
            <button className="search-button">🔍</button>
          </div>
        </div>

        

      {/* Sound Editor Section */}
      <div className="editor-container">
        {/* Sound Tracks */}
        <div className="sound-tracks">
          {selectedSounds.map((sound, index) => (
            <div key={index} className="sound-track">
              <button 
                className={`track-button ${sound.active ? 'active' : ''}`}
                style={{ backgroundColor: sound.color }}
                onClick={() => toggleActive(index)}
              >
                {sound.label}
              </button>
              <div className="track-controls">
                <button onClick={() => adjustTempo(index, -0.1)}>-</button>
                <span>{sound.tempo.toFixed(1)}x</span>
                <button onClick={() => adjustTempo(index, 0.1)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default KidsSoundboard;