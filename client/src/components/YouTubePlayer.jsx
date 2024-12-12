import { useState, useRef } from 'react';
import VoiceSearch from './VoiceSearch';
import { SearchIcon, ArrowIcon } from './ui/controls';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;


const YouTubePlayer = () => {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);

  const logger = {
    info: (message, data = null) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] INFO: ${message}`, data ? data : '');
    },
    error: (message, error = null) => {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ERROR: ${message}`, error ? error : '');
    },
    warn: (message, data = null) => {
      const timestamp = new Date().toISOString();
      console.warn(`[${timestamp}] WARN: ${message}`, data ? data : '');
    }
  };

  const searchYouTube = async (query) => {
    if (!query) {
      logger.warn('Search attempted with empty query');
      return;
    }

    logger.info('Initiating YouTube search', { query });
    setIsLoading(true);
    setError(null);

    try {
      if (!API_KEY) {
        throw new Error('YouTube API key not found in environment variables');
      }

      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&maxResults=6`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      const formattedResults = data.items
        .map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description
        }))
        .filter(Boolean);

      setSearchResults(formattedResults);
    } catch (err) {
      setError(err.message === 'YouTube API key not found in environment variables' 
        ? 'Missing API configuration. Please check setup.' 
        : 'Oopsie! Something went wrong. Let\'s try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchYouTube(searchQuery);
  };

  const handleVideoSelect = (video) => {
    setVideoId(video.id);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleVoiceTranscription = (transcript) => {
    setSearchQuery(transcript);
    searchYouTube(transcript);
  };

  const handleVoiceError = (error) => {
    setError(error);
  };

  return (
    <div className="collapsible-container">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`collapsible-toggle ${isOpen ? '' : 'closed'}`}
      >
        ▼
      </button>
      
      <div className="youtube-player-container">
        <div className={`collapsible-content ${isOpen ? 'open' : 'closed'}`}>
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="What would you like to watch?"
              className="search-input"
            />
            <VoiceSearch 
              onTranscriptionComplete={handleVoiceTranscription}
              onError={handleVoiceError}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="search-button"
            >
              <SearchIcon />
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="video-container">
            <h2 className="results-title" style={{ textAlign: 'center' }}>
              {isLoading ? 'Looking for fun videos...' : 'Fun Videos to Watch!'}
            </h2>
            
            <div style={{ position: 'relative', padding: '0 40px' }}>
              <button
                onClick={() => scrollCarousel('left')}
                className="search-button"
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 105, 180, 0.8)',
                  width: '40px',
                  height: '40px'
                }}
              >
                <ArrowIcon direction="left" />
              </button>
              
              <div 
                ref={carouselRef}
                className="results-grid"
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '::-webkit-scrollbar': { display: 'none' }
                }}
              >
                {searchResults.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handleVideoSelect(video)}
                    className="video-card"
                    style={{ flexShrink: 0, width: '280px' }}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="video-thumbnail"
                    />
                    <div className="video-info">
                      <p className="video-title">{video.title}</p>
                      <p className="channel-title">{video.channelTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => scrollCarousel('right')}
                className="search-button"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 105, 180, 0.8)',
                  width: '40px',
                  height: '40px'
                }}
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>

          <div className="video-container">
            <div className="video-frame-container">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                className="video-frame"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;