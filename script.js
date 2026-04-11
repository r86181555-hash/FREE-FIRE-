// 1. DATA SETUP
const songNames = [
    { title: "Loneliness", artist: "Putri Ariani" },
    { title: "Whispering Embers", artist: "Luna Nova" },
    { title: "Break Again", artist: "Rony Nugraha" }
];

const allSongs = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: songNames[i]?.title || `RHK Track ${i + 1}`,
    artist: songNames[i]?.artist || "Premium Music",
    file: `${i + 1}.mp3`,
    thumb: `${i + 1}.jpg`
}));

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');
let currentTrackIndex = -1;
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];
let isPlayingFromLibrary = false;

// 2. RENDERING
function renderMusic(list = allSongs) {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = list.map((s) => {
        const isLiked = library.some(l => l.id === s.id);
        return `
        <div class="song-card">
            <div class="relative mb-3 group" onclick="startPlay('${s.id}', false)">
                <img src="${s.thumb}" class="w-full aspect-square object-cover rounded-[1.5rem]" onerror="this.src='https://via.placeholder.com/150/111/333?text=MUSIC'">
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[1.5rem] transition-all">
                    <i class="fa-solid fa-play text-[#1DB954] text-xl"></i>
                </div>
            </div>
            <div class="flex justify-between items-start px-1">
                <div class="overflow-hidden" onclick="startPlay('${s.id}', false)">
                    <p class="text-[11px] font-bold truncate">${s.title}</p>
                    <p class="text-[8px] text-gray-500 font-bold uppercase">${s.artist}</p>
                </div>
                <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart text-[10px] mt-1 ${isLiked ? 'text-[#1DB954]' : 'opacity-20'}" onclick="toggleLike(${s.id-1})"></i>
            </div>
        </div>`;
    }).join('');
}

// 3. SEARCH
function searchMusic() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allSongs.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
    renderMusic(filtered);
}

// 4. PLAYBACK ENGINE (Handles Auto-play "One by One")
function startPlay(id, fromLibrary) {
    isPlayingFromLibrary = fromLibrary;
    const listToUse = fromLibrary ? library : allSongs;
    const idx = listToUse.findIndex(s => s.id == id);
    
    if (idx !== -1) {
        currentTrackIndex = idx;
        loadAndPlay(listToUse[idx]);
    }
}

function loadAndPlay(track) {
    audio.src = track.file;
    audio.play();
    document.getElementById('player-title').innerText = track.title;
    document.getElementById('player-artist').innerText = track.artist;
    document.getElementById('player-thumb').src = track.thumb;
    document.getElementById('mini-player').style.transform = "translateY(0)";
    playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xs"></i>';
}

audio.onended = () => {
    const listToUse = isPlayingFromLibrary ? library : allSongs;
    currentTrackIndex = (currentTrackIndex + 1) % listToUse.length;
    loadAndPlay(listToUse[currentTrackIndex]);
};

function nextTrack() {
    const listToUse = isPlayingFromLibrary ? library : allSongs;
    currentTrackIndex = (currentTrackIndex + 1) % listToUse.length;
    loadAndPlay(listToUse[currentTrackIndex]);
}

function prevTrack() {
    const listToUse = isPlayingFromLibrary ? library : allSongs;
    currentTrackIndex = (currentTrackIndex - 1 + listToUse.length) % listToUse.length;
    loadAndPlay(listToUse[currentTrackIndex]);
}

playBtn.onclick = () => {
    if (audio.paused) { audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xs"></i>'; }
    else { audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play text-black text-xs"></i>'; }
};

// 5. LIBRARY SYSTEM
function toggleLike(idx) {
    const track = allSongs[idx];
    const foundIdx = library.findIndex(s => s.id === track.id);
    if (foundIdx > -1) library.splice(foundIdx, 1);
    else library.push(track);
    
    localStorage.setItem('rhk_library', JSON.stringify(library));
    renderMusic();
    if(!document.getElementById('library-view').classList.contains('hidden')) updateLibraryUI();
}

function updateLibraryUI() {
    const list = document.getElementById('library-list');
    list.innerHTML = library.length ? library.map(s => `
        <div class="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-3xl" onclick="startPlay('${s.id}', true)">
            <img src="${s.thumb}" class="w-12 h-12 rounded-xl object-cover">
            <div class="flex-1">
                <p class="text-xs font-bold">${s.title}</p>
                <p class="text-[9px] text-gray-500 font-bold">${s.artist}</p>
            </div>
            <i class="fa-solid fa-play text-[#1DB954] text-xs"></i>
        </div>`).join('') : '<p class="text-center opacity-20 py-20 text-xs">No liked songs yet</p>';
}

// 6. SYSTEM UI
function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('btn-home').classList.toggle('active', v === 'home');
    document.getElementById('btn-lib').classList.toggle('active', v === 'library');
    if(v === 'library') updateLibraryUI();
}

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
audio.ontimeupdate = () => {
    const val = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-bar').value = val;
    document.getElementById('current-time').innerText = fmt(audio.currentTime);
    document.getElementById('duration-time').innerText = fmt(audio.duration || 0);
};

function saveUser() {
    const name = document.getElementById('userNameInput').value;
    if(name) { localStorage.setItem('rhk_user_name', name); location.reload(); }
}

window.onload = () => {
    const name = localStorage.getItem('rhk_user_name');
    if (!name) document.getElementById('name-modal').classList.remove('hidden');
    else document.getElementById('user-display').innerText = name;
    renderMusic();
};
