import { useState } from 'react';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;


const SearchIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    className="search-icon"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const YouTubePlayer = () => {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Logger utility for consistent logging format
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
      // Check for API key
      
      if (!API_KEY) {
        throw new Error('YouTube API key not found in environment variables');
      }

      console.log("API_KEY", API_KEY);

      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}&maxResults=6`;
      logger.info('Sending API request', { url: searchUrl.replace(API_KEY, 'REDACTED') });

      const response = await fetch(searchUrl);
      logger.info('Received API response', { 
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info('Successfully parsed API response', {
        totalResults: data.pageInfo?.totalResults,
        resultsPerPage: data.pageInfo?.resultsPerPage,
        itemCount: data.items?.length
      });
      
      if (!data.items || !Array.isArray(data.items)) {
        logger.warn('API response missing items array', { data });
        throw new Error('Invalid API response format');
      }

      const formattedResults = data.items.map(item => {
        if (!item.id?.videoId || !item.snippet?.title) {
          logger.warn('Malformed item in API response', { item });
          return null;
        }
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description
        };
      }).filter(Boolean); // Remove any null entries

      logger.info('Formatted search results', { 
        resultCount: formattedResults.length,
        firstResult: formattedResults[0]?.title
      });

      setSearchResults(formattedResults);
    } catch (err) {
      logger.error('Search failed', err);
      setError(err.message === 'YouTube API key not found in environment variables' 
        ? 'Missing API configuration. Please check setup.' 
        : 'Oopsie! Something went wrong. Let\'s try again!');
    } finally {
      setIsLoading(false);
      logger.info('Search operation completed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    logger.info('Search form submitted', { query: searchQuery });
    searchYouTube(searchQuery);
  };

  const handleVideoSelect = (video) => {
    logger.info('Video selected', { 
      videoId: video.id,
      title: video.title 
    });
    setVideoId(video.id);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    logger.info('Search input changed', { value });
    setSearchQuery(value);
  };

  return (
    <div className="youtube-player-container">
      <div className="youtube-player-header">
        <h1 className="youtube-player-title">Kids YouTube Player! 🎵</h1>
      </div>

      <form onSubmit={handleSearch}>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="What would you like to watch?"
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isLoading}
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

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

      <div className="video-container">
        <h2 className="results-title">
          {isLoading ? 'Looking for fun videos...' : 'Fun Videos to Watch!'}
        </h2>
        <div className="results-grid">
          {searchResults.map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoSelect(video)}
              className="video-card"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
              />
              <div className="video-info">
                <p className="video-title">
                  {video.title}
                </p>
                <p className="channel-title">
                  {video.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;