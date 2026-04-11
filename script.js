const GEMINI_KEY = 'AIzaSyD07yH_6W-x1eNNaJEG0-cHGrGuvkaDsLs';

// 1. ADD REAL NAMES HERE. 
// If you only add 2 names, the rest (3-100) will show as "RHK Track #"
const realNames = [
    "My First Song", 
    "My Second Song"
];

// 2. AUTO-GENERATOR (Creates 100 slots automatically)
const allSongs = [];
for (let i = 1; i <= 100; i++) {
    allSongs.push({
        id: i,
        title: realNames[i-1] || `RHK Track ${i}`,
        file: `${i}.mp3`,
        thumb: `${i}.jpg`
    });
}

let audio = document.getElementById('main-audio');
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];

// 3. UI RENDERER
function renderHome() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = allSongs.map((s, idx) => `
        <div class="song-card-ui p-3 rounded-[2rem] flex flex-col animate-fade-in bg-white/5 border border-white/10">
            <img src="${s.thumb}" 
                 class="w-full aspect-square object-cover rounded-[1.5rem] mb-3 shadow-2xl" 
                 onerror="this.src='https://via.placeholder.com/300/a855f7/ffffff?text=RHK+MUSIC'">
            <p class="text-[11px] font-black truncate uppercase tracking-tighter mb-3 px-1">${s.title}</p>
            <div class="flex gap-2">
                <button onclick="playTrack(${idx})" class="flex-1 bg-purple-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">Play</button>
                <button onclick="addToLibrary(${idx})" class="w-12 bg-white/10 rounded-2xl flex items-center justify-center active:scale-95"><i class="fa-solid fa-plus text-[10px]"></i></button>
            </div>
        </div>
    `).join('');
}

// 4. PLAYER LOGIC
function playTrack(idx) {
    const track = allSongs[idx];
    audio.src = track.file;
    audio.play();
    
    document.getElementById('player-title').innerText = track.title;
    document.getElementById('player-thumb').src = track.thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
    document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>';
}

function togglePlay() {
    if (audio.paused) { audio.play(); document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>'; }
    else { audio.pause(); document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-play text-xs"></i>'; }
}

audio.ontimeupdate = () => {
    const prog = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-bar').value = prog;
    document.getElementById('current-time').innerText = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`;
};

// 5. NAV & INITIALIZATION
function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('btn-home').classList.add('active'); // Simple toggle
}

function addToLibrary(idx) {
    const track = allSongs[idx];
    if(!library.find(s => s.id === track.id)) {
        library.push(track);
        localStorage.setItem('rhk_library', JSON.stringify(library));
    }
}

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

window.onload = () => {
    const name = localStorage.getItem('rhk_user_name') || "Guest";
    document.getElementById('user-display').innerText = name;
    renderHome();
};

document.getElementById('masterPlay').onclick = togglePlay;
