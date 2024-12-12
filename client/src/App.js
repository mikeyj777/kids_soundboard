import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import YouTubePlayer from './components/YouTubePlayer';
import './App.css';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/sound" element={<KidsSoundboard />} /> */}
          <Route path="/video" element={<YouTubePlayer />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;