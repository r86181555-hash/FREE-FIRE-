const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;

// 1. Initialize the YouTube Engine
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 0, 'controls': 0, 'rel': 0 },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

// 2. Main Search & Data Fetching
async function searchMusic(query) {
    if(!query) return;
    
    // Smooth loading state
    const mixContainer = document.getElementById('daily-mixes');
    mixContainer.style.opacity = "0.6";

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            mixContainer.style.opacity = "1";
            renderPremiumUI(data.items);
        } else if (data.error) {
            console.error("Quota or Key Error:", data.error.message);
            loadFallbackContent(); // Prevents empty screen
        }
    } catch (error) {
        loadFallbackContent();
    }
}

// 3. Display Logic (Mapping YouTube data to your High-End Design)
function renderPremiumUI(songs) {
    const hero = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');

    // Update the "Editor's Choice" Hero Card
    const top = songs[0];
    const topTitle = top.snippet.title.split('(')[0].substring(0, 40);
    
    hero.innerHTML = `
        <img src="${top.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div class="relative z-10 w-full">
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400">Featured Artist</span>
            <h2 class="text-2xl font-black mt-1 leading-tight truncate">${topTitle}</h2>
            <p class="text-[10px] opacity-60 mb-5 font-medium">${top.snippet.channelTitle}</p>
            <button onclick="playSong('${top.id.videoId}', '${topTitle.replace(/'/g, "")}', '${top.snippet.thumbnails.high.url}')" 
                class="bg-purple-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                Play Now
            </button>
        </div>
    `;

    // Update "Daily Mixes" Horizontal Scroll
    mixContainer.innerHTML = songs.slice(1).map(song => {
        const cleanTitle = song.snippet.title.split('(')[0].substring(0, 30);
        return `
            <div onclick="playSong('${song.id.videoId}', '${cleanTitle.replace(/'/g, "")}', '${song.snippet.thumbnails.medium.url}')" 
                 class="min-w-[160px] glass-tile p-3.5 rounded-[2.2rem] cursor-pointer active:scale-95 transition-all group">
                <div class="relative mb-3 overflow-hidden rounded-[1.8rem]">
                    <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent"></div>
                </div>
                <p class="font-bold text-[11px] truncate px-1">${cleanTitle}</p>
                <p class="text-[9px] opacity-40 mt-1 px-1 font-bold uppercase tracking-tighter">${song.snippet.channelTitle}</p>
            </div>
        `;
    }).join('');
}

// 4. Playback Engine
function playSong(id, title, thumb) {
    if(!player) return;
    player.loadVideoById(id);
    
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('player-artist').innerText = "Now Streaming";
    
    // Slide up the mini player smoothly
    const mini = document.getElementById('mini-player');
    mini.style.transform = "translate(-50%, 0)";
    document.getElementById('masterPlay').classList.replace('fa-play', 'fa-pause');
}

function onPlayerStateChange(event) {
    const icon = document.getElementById('masterPlay');
    if (event.data == YT.PlayerState.PLAYING) {
        icon.classList.replace('fa-play', 'fa-pause');
    } else {
        icon.classList.replace('fa-pause', 'fa-play');
    }
}

// 5. Automatic Home Loading
window.onload = () => {
    // Fills your app with trending hits immediately on launch
    searchMusic('Top Trending Music 2026');
};

function loadFallbackContent() {
    // Add logic here to show local cards if the API fails
    console.log("Using local design mode...");
}

// Master Play/Pause
document.getElementById('masterPlay').addEventListener('click', () => {
    const state = player.getPlayerState();
    state == 1 ? player.pauseVideo() : player.playVideo();
});
