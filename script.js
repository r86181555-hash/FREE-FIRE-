// script.js
const API_KEY = 'AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM';
let player;

// 1. YouTube Iframe API setup
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

// 2. The Search Function (This is what processes your "KGF song" search)
async function searchMusic(query) {
    if(!query) return;
    
    // Show a loading state (Optional but feels premium)
    console.log("Searching for:", query);
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            renderPremiumUI(data.items);
        } else {
            console.log("No results found. Check if API Key is restricted.");
        }
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

// 3. Transformation Layer: Turning YT data into "RHK Music" style
function renderPremiumUI(songs) {
    const heroSection = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');

    // Hero - The "Big Designer" look for the first result
    const topSong = songs[0];
    const cleanTitle = topSong.snippet.title.split('(')[0].split('|')[0]; // Cleans "KGF (Official Video)" to "KGF"

    heroSection.innerHTML = `
        <img src="${topSong.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-60">
        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        <div class="relative z-10 w-full">
            <span class="bg-purple-600/80 text-[8px] px-2 py-1 rounded-md font-bold uppercase tracking-widest">Trending Now</span>
            <h2 class="text-2xl font-black mt-2 leading-tight truncate">${cleanTitle}</h2>
            <p class="text-[10px] opacity-70 mb-5 font-medium">${topSong.snippet.channelTitle}</p>
            <button onclick="playSong('${topSong.id.videoId}', '${cleanTitle.replace(/'/g, "")}', '${topSong.snippet.thumbnails.high.url}')" 
                class="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                Play Song
            </button>
        </div>
    `;

    // Daily Mixes - Grid/Scroll display
    mixContainer.innerHTML = songs.slice(1).map(song => {
        const displayTitle = song.snippet.title.split('(')[0].substring(0, 35);
        return `
            <div onclick="playSong('${song.id.videoId}', '${displayTitle.replace(/'/g, "")}', '${song.snippet.thumbnails.medium.url}')" 
                 class="min-w-[160px] glass-tile p-3 rounded-[2rem] cursor-pointer active:scale-95 transition-all">
                <div class="relative mb-3">
                    <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-2xl shadow-lg">
                    <div class="absolute bottom-2 right-2 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <i class="fa-solid fa-play text-[8px] text-white"></i>
                    </div>
                </div>
                <p class="font-bold text-[11px] truncate px-1">${displayTitle}</p>
                <p class="text-[9px] opacity-40 mt-1 px-1 font-semibold uppercase tracking-tighter">${song.snippet.channelTitle}</p>
            </div>
        `;
    }).join('');
}

// 4. Player Controls
function playSong(id, title, thumb) {
    if(!player) return;
    player.loadVideoById(id);
    
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('player-artist').innerText = "Playing from YouTube";
    
    const miniPlayer = document.getElementById('mini-player');
    miniPlayer.style.transform = "translate(-50%, 0)"; // Slide up
}

function onPlayerStateChange(event) {
    const playIcon = document.getElementById('masterPlay');
    if (event.data == YT.PlayerState.PLAYING) {
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
}

// Master play/pause toggle
document.getElementById('masterPlay').addEventListener('click', () => {
    const state = player.getPlayerState();
    if (state == 1) { player.pauseVideo(); } else { player.playVideo(); }
});

// 5. Initial Startup
window.onload = () => {
    // This fills your app with content the moment you open it
    searchMusic('New Kannada Hits 2026'); 
};
