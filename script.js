const totalTracks = 1000;
let userPlaylist = JSON.parse(localStorage.getItem('rhk_vault')) || [];
let currentTrackId = null;

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('main-play-btn');
const miniPlayBtn = document.getElementById('mini-play-btn');

// 1. Generate 1000 Tracks
function renderTracks() {
    const grid = document.getElementById('home-grid');
    let html = '';
    for(let i = 1; i <= totalTracks; i++) {
        const isInVault = userPlaylist.includes(i);
        html += `
            <div class="track-card">
                <div class="relative aspect-square mb-3 overflow-hidden rounded-xl" onclick="loadTrack(${i})">
                    <img src="${i}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/300/111?text=RHK+${i}'">
                </div>
                <div class="flex items-center justify-between">
                    <div class="overflow-hidden mr-2" onclick="loadTrack(${i})">
                        <p class="text-[11px] font-bold truncate">Track ID #${i}</p>
                        <p class="text-[8px] opacity-40 font-bold uppercase">Series RHK</p>
                    </div>
                    <button onclick="toggleVault(${i})" id="btn-${i}" class="text-lg ${isInVault ? 'text-violet-500' : 'opacity-20'}">
                        <i class="fa-solid ${isInVault ? 'fa-circle-check' : 'fa-circle-plus'}"></i>
                    </button>
                </div>
            </div>`;
    }
    grid.innerHTML = html;
}

// 2. Load & Play
function loadTrack(id) {
    currentTrackId = id;
    audio.src = `${id}.mp3`;
    audio.play();
    
    // Update UI
    document.getElementById('mini-title').innerText = `Track ID #${id}`;
    document.getElementById('big-title').innerText = `Track ID #${id}`;
    document.getElementById('mini-thumb').src = `${id}.jpg`;
    document.getElementById('big-thumb').src = `${id}.jpg`;
    
    document.getElementById('mini-player').classList.remove('translate-y-40');
    updatePlayIcons(true);
}

function togglePlay() {
    if(audio.paused) { audio.play(); updatePlayIcons(true); }
    else { audio.pause(); updatePlayIcons(false); }
}

function updatePlayIcons(isPlaying) {
    const icon = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    playBtn.innerHTML = icon;
    miniPlayBtn.innerHTML = icon;
}

// 3. Playlist / Vault Logic
function toggleVault(id) {
    const index = userPlaylist.indexOf(id);
    if (index > -1) {
        userPlaylist.splice(index, 1); // Delete
    } else {
        userPlaylist.push(id); // Add
    }
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

    list.innerHTML = userPlaylist.map(id => `
        <div class="flex items-center bg-[#111] p-3 rounded-2xl border border-white/5 animate-fade-in">
            <div class="flex flex-1 items-center gap-4" onclick="loadTrack(${id})">
                <img src="${id}.jpg" class="w-12 h-12 rounded-lg bg-black" onerror="this.src='https://via.placeholder.com/100/111?text=${id}'">
                <div>
                    <h5 class="text-sm font-bold">Track #${id}</h5>
                    <p class="text-[9px] opacity-40 font-bold uppercase">Stored in Vault</p>
                </div>
            </div>
            <button onclick="toggleVault(${id})" class="w-10 h-10 text-red-500/50"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

// 4. Navigation & UI Controls
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

// Controls
playBtn.onclick = togglePlay;
miniPlayBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };

function nextTrack() { loadTrack(currentTrackId < totalTracks ? currentTrackId + 1 : 1); }
function prevTrack() { loadTrack(currentTrackId > 1 ? currentTrackId - 1 : totalTracks); }

// Auth logic
function login() {
    const val = document.getElementById('name-input').value;
    if(val) {
        localStorage.setItem('rhk_user', val);
        location.reload();
    }
}

window.onload = () => {
    const user = localStorage.getItem('rhk_user');
    if(!user) document.getElementById('auth-modal').classList.remove('hidden');
    else document.getElementById('user-tag').innerText = user.toUpperCase();
    
    renderTracks();
    renderVault();
};
