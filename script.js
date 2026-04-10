const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 
            'autoplay': 1, 
            'controls': 0, 
            'modestbranding': 1,
            'playsinline': 1 
        },
        events: {
            'onReady': (event) => {
                event.target.unMute();
                event.target.setVolume(100);
            }
        }
    });
}

// Search Logic
async function searchMusic(query) {
    if(!query) return;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.items) renderUI(data.items);
    } catch (e) { console.error("API Error"); }
}

// Sound Fix Logic
function playSong(id, title, thumb) {
    if(!player) return;

    player.loadVideoById(id);
    
    // CRITICAL: Unmute specifically for the APK
    player.unMute();
    player.setVolume(100);

    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";

    // Extra kickstart for Android
    setTimeout(() => {
        player.playVideo();
        player.unMute();
    }, 500);
}
