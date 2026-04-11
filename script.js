// 1. ADD REAL NAMES HERE (Index 0 = 1.mp3, Index 1 = 2.mp3...)
const realNames = [
    "Vibe One", 
    "Chill Mix",
    "RHK Special"
];

// 2. GENERATE 100 SLOTS AUTOMATICALLY
const allSongs = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: realNames[i] || `Track ${i + 1}`,
    file: `${i + 1}.mp3`,
    thumb: `${i + 1}.jpg`
}));

const audio = document.getElementById('main-audio');
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];

// 3. RENDER FUNCTION
function renderHome() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = allSongs.map((s, idx) => `
        <div class="song-card-ui p-3 rounded-[2rem] flex flex-col animate-fade-in">
            <img src="${s.thumb}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-3" 
                 onerror="this.src='https://via.placeholder.com/300/111/fff?text=RHK+MUSIC'">
            <p class="text-[10px] font-bold truncate uppercase tracking-tighter mb-4 px-1">${s.title}</p>
            <div class="flex gap-2">
                <button onclick="playTrack(${idx})" class="flex-1 bg-white text-black py-3 rounded-2xl text-[9px] font-black uppercase">Play</button>
                <button onclick="addToLibrary(${idx})" class="w-11 bg-white/5 rounded-2xl flex items-center justify-center"><i class="fa-solid fa-plus text-[9px]"></i></button>
            </div>
        </div>
    `).join('');
}

// 4. PLAYER CONTROLS
function playTrack(idx) {
    const track = allSongs[idx];
    audio.src = track.file;
    audio.play();
    
    document.getElementById('player-title').innerText = track.title;
    document.getElementById('player-thumb').src = track.thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
    document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        document.getElementById('masterPlay').innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

audio.ontimeupdate = () => {
    const prog = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-bar').value = prog;
    document.getElementById('current-time').innerText = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`;
};

document.getElementById('progress-bar').oninput = function() {
    audio.currentTime = (this.value / 100) * audio.duration;
};

document.getElementById('masterPlay').onclick = togglePlay;

// 5. NAVIGATION
function showView(view) {
    document.getElementById('home-view').classList.toggle('hidden', view !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', view !== 'library');
    document.getElementById('btn-home').classList.toggle('active', view === 'home');
    document.getElementById('btn-lib').classList.toggle('active', view === 'library');
    if(view === 'library') updateLibraryUI();
}

function addToLibrary(idx) {
    const track = allSongs[idx];
    if(!library.find(s => s.id === track.id)) {
        library.push(track);
        localStorage.setItem('rhk_library', JSON.stringify(library));
    }
}

function updateLibraryUI() {
    const list = document.getElementById('library-list');
    list.innerHTML = library.length ? library.map(s => `
        <div class="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
            <img src="${s.thumb}" class="w-10 h-10 rounded-lg object-cover">
            <p class="flex-1 text-[11px] font-bold truncate">${s.title}</p>
            <button onclick="playTrack(${s.id - 1})" class="text-purple-500 p-2"><i class="fa-solid fa-play"></i></button>
        </div>`).join('') : '<div class="py-20 text-center opacity-20 text-[10px] font-bold uppercase tracking-widest">Library Empty</div>';
}

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

function saveUser() {
    const name = document.getElementById('userNameInput').value;
    if(name) { localStorage.setItem('rhk_user_name', name); location.reload(); }
}

window.onload = () => {
    const name = localStorage.getItem('rhk_user_name');
    if (!name) document.getElementById('name-modal').classList.remove('hidden');
    else document.getElementById('user-display').innerText = name;
    renderHome();
};
