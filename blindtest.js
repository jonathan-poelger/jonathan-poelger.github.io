// SETUP YOUTUBE PLAYER ========================================

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: '',
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': handle_null,
            'onStateChange': handle_null
        }
    });
}

function handle_null(event) {
    if (!player.getVideoData().video_id) {
        player.cueVideoById('');
    }
}


// Video handling ==================================================

function extractVideoID(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/|e\/|.*\/v=))([^#&?\n]*)/);
    return match ? match[1] : null;
}

async function getFirstYouTubeResult(query) {
    const apiKey = "API_KEY";
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await fetch(searchUrl);
        const text = await response.text();
        const match = text.match(/\"videoId\": ?\"([^\"]+)\"/);

        if (match) {
            return `https://www.youtube.com/watch?v=${match[1]}`;
        } else {
            throw new Error("No video found.");
        }
    } catch (error) {
        console.error("Error fetching YouTube search results:", error);
        return null;
    }
}


async function get_url(song_url) {
    let videoID = extractVideoID(song_url) || extractVideoID(await getFirstYouTubeResult(song_url));
    return videoID;
}


// Game logic===========================================================================


let peer;
let hostPeer;
let players = [];
let connections = [];
let song_queue = [];
let song_index = -1;
let game = null;

function submit(title, type){
    game.send({type: "song", title: title, name: localStorage.getItem("userName")});
}

const update_song_list = () => {
    document.getElementById("song-list").innerText = song_queue.map((song, idx) => {
        return idx < song_index ? `${song.title} (${song.name})` : `????? (${song.name})`;
    }).join("\n");
};

function joinGame(sessionCode) {
    peer = new Peer();

    peer.on("open", (id) => {
        console.log("My Peer ID:", id);
        game = peer.connect(sessionCode);

        game.on("open", () => {
            console.log("Connected to Host!");
            game.send({ type: "join", value: id, name: localStorage.getItem("userName") });
        });

        game.on("data", (data) => {
            if (data.type === "song"){
                if (data.data){
                    document.querySelector('#player').style.opacity = 0;
                    player.loadVideoById(data.data);
                }
                else
                    player.cueVideoById('');
            }
            if (data.type === "data"){
                players = data.players;
                song_queue = data.songs;
                song_index = data.index;
            }
            if (data.type === "reveal"){
                document.querySelector('#player').style.opacity = 1;
            }

            update_song_list();
            document.getElementById("player-list").innerText = players.join("\n");
        });
    });
}

function createGame() {
    hostPeer = new Peer(Math.random().toString(36).substring(2, 6).toUpperCase()); 

    hostPeer.on("open", (id) => {
        document.getElementById("session-code").innerText = id;
    });

    hostPeer.on("connection", (conn) => {
        console.log("Player connected:", conn.peer);

        conn.on("data", (data) => {

            if (data.type === "join") {
                connections.push(conn)
                players.push(data.name)
            } else if (data.type === "song") {
                song_queue.push(data);
            } else if (data.type === "next"){
                nextSong();
            }

            if (data.type){
                conn.send({type: "data", players: players, songs: song_queue, index: song_index}); // Data update
            }
        });
    });

    joinGame(hostPeer.id);
}

const nextSong = async () => {
    if (hostPeer) {
        song_index += 1;
        const videoId = song_index < song_queue.length ? await get_url(song_queue[song_index].title) : null;
        connections.forEach((conn) => conn.send({ type: "song", data: videoId }));
    }
}

const reveal = () => {
    if (hostPeer) {
        connections.forEach((conn) => conn.send({ type: "reveal" }));
    }
}