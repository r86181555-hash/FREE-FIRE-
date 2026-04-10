// 1. YOUR API CONFIG
const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4'; // Ensure this is from an ACTIVE project
let player;

// 2. Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 
            'autoplay': 1, 
            'controls': 0, 
            'origin': window.location.origin 
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Force unmute as soon as the player is ready for the APK
    event.target.unMute();
    event.target.setVolume(100);
}

// 3. The Search Engine (For KGF and more)
async function searchMusic(query) {
    if(!query) return;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items) {
            renderUI(data.items);
        }
    } catch (e) {
        console.log("Search failed, check API key.");
    }
}

// 4. The Playback Engine (The "Sound Fix" is here)
function playSong(id, title, thumb) {
    if(!player) return;

    // Load and Force Unmute
    player.loadVideoById(id);
    player.unMute(); 
    player.setVolume(100);

    // Update Player UI
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";

    // Extra "Kickstart" for Android WebViews
    setTimeout(() => {
        player.playVideo();
        player.unMute();
    }, 800);
}

// Load trending hits on startup
window.onload = () => {
    searchMusic('New Kannada Hit Songs');
};
