// script.js
const API_KEY = 'AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM';
let player;

// 1. Initialize Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        events: { 'onStateChange': onPlayerStateChange }
    });
}

// 2. Main Search Function
async function searchMusic(query) {
    if(!query) return;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&type=video&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if(data.items) {
            renderUI(data.items);
        }
    } catch (error) {
        console.error("API Error:", error);
    }
}

// 3. Inject Content into UI
function renderUI(songs) {
    const heroSection = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');

    // Update Hero (Top Song)
    const featured = songs[0];
    heroSection.innerHTML = `
        <img src="${featured.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-50 scale-105">
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div class="relative z-10 w-full">
            <h2 class="text-2xl font-bold truncate pr-10">${featured.snippet.title}</h2>
            <p class="text-xs opacity-60 mb-4">${featured.snippet.channelTitle}</p>
            <button onclick="playSong('${featured.id.videoId}', '${featured.snippet.title.replace(/'/g, "")}', '${featured.snippet.thumbnails.high.url}')" 
                class="bg-white text-black px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                Listen Now
            </button>
        </div>
    `;

    // Update Daily Mixes (Horizontal Scroll)
    mixContainer.innerHTML = songs.slice(1).map(song => `
        <div onclick="playSong('${song.id.videoId}', '${song.snippet.title.replace(/'/g, "")}', '${song.snippet.thumbnails.medium.url}')" 
             class="min-w-[170px] glass-tile p-3.5 rounded-[1.8rem] cursor-pointer group">
            <div class="relative overflow-hidden rounded-2xl mb-4">
                <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
            </div>
            <p class="font-bold text-[11px] truncate leading-tight">${song.snippet.title}</p>
            <p class="text-[9px] opacity-40 mt-1 uppercase font-bold tracking-tighter">${song.snippet.channelTitle}</p>
        </div>
    `).join('');
}

// 4. Play Functionality
function playSong(id, title, thumb) {
    player.loadVideoById(id);
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    
    // Slide up mini-player
    const miniPlayer = document.getElementById('mini-player');
    miniPlayer.style.transform = "translate(-50%, 0)";
    
    document.getElementById('masterPlay').classList.replace('fa-play', 'fa-pause');
}

function onPlayerStateChange(event) {
    const playIcon = document.getElementById('masterPlay');
    if (event.data == YT.PlayerState.PLAYING) {
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
}

// 5. Initial Load (So the home screen isn't empty)
window.onload = () => {
    searchMusic('Trending Indian Pop 2026');
};

// Play/Pause Click
document.getElementById('masterPlay').addEventListener('click', () => {
    if (player.getPlayerState() == YT.PlayerState.PLAYING) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});
