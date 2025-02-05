// get username => localStorage.getItem('userName') 

queue = []
index = 0

answers = []
skip = 0


function playVideo() {
    var iframe = document.querySelector('iframe');
    if (iframe) {
        var iframeSrc = iframe.src;
        iframe.src = iframeSrc + (iframeSrc.includes('?') ? '&' : '?') + 'autoplay=1';
    }
}

function extractVideoID(url) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/|v\/|e\/|.*\/v=))([^#&?\n]*)/);
    return match ? match[1] : null;
}

function loadVideo(videoID) {
    document.getElementById('player').src = `https://www.youtube-nocookie.com/embed/${videoID}?autoplay=1&controls=0&rel=0&fs=0`;
}

async function getFirstYouTubeResult(query) {
    const apiKey = "YOUR_YOUTUBE_API_KEY";
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
        const response = await fetch(searchUrl);
        const text = await response.text();
        const match = text.match(/\"videoId\":\"([^\"]+)\"/);

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


async function add_song(type){
    let url = document.getElementById('video-url').value;
    let videoID = extractVideoID(url);
    
    if (!videoID){
        videoID = extractVideoID(await getFirstYouTubeResult(url))
    }
    
    if (videoID) {
        queue.push({
            name: videoID,
            type: type,
            sender: localStorage.getItem('userName')
        });
        document.getElementById('video-url').value = '';
        if (queue.length === 1) {
            loadVideo(videoID);
        }
    } else {
        alert(`Invalid YouTube URL:${url}`);
    }
}

function skip_song(){
    if (queue.length > 0 && index < queue.length - 1) {
        index++;
        loadVideo(queue[index]);
    } else {
        alert('No more videos in the queue.');
    }
}

function submit(answer){
    answers.push([localStorage.getItem('userName'), answer]);
}

