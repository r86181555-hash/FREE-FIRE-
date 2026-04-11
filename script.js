const API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
let player;

// YOUTUBE INIT
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0
        },
        events: {
            onStateChange: onPlayerStateChange
        }
    });
}

// SEARCH
async function searchMusic(query) {
    if(!query) return;

    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}`);
    const data = await res.json();

    const container = document.getElementById("daily-mixes");

    container.innerHTML = data.items.map(song => `
        <div onclick="playSong('${song.id.videoId}','${song.snippet.title}','${song.snippet.thumbnails.default.url}')">
            <img src="${song.snippet.thumbnails.default.url}">
            <p>${song.snippet.title}</p>
        </div>
    `).join('');
}

// PLAY
function playSong(id, title, thumb) {
    player.loadVideoById(id);

    document.getElementById("player-title").innerText = title;
    document.getElementById("player-thumb").src = thumb;

    document.getElementById("masterPlay").classList.replace("fa-play","fa-pause");
}

// STATE
function onPlayerStateChange(e) {
    const btn = document.getElementById("masterPlay");

    if(e.data === 1){
        btn.classList.replace("fa-play","fa-pause");
    } else {
        btn.classList.replace("fa-pause","fa-play");
    }
}

// PLAY/PAUSE BUTTON
document.getElementById("masterPlay").addEventListener("click", ()=>{
    const state = player.getPlayerState();
    state === 1 ? player.pauseVideo() : player.playVideo();
});

// 🔥 BACKGROUND PLAY FIX
document.addEventListener("visibilitychange", ()=>{
    if(document.visibilityState === "hidden" && player){
        player.playVideo();
    }
});

// AUTO LOAD
window.onload = ()=>{
    searchMusic("Top Trending Music 2026");
};
