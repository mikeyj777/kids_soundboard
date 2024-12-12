// src/utils/playSound.js

let audioContext = null;
const audioBufferCache = new Map();

const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

// Preload and cache a single sound
const preloadSound = async (source) => {
  if (audioBufferCache.has(source)) return;

  try {
    const response = await fetch(source);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await initializeAudioContext().decodeAudioData(arrayBuffer);
    audioBufferCache.set(source, audioBuffer);
  } catch (error) {
    console.error('Error preloading sound:', source, error);
  }
};

// Preload multiple sounds
export const preloadSounds = async (sounds) => {
  const preloadPromises = sounds.map(sound => preloadSound(sound.source));
  await Promise.all(preloadPromises);
};

export const playSound = async (soundData) => {
  if (!soundData || !soundData.source) return;
  
  const context = initializeAudioContext();
  try {
    // Get from cache or load if not cached
    let audioBuffer = audioBufferCache.get(soundData.source);
    if (!audioBuffer) {
      await preloadSound(soundData.source);
      audioBuffer = audioBufferCache.get(soundData.source);
    }
    
    const soundSource = context.createBufferSource();
    soundSource.buffer = audioBuffer;
    soundSource.connect(context.destination);
    soundSource.start(0);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};