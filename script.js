const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;
let currentQueue = [];
let currentIndex = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 1, 'controls': 0, 'rel': 0, 'playsinline': 1 },
        events: { 
            'onStateChange': onPlayerStateChange,
            'onReady': () => { console.log("Engine Ready"); }
        }
    });
}

async function searchMusic(query) {
    if(!query) return;
    const mixContainer = document.getElementById('daily-mixes');  
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;  
    
    try {  
        const response = await fetch(url);  
        const data = await response.json();  
        if (data.items) {  
            currentQueue = data.items;
            renderPremiumUI(data.items);  
        }  
    } catch (e) { console.error(e); }
}

function renderPremiumUI(songs) {
    const hero = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');
    
    const top = songs[0];
    hero.innerHTML = `
        <img src="${top.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-50">
        <div class="relative z-10 w-full p-2">
            <h2 class="text-2xl font-black truncate">${top.snippet.title}</h2>
            <button onclick="playSong(0)" class="mt-4 bg-purple-600 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">Play Now</button>
        </div>
    `;

    mixContainer.innerHTML = songs.map((song, index) => `
        <div onclick="playSong(${index})" class="min-w-[160px] glass-tile p-3 rounded-[2rem] cursor-pointer active:scale-95 transition-all">
            <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square rounded-[1.5rem] object-cover mb-3">
            <p class="font-bold text-[11px] truncate">${song.snippet.title}</p>
        </div>
    `).join('');
}

function playSong(index) {
    if(!player || !currentQueue[index]) return;
    currentIndex = index;
    const song = currentQueue[index];
    const id = song.id.videoId;
    
    player.loadVideoById(id);
    
    document.getElementById('player-title').innerText = song.snippet.title;
    document.getElementById('player-thumb').src = song.snippet.thumbnails.medium.url;
    
    const mini = document.getElementById('mini-player');
    mini.style.transform = "translate(-50%, 0)";
}

function onPlayerStateChange(event) {
    const btn = document.getElementById('masterPlay').querySelector('i');
    
    // Update Icons
    if (event.data == YT.PlayerState.PLAYING) {
        btn.className = 'fa-solid fa-pause';
    } else {
        btn.className = 'fa-solid fa-play';
    }

    // AUTO PLAY NEXT TRACK
    if (event.data == YT.PlayerState.ENDED) {
        playNext();
    }
}

function playNext() {
    if (currentIndex < currentQueue.length - 1) {
        playSong(currentIndex + 1);
    } else {
        playSong(0); // Loop back to start
    }
}

// Master Controls
document.getElementById('masterPlay').addEventListener('click', () => {
    const state = player.getPlayerState();
    state == 1 ? player.pauseVideo() : player.playVideo();
});

document.getElementById('nextTrack').addEventListener('click', playNext);

window.onload = () => searchMusic('Trending Hits 2026');
