const totalTracks = 1000;
let vault = JSON.parse(localStorage.getItem('rhk_vault')) || [];
let currentIdx = -1;
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');

// 1. Render Home Grid
function renderHome() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = ''; 
    for(let i = 1; i <= totalTracks; i++) {
        const isInVault = vault.includes(i);
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="relative aspect-square mb-4 overflow-hidden rounded-2xl shadow-lg" onclick="playSong(${i})">
                <img src="${i}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/300/111?text=${i}'">
            </div>
            <div class="flex items-center justify-between px-1">
                <div class="w-2/3" onclick="playSong(${i})">
                    <h4 class="text-[11px] font-bold truncate">Vibe ${i}</h4>
                    <p class="text-[8px] text-white/30 font-bold uppercase tracking-widest">Studio File</p>
                </div>
                <button onclick="toggleVault(${i})" class="w-8 h-8 rounded-full flex items-center justify-center ${isInVault ? 'text-violet-500 bg-violet-500/10' : 'text-white/20 bg-white/5'}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    }
}

// 2. Playback Logic
function playSong(id) {
    currentIdx = id;
    audio.src = `${id}.mp3`;
    audio.play().catch(e => console.log("File not found, but trying to play..."));
    
    // UI Updates
    document.getElementById('big-title').innerText = `Vibe ${id}`;
    document.getElementById('big-thumb').src = `${id}.jpg`;
    document.getElementById('player-bg-blur').style.background = `url(${id}.jpg) center/cover`;
    document.getElementById('full-player').classList.remove('translate-y-full');
    
    updateSaveBtnUI(id);
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// 3. AUTO-PLAY (One after another)
audio.onended = () => {
    nextTrack();
};

function nextTrack() {
    currentIdx = (currentIdx >= totalTracks) ? 1 : currentIdx + 1;
    playSong(currentIdx);
}

function prevTrack() {
    currentIdx = (currentIdx <= 1) ? totalTracks : currentIdx - 1;
    playSong(currentIdx);
}

// 4. Save/Vault System
function toggleVault(id) {
    const index = vault.indexOf(id);
    if (index > -1) {
        vault.splice(index, 1); // Delete
    } else {
        vault.push(id); // Save
    }
    localStorage.setItem('rhk_vault', JSON.stringify(vault));
    renderHome();
    renderVault();
    updateSaveBtnUI(id);
}

function updateSaveBtnUI(id) {
    const btn = document.getElementById('big-save-btn');
    const isSaved = vault.includes(id);
    btn.className = isSaved ? 'text-violet-500 text-2xl p-2' : 'text-white/20 text-2xl p-2';
    btn.onclick = () => toggleVault(id);
}

function renderVault() {
    const list = document.getElementById('library-list');
    if (vault.length === 0) {
        list.innerHTML = `<div class="py-20 text-center text-white/10 text-xs uppercase tracking-widest">No Saved Vibes</div>`;
        return;
    }
    list.innerHTML = vault.map(id => `
        <div class="vault-card flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1" onclick="playSong(${id})">
                <img src="${id}.jpg" class="w-14 h-14 rounded-xl object-cover shadow-md">
                <div>
                    <h5 class="text-sm font-bold">Vibe ${id}</h5>
                    <p class="text-[9px] text-white/30 uppercase tracking-tighter font-bold">Stored in Vault</p>
                </div>
            </div>
            <button onclick="toggleVault(${id})" class="w-10 h-10 text-red-500/40 hover:text-red-500 transition-colors">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

// 5. General UI Utilities
function closePlayer() {
    document.getElementById('full-player').classList.add('translate-y-full');
}

function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('btn-home').classList.toggle('active', v === 'home');
    document.getElementById('btn-lib').classList.toggle('active', v === 'library');
}

playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
};

audio.ontimeupdate = () => {
    const p = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-line').style.width = p + '%';
    document.getElementById('current-time').innerText = fmt(audio.currentTime);
    document.getElementById('duration-time').innerText = fmt(audio.duration || 0);
};

document.getElementById('progress-container').onclick = (e) => {
    const r = e.target.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
};

const fmt = s => Math.floor(s/60) + ":" + Math.floor(s%60).toString().padStart(2,'0');

window.onload = () => {
    renderHome();
    renderVault();
};
