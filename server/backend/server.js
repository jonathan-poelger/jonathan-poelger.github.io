const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (update for production)
  },
});

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // Use environment variable for API key
});

let musicList = [];
let currentSong = null;
let players = new Map(); // Track players and their scores

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Add player to the game
  players.set(socket.id, { score: 0 });
  io.emit('updatePlayers', Array.from(players));

  // Handle song submission
  socket.on('submitSong', async (query, callback) => {
    try {
      const videoId = await getYouTubeVideoId(query);
      const song = { id: socket.id, videoId, submittedBy: socket.id };
      musicList.push(song);
      io.emit('updateMusicList', musicList);
      callback({ success: true, videoId });
    } catch (error) {
      console.error('Error submitting song:', error);
      callback({ success: false, error: 'Failed to fetch song' });
    }
  });

  // Start the game
  socket.on('startGame', () => {
    if (musicList.length > 0) {
      currentSong = musicList.shift();
      io.emit('playSong', currentSong.videoId);
    }
  });

  // Handle answers
  socket.on('submitAnswer', (answer) => {
    if (socket.id !== currentSong.submittedBy) {
      const player = players.get(socket.id);
      if (answer === 'correct') {
        player.score += 10; // Award points
      }
      io.emit('updatePlayers', Array.from(players));
    }
  });

  // Move to the next song
  socket.on('nextSong', () => {
    if (musicList.length > 0) {
      currentSong = musicList.shift();
      io.emit('playSong', currentSong.videoId);
    } else {
      io.emit('gameOver');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    players.delete(socket.id);
    io.emit('updatePlayers', Array.from(players));
    console.log('A user disconnected:', socket.id);
  });
});

// Helper function to get YouTube video ID
async function getYouTubeVideoId(query) {
  if (query.includes('youtube.com/watch?v=')) {
    const videoId = query.split('v=')[1].split('&')[0];
    return videoId;
  } else {
    const response = await youtube.search.list({
      part: 'id',
      q: query,
      maxResults: 1,
      type: 'video',
    });
    if (response.data.items.length === 0) {
      throw new Error('No video found');
    }
    return response.data.items[0].id.videoId;
  }
}

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});