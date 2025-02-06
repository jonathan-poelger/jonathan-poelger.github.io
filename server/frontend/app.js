import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'); // Use environment variable for backend URL

function App() {
  const [musicList, setMusicList] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for updates from the server
    socket.on('updateMusicList', (list) => setMusicList(list));
    socket.on('playSong', (videoId) => setCurrentSong(videoId));
    socket.on('updatePlayers', (players) => setPlayers(players));
    socket.on('gameOver', () => alert('Game Over!'));

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmitSong = async () => {
    if (!query.trim()) {
      setError('Please enter a valid YouTube link or search query.');
      return;
    }

    setIsLoading(true);
    setError('');

    socket.emit('submitSong', query, (response) => {
      setIsLoading(false);
      if (response.success) {
        setQuery('');
      } else {
        setError(response.error || 'Failed to submit song.');
      }
    });
  };

  const handleAnswer = (answer) => {
    socket.emit('submitAnswer', answer);
  };

  return (
    <div>
      <h1>Blindtest Game</h1>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter YouTube link or search query"
          disabled={isLoading}
        />
        <button onClick={handleSubmitSong} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Song'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div>
        <h2>Now Playing</h2>
        {currentSong ? (
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${currentSong}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>No song is currently playing.</p>
        )}
      </div>
      <div>
        <h2>Players</h2>
        <ul>
          {players.map(([id, player]) => (
            <li key={id}>
              Player {id}: {player.score} points
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={() => handleAnswer('correct')}>Correct</button>
        <button onClick={() => handleAnswer('wrong')}>Wrong</button>
      </div>
    </div>
  );
}

export default App;