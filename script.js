const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;
let currentQueue = [];
let currentIndex = 0;

// 1. Initialize YouTube Engine
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 
            'autoplay': 1, 
            'controls': 0, 
            'rel': 0, 
            'playsinline': 1, // Crucial for mobile background
            'enablejsapi': 1 
        },
        events: { 
            'onStateChange': onPlayerStateChange,
            'onReady': () => console.log("RHK Engine Active")
        }
    });
}

// 2. Search & Queue Management
async function searchMusic(query) {
    if(!query) return;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;  
    
    try {  
        const response = await fetch(url);  
        const data = await response.json();  
        if (data.items) {  
            currentQueue = data.items;
            renderPremiumUI(data.items);  
        }  
    } catch (e) { console.error("API Error:", e); }
}

// 3. Playback Logic + Background Controls
function playSong(index) {
    if(!player || !currentQueue[index]) return;
    currentIndex = index;
    const song = currentQueue[index];
    const id = song.id.videoId;
    const title = song.snippet.title;
    const thumbnail = song.snippet.thumbnails.high.url;

    player.loadVideoById(id);
    
    // Update UI
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumbnail;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";

    // ENABLE BACKGROUND PLAYBACK (Media Session API)
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: title,
            artist: "RHK Premium",
            album: "RHK Music",
            artwork: [
                { src: thumbnail, sizes: '512x512', type: 'image/png' }
            ]
        });

        // Lock Screen Controls
        navigator.mediaSession.setActionHandler('play', () => player.playVideo());
        navigator.mediaSession.setActionHandler('pause', () => player.pauseVideo());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
    }
}

// 4. Player State & Auto-Next
function onPlayerStateChange(event) {
    const playBtnIcon = document.querySelector('#masterPlay i');
    
    if (event.data == YT.PlayerState.PLAYING) {
        playBtnIcon.className = 'fa-solid fa-pause';
        // Update Media Session state
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "playing";
    } else {
        playBtnIcon.className = 'fa-solid fa-play';
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
    }

    // AUTO PLAY NEXT
    if (event.data == YT.PlayerState.ENDED) {
        playNext();
    }
}

function playNext() {
    if (currentIndex < currentQueue.length - 1) {
        playSong(currentIndex + 1);
    } else {
        playSong(0); // Loop to start
    }
}

function playPrev() {
    if (currentIndex > 0) {
        playSong(currentIndex - 1);
    }
}

// 5. Button Listeners
document.getElementById('masterPlay').onclick = () => {
    const state = player.getPlayerState();
    state == 1 ? player.pauseVideo() : player.playVideo();
};

document.getElementById('nextTrack').onclick = () => playNext();

// 6. UI Rendering (Preserved Design)
function renderPremiumUI(songs) {
    const hero = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');
    
    const top = songs[0];
    hero.innerHTML = `
        <img src="${top.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-50">
        <div class="relative z-10 w-full p-2">
            <h2 class="text-2xl font-black truncate">${top.snippet.title}</h2>
            <button onclick="playSong(0)" class="mt-4 bg-purple-600 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all">Play Now</button>
        </div>
    `;

    mixContainer.innerHTML = songs.map((song, index) => `
        <div onclick="playSong(${index})" class="min-w-[160px] glass-tile p-3 rounded-[2rem] cursor-pointer active:scale-95 transition-all">
            <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square rounded-[1.5rem] object-cover mb-3">
            <p class="font-bold text-[11px] truncate">${song.snippet.title}</p>
        </div>
    `).join('');
}

window.onload = () => searchMusic('Trending Hits 2026');
