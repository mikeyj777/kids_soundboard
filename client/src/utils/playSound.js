// src/utils/playSound.js

// AudioContext and cache management
let audioContext = null;
const audioBufferCache = new Map();
const activeLoops = new Map();

/**
 * Initialize or return existing AudioContext
 */
const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Preload and cache a single sound
 * @param {string} source - URL of the sound file
 * @returns {Promise<AudioBuffer>}
 */
const preloadSound = async (source) => {
  if (audioBufferCache.has(source)) {
    return audioBufferCache.get(source);
  }

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await initializeAudioContext().decodeAudioData(arrayBuffer);
    audioBufferCache.set(source, audioBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error preloading sound:', source, error);
    throw error;
  }
};

/**
 * Preload multiple sounds
 * @param {Array} sounds - Array of sound objects
 * @returns {Promise<void>}
 */
export const preloadSounds = async (sounds) => {
  try {
    const preloadPromises = sounds
      .filter(sound => sound.source && !audioBufferCache.has(sound.source))
      .map(sound => preloadSound(sound.source));
    
    await Promise.all(preloadPromises);
  } catch (error) {
    console.error('Error preloading sounds:', error);
    throw error;
  }
};

/**
 * Create audio nodes for a sound
 * @param {Object} options - Audio options
 * @returns {Object} Audio nodes
 */
const createAudioNodes = (options = {}) => {
  const context = initializeAudioContext();
  const gainNode = context.createGain();
  gainNode.gain.value = options.volume || 1.0;

  // Optional: Create additional audio processing nodes here
  // Example: EQ, compression, etc.

  return {
    gainNode,
    context
  };
};

/**
 * Play a single instance of a sound
 * @param {Object} soundData - Sound data object
 * @param {Object} options - Playback options
 * @returns {Promise<Object>} Sound control object
 */
export const playSound = async (soundData, options = {}) => {
  if (!soundData?.source) {
    throw new Error('Invalid sound data');
  }

  try {
    const context = initializeAudioContext();
    let audioBuffer = await preloadSound(soundData.source);
    
    // Create and configure source
    const soundSource = context.createBufferSource();
    soundSource.buffer = audioBuffer;

    // Set playback rate (tempo)
    if (options.tempo && options.tempo !== 1) {
      soundSource.playbackRate.value = options.tempo;
    }

    // Create and connect audio nodes
    const { gainNode } = createAudioNodes(options);
    
    soundSource.connect(gainNode);
    gainNode.connect(context.destination);

    // Start playback
    const startTime = options.startTime || context.currentTime;
    soundSource.start(startTime);

    // Return control object
    return {
      source: soundSource,
      gain: gainNode,
      stop: () => {
        try {
          soundSource.stop();
          soundSource.disconnect();
          gainNode.disconnect();
        } catch (error) {
          console.error('Error stopping sound:', error);
        }
      },
      setVolume: (value) => {
        gainNode.gain.value = Math.max(0, Math.min(1, value));
      },
      setTempo: (value) => {
        soundSource.playbackRate.value = value;
      }
    };
  } catch (error) {
    console.error('Error playing sound:', error);
    throw error;
  }
};

/**
 * Create a looped sound instance
 * @param {Object} soundData - Sound data object
 * @param {Object} options - Loop options
 * @returns {Object} Loop control object
 */
export const createSoundLoop = (soundData, options = {}) => {
  let currentSound = null;
  let intervalId = null;
  let isActive = false;

  const play = async () => {
    if (currentSound) {
      currentSound.stop();
    }
    
    currentSound = await playSound(soundData, {
      ...options,
      startTime: audioContext?.currentTime
    });
  };

  const start = async () => {
    if (isActive) return;
    isActive = true;

    // Initial play
    await play();

    // Calculate interval based on tempo and base interval
    const baseInterval = soundData.baseInterval || 1000;
    const interval = baseInterval / (options.tempo || 1);

    // Create loop
    intervalId = setInterval(play, interval);

    // Store loop reference
    activeLoops.set(soundData.id, {
      stop,
      setTempo: updateTempo
    });

    return {
      stop,
      setTempo: updateTempo,
      isActive: () => isActive
    };
  };

  const stop = () => {
    isActive = false;
    
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (currentSound) {
      currentSound.stop();
      currentSound = null;
    }

    activeLoops.delete(soundData.id);
  };

  const updateTempo = async (newTempo) => {
    if (!isActive) return;

    // Update interval
    if (intervalId) {
      clearInterval(intervalId);
      const newInterval = soundData.baseInterval / newTempo;
      intervalId = setInterval(play, newInterval);
    }

    // Update current sound if playing
    if (currentSound) {
      currentSound.setTempo(newTempo);
    }

    options.tempo = newTempo;
  };

  return {
    start,
    stop,
    setTempo: updateTempo,
    isActive: () => isActive
  };
};

/**
 * Stop all active sound loops
 */
export const stopAllLoops = () => {
  activeLoops.forEach(loop => loop.stop());
  activeLoops.clear();
};

/**
 * Update tempo for all active loops
 * @param {number} multiplier - Tempo multiplier
 */
export const updateGlobalTempo = (multiplier) => {
  activeLoops.forEach(loop => loop.setTempo(multiplier));
};

// Clean up when window unloads
if (typeof window !== 'undefined') {
  window.addEventListener('unload', () => {
    stopAllLoops();
    audioContext?.close();
  });
}