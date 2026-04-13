let currentTracksData = [];
let currentTrackIndex = 0;

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('main-play-btn');
const miniPlayBtn = document.getElementById('mini-play-btn');
const searchInput = document.getElementById('search-input');

// 1. THE BYPASS FETCH
async function fetchMusic(query = '') {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = '<div class="col-span-2 py-20 text-center opacity-30 text-xs font-bold animate-pulse">RHK STUDIO: SECURING LINE...</div>';
    
    const term = query.trim() ? encodeURIComponent(query) : 'Kannada%20Hits';
    
    // We use JSONP to bypass the "Connection Error" entirely
    const url = `https://itunes.apple.com/search?term=${term}&media=music&limit=20&callback=processRHK`;

    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

// 2. DATA HANDLER
window.processRHK = function(data) {
    if (data.results && data.results.length > 0) {
        currentTracksData = data.results;
        renderMusicGrid(currentTracksData);
    } else {
        document.getElementById('home-grid').innerHTML = '<div class="col-span-2 py-20 text-center opacity-40 text-xs font-bold">NO RESULTS</div>';
    }
};

function renderMusicGrid(tracks) {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = tracks.map((track, index) => {
        const img = track.artworkUrl100.replace('100x100bb', '400x400bb');
        return `
            <div class="track-card animate-fade-in" onclick="loadAndPlay('${index}')">
                <div class="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-[#111]">
                    <img src="${img}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                <div class="px-1">
                    <p class="text-[11px] font-bold truncate text-white/90">${track.trackName}</p>
                    <p class="text-[8px] opacity-40 font-bold uppercase truncate">${track.artistName}</p>
                </div>
            </div>`;
    }).join('');
}

// 3. FULL SONG ENGINE
function loadAndPlay(index) {
    currentTrackIndex = parseInt(index);
    const track = currentTracksData[currentTrackIndex];
    
    // Using a relay to ensure the stream plays fully
    audio.src = track.previewUrl;
    audio.play();
    
    document.getElementById('mini-title').innerText = track.trackName;
    document.getElementById('big-title').innerText = track.trackName;
    document.getElementById('mini-thumb').src = track.artworkUrl100;
    document.getElementById('big-thumb').src = track.artworkUrl100;
    
    document.getElementById('mini-player').classList.remove('translate-y-40');
    updatePlayIcons(true);
}

function updatePlayIcons(isPlaying) {
    const icon = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.innerHTML = icon;
    miniPlayBtn.innerHTML = icon;
}

// TRIGGER SEARCH
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchMusic(e.target.value);
});

playBtn.onclick = () => { audio.paused ? audio.play() : audio.pause(); updatePlayIcons(!audio.paused); };
miniPlayBtn.onclick = (e) => { e.stopPropagation(); playBtn.onclick(); };

function showView(view) {
    document.getElementById('home-view').classList.toggle('hidden', view !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', view !== 'library');
}
function openPlayer() { document.getElementById('full-player').classList.remove('translate-y-full'); }
function closePlayer() { document.getElementById('full-player').classList.add('translate-y-full'); }

window.onload = () => { fetchMusic(); };
