const SOUND_FOLDER = '/assets/sounds';
const DEFAULT_SOUND = SOUND_FOLDER + '/drum/snare_drum/tr909-snare-drum-241413.wav';

// const soundButtons = [
//   { id: 1, label: '🥁 Drums', color: '#FFB6C1', source: '/data/sounds/drum/snare_drum/tr909-snare-drum-241413.wav' },
//   { id: 6, label: '👏 Clap', color: '#FFA07A', source: 'data/sounds/clap/trimmed-tr808-clap-241405.wav' },
//   { id: 2, label: '🎹 Piano', color: '#98FB98', source: DEFAULT_SOUND },
//   { id: 3, label: '🎸 Guitar', color: '#87CEEB', source: DEFAULT_SOUND },
//   { id: 4, label: '🎺 Trumpet', color: '#DDA0DD', source: DEFAULT_SOUND },
//   { id: 5, label: '🎻 Violin', color: '#F0E68C', source: DEFAULT_SOUND },
// ];

// soundData.js

const soundButtons = [
  { 
    id: 1, 
    label: '🥁 Drums', 
    color: '#FFB6C1', 
    source: SOUND_FOLDER + '/drum/snare_drum/tr909-snare-drum-241413.wav',
    defaultTempo: 1,
    baseInterval: 500,  // Half second base interval for drums
    category: 'percussion',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  },
  { 
    id: 6, 
    label: '👏 Clap', 
    color: '#FFA07A', 
    source: SOUND_FOLDER + '/clap/trimmed-tr808-clap-241405.wav',
    defaultTempo: 1,
    baseInterval: 1000, // One second base interval for claps
    category: 'percussion',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  },
  { 
    id: 2, 
    label: '🎹 Piano', 
    color: '#98FB98', 
    source: SOUND_FOLDER + '/piano/piano-g-6200.wav',
    defaultTempo: 1,
    baseInterval: 2000, // Two second base interval for melodic instruments
    category: 'melodic',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  },
  { 
    id: 3, 
    label: '🎸 Guitar', 
    color: '#87CEEB', 
    source: SOUND_FOLDER + '/guitar/acousticguitar-c-chord-103782.mp3',
    defaultTempo: 1,
    baseInterval: 2000,
    category: 'melodic',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  },
  { 
    id: 4, 
    label: '🎺 Trumpet', 
    color: '#DDA0DD', 
    source: SOUND_FOLDER + '/trumpet/trumpet-e4-14829.mp3',
    defaultTempo: 1,
    baseInterval: 2000,
    category: 'melodic',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  },
  { 
    id: 5, 
    label: '💨 Fart', 
    color: '#F0E68C', 
    source: SOUND_FOLDER + '/other/fart-9-228245.mp3',
    defaultTempo: 1,
    baseInterval: 2000,
    category: 'melodic',
    loop: {
      active: false,
      tempo: 1,
      interval: null
    }
  }
];

// Constants for sound categories
export const SOUND_CATEGORIES = {
  PERCUSSION: 'percussion',
  MELODIC: 'melodic'
};

// Constants for base intervals
export const BASE_INTERVALS = {
  PERCUSSION: 500,  // Half second for percussion
  MELODIC: 2000    // Two seconds for melodic instruments
};

// Default tempo range
export const TEMPO_RANGE = {
  MIN: 0.5,
  MAX: 2.0,
  STEP: 0.1
};

export default soundButtons;