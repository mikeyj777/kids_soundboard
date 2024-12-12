import React, { useState, useEffect, useCallback } from 'react';
import { playSound, createSoundLoop } from '../utils/playSound';
import { TEMPO_RANGE } from '../utils/soundData';

const LoopEditor = ({ sounds = [], onUpdateSound, onRemoveSound }) => {
  const [soundLoops, setSoundLoops] = useState({});
  const [isPlaying, setIsPlaying] = useState({});

  // Cleanup function for a single loop
  const cleanupLoop = useCallback((index) => {
    if (soundLoops[index]) {
      soundLoops[index].stop();
      setSoundLoops(prev => {
        const newLoops = { ...prev };
        delete newLoops[index];
        return newLoops;
      });
    }
  }, [soundLoops]);

  // Handle removing a sound
  const handleRemoveSound = (index) => {
    // First stop and cleanup any active loop
    cleanupLoop(index);
    
    // Remove playing state
    setIsPlaying(prev => {
      const newPlaying = { ...prev };
      delete newPlaying[index];
      return newPlaying;
    });

    // Call parent's remove handler
    onRemoveSound(index);
  };

  // Cleanup all loops
  useEffect(() => {
    return () => {
      Object.values(soundLoops).forEach(loop => loop.stop());
    };
  }, []);

  // Handle sound activation/deactivation
  useEffect(() => {
    sounds.forEach((sound, index) => {
      if (sound.loop.active) {
        if (!soundLoops[index]) {
          const loop = createSoundLoop(sound, {
            tempo: sound.loop.tempo,
            volume: 1.0
          });
          loop.start();
          setSoundLoops(prev => ({
            ...prev,
            [index]: loop
          }));
          setIsPlaying(prev => ({
            ...prev,
            [index]: true
          }));
        }
      } else {
        cleanupLoop(index);
        setIsPlaying(prev => ({
          ...prev,
          [index]: false
        }));
      }
    });
  }, [sounds, cleanupLoop]);

  // Handle tempo changes
  const handleTempoChange = (index, delta) => {
    if (!onUpdateSound) return;

    const sound = sounds[index];
    const newTempo = Math.max(
      TEMPO_RANGE.MIN,
      Math.min(TEMPO_RANGE.MAX, sound.loop.tempo + delta)
    );

    // Update the sound's tempo
    onUpdateSound(index, {
      ...sound,
      loop: {
        ...sound.loop,
        tempo: newTempo
      }
    });

    // If the sound is currently looping, restart it with the new tempo
    if (soundLoops[index]) {
      cleanupLoop(index);
      const loop = createSoundLoop(sound, {
        tempo: newTempo,
        volume: 1.0
      });
      loop.start();
      setSoundLoops(prev => ({
        ...prev,
        [index]: loop
      }));
    }
  };

  // Toggle sound active state
  const handleToggleActive = (index) => {
    if (!onUpdateSound) return;

    const sound = sounds[index];
    onUpdateSound(index, {
      ...sound,
      loop: {
        ...sound.loop,
        active: !sound.loop.active
      }
    });
  };

  // Play sound once (preview)
  const handlePreviewSound = async (sound) => {
    await playSound(sound, { tempo: sound.loop.tempo });
  };

  return (
    <div className="loop-editor">
      <h2 className="editor-title">Sound Loops 🎵</h2>
      
      <div className="sound-tracks">
        {sounds.map((sound, index) => (
          <div 
            key={`${sound.id}-${index}`} 
            className={`sound-track ${isPlaying[index] ? 'playing' : ''}`}
            style={{ borderLeft: `4px solid ${sound.color}` }}
          >
            {/* Track Label and Preview */}
            <div className="track-info">
              <span className="track-label">{sound.label}</span>
              <button
                className="preview-button"
                onClick={() => handlePreviewSound(sound)}
                title="Preview Sound"
              >
                🔊
              </button>
            </div>

            {/* Main Controls Group */}
            <div className="track-main-controls">
              {/* Loop Toggle Button */}
              <button
                className={`track-button ${sound.loop.active ? 'active' : ''}`}
                style={{
                  backgroundColor: sound.loop.active ? 'white' : '#FF69B4',
                  color: sound.loop.active ? '#FF69B4' : 'white',
                }}
                onClick={() => handleToggleActive(index)}
              >
                {sound.loop.active ? '⏹ Stop' : '▶ Play'}
              </button>

              {/* Tempo Controls */}
              <div className="track-controls">
                <button
                  onClick={() => handleTempoChange(index, -TEMPO_RANGE.STEP)}
                  title="Decrease Tempo"
                  disabled={sound.loop.tempo <= TEMPO_RANGE.MIN}
                >
                  －
                </button>
                <span className="tempo-display">
                  {sound.loop.tempo.toFixed(1)}x
                </span>
                <button
                  onClick={() => handleTempoChange(index, TEMPO_RANGE.STEP)}
                  title="Increase Tempo"
                  disabled={sound.loop.tempo >= TEMPO_RANGE.MAX}
                >
                  ＋
                </button>
              </div>

              {/* Remove Button */}
              <button
                className="remove-button"
                onClick={() => handleRemoveSound(index)}
                title="Remove Sound"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {sounds.length === 0 && (
        <div className="empty-state">
          <p>Drag some sounds here to start making music! 🎵</p>
        </div>
      )}
    </div>
  );
};

export default LoopEditor;