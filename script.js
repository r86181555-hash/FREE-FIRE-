const API_KEY = 'AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM';
let player;

// 1. YouTube Iframe API setup
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Player Initializing...");
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 0, 'controls': 0 },
        events: { 
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange 
        }
    });
}

function onPlayerReady() {
    console.log("Player is ready to rock!");
}

// 2. The Search Function
async function searchMusic(query) {
    if(!query) return;
    
    // Smooth transition: clear the previous results slightly
    document.getElementById('daily-mixes').style.opacity = "0.5";
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            alert("YouTube API Error: " + data.error.message);
            return;
        }

        if (data.items && data.items.length > 0) {
            document.getElementById('daily-mixes').style.opacity = "1";
            renderPremiumUI(data.items);
        }
    } catch (error) {
        console.error("System Error:", error);
    }
}

// 3. Rendering Logic
function renderPremiumUI(songs) {
    const heroSection = document.getElementById('hero-section');
    const mixContainer = document.getElementById('daily-mixes');

    // Hero Update
    const topSong = songs[0];
    const safeTitle = topSong.snippet.title.replace(/'/g, "").replace(/"/g, "");
    
    heroSection.innerHTML = `
        <img src="${topSong.snippet.thumbnails.high.url}" class="absolute inset-0 w-full h-full object-cover opacity-60">
        <div class="relative z-10 w-full">
            <h2 class="text-2xl font-black mt-2 leading-tight truncate">${safeTitle}</h2>
            <p class="text-[10px] opacity-70 mb-5">${topSong.snippet.channelTitle}</p>
            <button onclick="playSong('${topSong.id.videoId}', '${safeTitle}', '${topSong.snippet.thumbnails.high.url}')" 
                class="bg-white text-black px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                Play Now
            </button>
        </div>
    `;

    // Mixes Update
    mixContainer.innerHTML = songs.slice(1).map(song => {
        const mixTitle = song.snippet.title.replace(/'/g, "").replace(/"/g, "");
        return `
            <div onclick="playSong('${song.id.videoId}', '${mixTitle}', '${song.snippet.thumbnails.medium.url}')" 
                 class="min-w-[160px] glass-tile p-3 rounded-[2rem] cursor-pointer">
                <div class="relative mb-3">
                    <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-2xl shadow-lg">
                    <div class="absolute bottom-2 right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <i class="fa-solid fa-play text-[10px] text-white"></i>
                    </div>
                </div>
                <p class="font-bold text-[11px] truncate">${mixTitle}</p>
                <p class="text-[9px] opacity-40 uppercase">${song.snippet.channelTitle}</p>
            </div>
        `;
    }).join('');
}

// 4. Player Controls
function playSong(id, title, thumb) {
    if(!player || typeof player.loadVideoById !== 'function') {
        console.error("Player not ready yet!");
        return;
    }
    
    player.loadVideoById(id);
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    
    const miniPlayer = document.getElementById('mini-player');
    miniPlayer.style.transform = "translate(-50%, 0)"; 
}

function onPlayerStateChange(event) {
    const playIcon = document.getElementById('masterPlay');
    if (event.data == YT.PlayerState.PLAYING) {
        playIcon.classList.replace('fa-play', 'fa-pause');
    } else {
        playIcon.classList.replace('fa-pause', 'fa-play');
    }
}

document.getElementById('masterPlay').addEventListener('click', () => {
    const state = player.getPlayerState();
    state == 1 ? player.pauseVideo() : player.playVideo();
});

// 5. Initial Startup
window.onload = () => {
    // Search for trending songs automatically
    searchMusic('Top Trending Songs 2026');
};
