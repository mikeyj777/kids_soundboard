import { useState, useRef } from 'react';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// Custom Icons
const SearchIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    style={{
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '2px'
    }}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowIcon = ({ direction }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none' }}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const YouTubePlayer = () => {
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

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


  return (
    <div style={{
      border: '1rem solid pink',
      borderRadius: '1rem',
      padding: '1rem',
      backgroundColor: '#fff',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '"Comic Sans MS", cursive'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#FFE4E1',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <h1 style={{
          color: '#FF69B4',
          margin: 0,
          fontSize: '2rem'
        }}>Kids YouTube Player! 🎵</h1>
      </div>

      <form onSubmit={handleSearch}>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="What would you like to watch?"
            style={{
              flexGrow: 1,
              padding: '0.5rem',
              fontSize: '1.2rem',
              borderRadius: '0.5rem',
              border: '3px solid #FFB6C1',
              outline: 'none',
              fontFamily: '"Comic Sans MS", cursive'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              padding: '0.5rem',
              backgroundColor: '#FF69B4',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#FFE4E1',
          color: '#FF1493',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      { searchResults.length > 0 && ( <div style={{
        backgroundColor: '#FFF0F5',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        position: 'relative'
      }}>
        <h2 style={{
          color: '#FF69B4',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          {isLoading ? 'Looking for fun videos...' : 'Fun Videos to Watch!'}
        </h2>
        
        <div style={{ position: 'relative', padding: '0 40px' }}>
          <button
            onClick={() => scrollCarousel('left')}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 105, 180, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            <ArrowIcon direction="left" />
          </button>
          
          <div 
            ref={carouselRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              gap: '1rem',
              padding: '1rem 0'
            }}
          >
            {searchResults.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoSelect(video)}
                style={{
                  flexShrink: 0,
                  width: '280px',
                  background: 'white',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: '100%',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem'
                  }}
                />
                <div style={{ padding: '0.5rem' }}>
                  <p style={{
                    color: '#FF69B4',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {video.title}
                  </p>
                  <p style={{
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    {video.channelTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => scrollCarousel('right')}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 105, 180, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 1
            }}
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
      </div> ) }

      <div style={{
        backgroundColor: '#FFF0F5',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{
          aspectRatio: '16/9',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '0.5rem',
              border: '3px solid pink'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;