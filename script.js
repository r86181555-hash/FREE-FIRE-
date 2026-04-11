const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;
let playlistQueue = [];
let currentTrackIndex = -1;

// 1. Initialize YouTube Engine
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 0, 'controls': 0, 'rel': 0 },
        events: { 
            'onStateChange': onPlayerStateChange,
            'onReady': () => console.log("Player Ready")
        }
    });
}

// 2. Search & Data Fetching
async function searchMusic(query) {
    if(!query) return;
    const mixContainer = document.getElementById('daily-mixes');  
    mixContainer.style.opacity = "0.6";  

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;  
  
    try {  
        const response = await fetch(url);  
        const data = await response.json();  
        if (data.items) {  
            mixContainer.style.opacity = "1";  
            renderPremiumUI(data.items);  
        }  
    } catch (error) {  
        console.error("Fetch Error:", error);
    }
}

// 3. UI Rendering for Search Results
function renderPremiumUI(songs) {
    const hero = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');

    const top = songs[0];  
    const topTitle = top.snippet.title.split('(')[0].substring(0, 40);  
    
    hero.innerHTML = `  
        <img src="${top.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-60 scale-105">  
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>  
        <div class="relative z-10 w-full">  
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-purple-400">Featured Artist</span>  
            <h2 class="text-2xl font-black mt-1 leading-tight truncate">${topTitle}</h2>  
            <p class="text-[10px] opacity-60 mb-5 font-medium">${top.snippet.channelTitle}</p>  
            <button onclick="addToQueue('${top.id.videoId}', '${topTitle.replace(/'/g, "")}', '${top.snippet.thumbnails.high.url}')"   
                class="bg-purple-600 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">  
                Play Now  
            </button>  
        </div>  
    `;  

    mixContainer.innerHTML = songs.slice(1).map(song => {  
        const cleanTitle = song.snippet.title.split('(')[0].substring(0, 30);  
        return `  
            <div onclick="addToQueue('${song.id.videoId}', '${cleanTitle.replace(/'/g, "")}', '${song.snippet.thumbnails.medium.url}')"   
                 class="min-w-[160px] glass-tile p-3.5 rounded-[2.2rem] cursor-pointer active:scale-95 transition-all group">  
                <div class="relative mb-3 overflow-hidden rounded-[1.8rem]">  
                    <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110">  
                </div>  
                <p class="font-bold text-[11px] truncate px-1">${cleanTitle}</p>  
                <p class="text-[9px] opacity-40 mt-1 px-1 font-bold uppercase tracking-tighter">${song.snippet.channelTitle}</p>  
            </div>  
        `;  
    }).join('');
}

// 4. Playlist & Playback Logic
function addToQueue(id, title, thumb) {
    const song = { id, title, thumb };
    
    // Check if song is already in queue
    const exists = playlistQueue.findIndex(s => s.id === id);
    if (exists === -1) {
        playlistQueue.push(song);
        updateQueueUI();
    }

    // If nothing is playing, start this song
    if (currentTrackIndex === -1 || player.getPlayerState() === YT.PlayerState.ENDED) {
        playTrack(playlistQueue.length - 1);
    }
}

function playTrack(index) {
    if (index < 0 || index >= playlistQueue.length) return;
    
    currentTrackIndex = index;
    const song = playlistQueue[index];
    
    player.loadVideoById(song.id);
    
    document.getElementById('player-title').innerText = song.title;  
    document.getElementById('player-thumb').src = song.thumb;  
    document.getElementById('player-artist').innerText = "Now Streaming";  
    
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";  
    updateQueueUI();
}

function updateQueueUI() {
    const queueContainer = document.getElementById('playlist-queue');
    if (playlistQueue.length === 0) {
        queueContainer.innerHTML = `<p class="text-[10px] opacity-30 italic px-2">Your playlist is empty...</p>`;
        return;
    }

    queueContainer.innerHTML = playlistQueue.map((song, index) => `
        <div onclick="playTrack(${index})" class="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${index === currentTrackIndex ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-white/5 border border-white/5 hover:bg-white/10'}">
            <img src="${song.thumb}" class="w-10 h-10 rounded-lg object-cover">
            <div class="flex-1 overflow-hidden">
                <p class="text-[11px] font-bold truncate ${index === currentTrackIndex ? 'text-purple-400' : 'text-white'}">${song.title}</p>
            </div>
            <i class="fa-solid ${index === currentTrackIndex ? 'fa-volume-high text-purple-500 animate-pulse' : 'fa-play text-white/20'} text-[10px]"></i>
        </div>
    `).join('');
}

function onPlayerStateChange(event) {
    const icon = document.getElementById('masterPlay');
    if (event.data == YT.PlayerState.PLAYING) {
        icon.classList.replace('fa-play', 'fa-pause');
    } else if (event.data == YT.PlayerState.PAUSED) {
        icon.classList.replace('fa-pause', 'fa-play');
    } 
    // AUTO-PLAY NEXT LOGIC
    else if (event.data == YT.PlayerState.ENDED) {
        if (currentTrackIndex + 1 < playlistQueue.length) {
            playTrack(currentTrackIndex + 1);
        } else {
            icon.classList.replace('fa-pause', 'fa-play');
        }
    }
}

function clearQueue() {
    playlistQueue = [];
    currentTrackIndex = -1;
    updateQueueUI();
}

// 5. Controls & Launch
document.getElementById('masterPlay').addEventListener('click', () => {
    const state = player.getPlayerState();
    state == 1 ? player.pauseVideo() : player.playVideo();
});

window.onload = () => {
    searchMusic('Top Trending Music 2026');
};
