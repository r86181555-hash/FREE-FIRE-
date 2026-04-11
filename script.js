const GEMINI_KEY = 'AIzaSyD07yH_6W-x1eNNaJEG0-cHGrGuvkaDsLs';

// 1. ADD YOUR SONG NAMES HERE (Order matters: 1st name = 1.mp3)
const songList = [
    "Song One Name",
    "Song Two Name",
    "Song Three Name",
    "Song Four Name"
    // Keep adding names here up to 100
];

// 2. AUTO-GENERATE DATA OBJECTS
const allSongs = songList.map((name, index) => ({
    id: index + 1,
    title: name,
    file: `songs/${index + 1}.mp3`,
    thumb: `covers/${index + 1}.jpg`
}));

let audio = document.getElementById('main-audio');
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];

// 3. UI RENDERING
function renderHome() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = allSongs.map((s, idx) => `
        <div class="song-card-ui p-3 rounded-[2rem] flex flex-col animate-fade-in">
            <img src="${s.thumb}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-3 shadow-xl">
            <p class="text-[10px] font-black truncate uppercase tracking-tighter mb-3">${s.title}</p>
            <div class="flex gap-2">
                <button onclick="playTrack(${idx})" class="flex-1 bg-white text-black py-2.5 rounded-xl text-[9px] font-black uppercase">Play</button>
                <button onclick="addToLibrary(${idx})" class="w-10 bg-white/5 rounded-xl flex items-center justify-center"><i class="fa-solid fa-heart text-[10px]"></i></button>
            </div>
        </div>
    `).join('');
}

// 4. CORE ENGINE
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

document.getElementById('progress-bar').oninput = function() {
    audio.currentTime = (this.value / 100) * audio.duration;
};

document.getElementById('masterPlay').onclick = togglePlay;

// 5. VIEWS & LIBRARY
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
    list.innerHTML = library.map((s) => `
        <div class="flex items-center gap-4 p-3 rounded-2xl bg-white/5">
            <img src="${s.thumb}" class="w-10 h-10 rounded-lg object-cover">
            <p class="flex-1 text-xs font-bold truncate">${s.title}</p>
            <button onclick="playTrack(${s.id - 1})" class="text-purple-500"><i class="fa-solid fa-play"></i></button>
        </div>`).join('');
}

// 6. INITIALIZATION
function saveUser() {
    const name = document.getElementById('userNameInput').value;
    if(!name) return;
    localStorage.setItem('rhk_user_name', name);
    location.reload();
}

async function welcomeAI(name) {
    document.getElementById('user-display').innerText = name;
    const welcomeArea = document.getElementById('ai-welcome');
    welcomeArea.classList.remove('hidden');
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: `Welcome ${name} back to RHK Music Studio. 1 short sentence.` }] }] })
        });
        const data = await res.json();
        document.getElementById('welcome-text').innerText = data.candidates[0].content.parts[0].text;
    } catch (e) { document.getElementById('welcome-text').innerText = `Welcome back, ${name}!`; }
}

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

window.onload = () => {
    const name = localStorage.getItem('rhk_user_name');
    if (!name) document.getElementById('name-modal').classList.remove('hidden');
    else welcomeAI(name);
    renderHome();
};
