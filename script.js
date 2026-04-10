const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;

// 1. Initialize Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: { 'autoplay': 1, 'controls': 0, 'playsinline': 1 },
        events: {
            'onReady': (event) => {
                event.target.unMute();
                event.target.setVolume(100);
            }
        }
    });
}

// 2. Search Function
async function searchMusic(query) {
    if(!query) return;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            renderUI(data.items);
        } else {
            console.log("No results found or API error");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// 3. UI Rendering
function renderUI(songs) {
    const mixContainer = document.getElementById('daily-mixes');
    if(!mixContainer) return;

    mixContainer.innerHTML = songs.map(song => {
        const title = song.snippet.title.substring(0, 25);
        return `
            <div onclick="playSong('${song.id.videoId}', '${title.replace(/'/g, "")}', '${song.snippet.thumbnails.medium.url}')" 
                 class="min-w-[160px] glass-tile p-3 rounded-[2rem] cursor-pointer">
                <img src="${song.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-2">
                <p class="font-bold text-[11px] truncate">${title}</p>
                <p class="text-[9px] opacity-50">${song.snippet.channelTitle}</p>
            </div>
        `;
    }).join('');
}

// 4. Play Function with Sound Fix
function playSong(id, title, thumb) {
    if(!player) return;
    player.loadVideoById(id);
    player.unMute();
    player.setVolume(100);
    
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
    
    setTimeout(() => { player.playVideo(); player.unMute(); }, 500);
}

// Start with KGF songs automatically
window.onload = () => {
    searchMusic('KGF Songs');
};
