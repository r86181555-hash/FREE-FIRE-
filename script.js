let allSongs = JSON.parse(localStorage.getItem('rhk_songs')) || [];
let userPlaylist = JSON.parse(localStorage.getItem('rhk_vault')) || [];
let currentTrackIndex = 0;
let tempImageData = "";

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('main-play-btn');
const miniPlayBtn = document.getElementById('mini-play-btn');

// --- 1. AUTO-PLAY NEXT SONG ---
audio.onended = () => {
    nextTrack();
};

// --- 2. SECRET ADMIN TRIGGER (Long Press RHK STUDIO) ---
const adminTrigger = document.getElementById('admin-trigger');
let pressTimer;

adminTrigger.addEventListener('mousedown', startPress);
adminTrigger.addEventListener('touchstart', startPress);
adminTrigger.addEventListener('mouseup', cancelPress);
adminTrigger.addEventListener('touchend', cancelPress);

function startPress() {
    pressTimer = window.setTimeout(() => {
        toggleAdmin(true);
    }, 3000); // 3 Seconds to open
}

function cancelPress() {
    clearTimeout(pressTimer);
}

function toggleAdmin(show) {
    document.getElementById('admin-modal').classList.toggle('hidden', !show);
}

// --- 3. CORE LOGIC (Modified for your Admin needs) ---
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            tempImageData = e.target.result;
            document.getElementById('file-label').innerText = "IMAGE READY ✓";
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function addSong() {
    const name = document.getElementById('admin-name').value;
    const url = document.getElementById('admin-url').value;

    if(!name || !url || !tempImageData) return alert("Fill all details!");

    allSongs.push({ id: Date.now(), name, url, image: tempImageData });
    localStorage.setItem('rhk_songs', JSON.stringify(allSongs));
    
    // Clear Form
    document.getElementById('admin-name').value = "";
    document.getElementById('admin-url').value = "";
    tempImageData = "";
    document.getElementById('file-label').innerText = "Upload Cover Image";
    
    toggleAdmin(false);
    renderTracks();
}

function renderTracks() {
    const grid = document.getElementById('home-grid');
    if(allSongs.length === 0) {
        grid.innerHTML = '<div class="col-span-2 py-20 text-center opacity-20 text-xs font-bold uppercase tracking-widest">Studio Empty</div>';
        return;
    }

    grid.innerHTML = allSongs.map((song, index) => {
        const isInVault = userPlaylist.some(s => s.id === song.id);
        return `
            <div class="track-card animate-fade-in">
                <div class="relative aspect-square mb-3 overflow-hidden rounded-xl" onclick="loadTrack(${index})">
                    <img src="${song.image}" class="w-full h-full object-cover">
                </div>
                <div class="flex items-center justify-between">
                    <div class="overflow-hidden mr-2" onclick="loadTrack(${index})">
                        <p class="text-[11px] font-bold truncate">${song.name}</p>
                        <p class="text-[8px] opacity-40 font-bold uppercase">RHK Elite</p>
                    </div>
                    <button onclick="toggleVault(${song.id})" class="text-lg ${isInVault ? 'text-violet-500' : 'opacity-20'}">
                        <i class="fa-solid ${isInVault ? 'fa-circle-check' : 'fa-circle-plus'}"></i>
                    </button>
                </div>
            </div>`;
    }).join('');
}

function loadTrack(index) {
    currentTrackIndex = index;
    const song = allSongs[index];
    audio.src = song.url;
    audio.play();
    
    document.getElementById('mini-title').innerText = song.name;
    document.getElementById('big-title').innerText = song.name;
    document.getElementById('mini-thumb').src = song.image;
    document.getElementById('big-thumb').src = song.image;
    document.getElementById('mini-player').classList.remove('translate-y-40');
    updatePlayIcons(true);
}

function nextTrack() {
    let next = currentTrackIndex + 1;
    if(next >= allSongs.length) next = 0;
    if(allSongs.length > 0) loadTrack(next);
}

function prevTrack() {
    let prev = currentTrackIndex - 1;
    if(prev < 0) prev = allSongs.length - 1;
    if(allSongs.length > 0) loadTrack(prev);
}

// Keep your existing togglePlay, updatePlayIcons, toggleVault, renderVault, 
// showView, openPlayer, closePlayer, formatTime, login and window.onload functions here...

function togglePlay() {
    if(audio.paused) { audio.play(); updatePlayIcons(true); }
    else { audio.pause(); updatePlayIcons(false); }
}

function updatePlayIcons(isPlaying) {
    const icon = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.innerHTML = icon;
    miniPlayBtn.innerHTML = icon;
}

function toggleVault(id) {
    const song = allSongs.find(s => s.id === id);
    const index = userPlaylist.findIndex(s => s.id === id);
    if (index > -1) userPlaylist.splice(index, 1);
    else userPlaylist.push(song);
    localStorage.setItem('rhk_vault', JSON.stringify(userPlaylist));
    renderTracks();
    renderVault();
}

function renderVault() {
    const list = document.getElementById('library-list');
    document.getElementById('vault-count').innerText = `${userPlaylist.length} TRACKS`;
    if(userPlaylist.length === 0) {
        list.innerHTML = `<div class="py-20 text-center opacity-20 font-bold">YOUR VAULT IS EMPTY</div>`;
        return;
    }
    list.innerHTML = userPlaylist.map(song => `
        <div class="flex items-center bg-[#111] p-3 rounded-2xl border border-white/5 animate-fade-in">
            <div class="flex flex-1 items-center gap-4" onclick="loadTrackById(${song.id})">
                <img src="${song.image}" class="w-12 h-12 rounded-lg object-cover bg-black">
                <div><h5 class="text-sm font-bold">${song.name}</h5><p class="text-[9px] opacity-40 font-bold uppercase">Stored in Vault</p></div>
            </div>
            <button onclick="toggleVault(${song.id})" class="w-10 h-10 text-red-500/50"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

function loadTrackById(id) {
    const idx = allSongs.findIndex(s => s.id === id);
    if(idx !== -1) loadTrack(idx);
}

function showView(view) {
    document.getElementById('home-view').classList.toggle('hidden', view !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', view !== 'library');
    document.getElementById('nav-home').classList.toggle('active', view === 'home');
    document.getElementById('nav-lib').classList.toggle('active', view === 'library');
}

function openPlayer() { document.getElementById('full-player').classList.remove('translate-y-full'); }
function closePlayer() { document.getElementById('full-player').classList.add('translate-y-full'); }

audio.ontimeupdate = () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('seek-bar-fill').style.width = pct + '%';
    document.getElementById('cur-time').innerText = formatTime(audio.currentTime);
    document.getElementById('dur-time').innerText = formatTime(audio.duration || 0);
};

function formatTime(s) {
    return Math.floor(s/60) + ":" + Math.floor(s%60).toString().padStart(2, '0');
}

playBtn.onclick = togglePlay;
miniPlayBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };

function login() {
    const val = document.getElementById('name-input').value;
    if(val) { localStorage.setItem('rhk_user', val); location.reload(); }
}

function clearAllData() {
    if(confirm("Wipe Database?")) { localStorage.clear(); location.reload(); }
}

window.onload = () => {
    const user = localStorage.getItem('rhk_user');
    if(!user) document.getElementById('auth-modal').classList.remove('hidden');
    else document.getElementById('user-tag').innerText = user.toUpperCase();
    renderTracks();
    renderVault();
};
