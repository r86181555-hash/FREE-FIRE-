const totalTracks = 1000;
let vault = JSON.parse(localStorage.getItem('rhk_vault')) || [];
let currentIdx = -1;

const audio = document.getElementById('main-audio');
const video = document.getElementById('main-video');
const playBtn = document.getElementById('masterPlay');
const vPlayBtn = document.getElementById('video-play-btn');

// 1. Render Home Grid with Video Button
function renderHome() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = ''; 
    for(let i = 1; i <= totalTracks; i++) {
        const isSaved = vault.includes(i);
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="relative aspect-square mb-4 overflow-hidden rounded-2xl group" onclick="playSong(${i})">
                <img src="${i}.jpg" class="w-full h-full object-cover">
                <button onclick="event.stopPropagation(); playVideo(${i})" class="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white text-xs hover:bg-violet-600 transition-colors">
                    <i class="fa-solid fa-video"></i>
                </button>
            </div>
            <div class="flex items-center justify-between px-1">
                <div class="w-2/3" onclick="playSong(${i})">
                    <h4 class="text-[11px] font-bold truncate">Vibe ${i}</h4>
                </div>
                <button onclick="toggleVault(${i})" class="text-xl ${isSaved ? 'text-violet-500' : 'text-white/20'}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    }
}

// 2. Audio Engine
function playSong(id) {
    if (id < 1 || id > totalTracks) return;
    currentIdx = id;
    video.pause(); // Stop video if music starts
    audio.src = `${id}.mp3`;
    audio.load();
    audio.play();
    
    document.getElementById('big-title').innerText = `Vibe ${id}`;
    document.getElementById('big-thumb').src = `${id}.jpg`;
    document.getElementById('player-bg-blur').style.background = `url(${id}.jpg) center/cover`;
    document.getElementById('full-player').classList.remove('translate-y-full');
    
    updateBigHeart(id);
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// 3. Video Engine
function playVideo(id) {
    if (id < 1 || id > totalTracks) return;
    currentIdx = id;
    audio.pause(); // Stop music if video starts
    video.src = `${id}.mp4`;
    video.load();
    video.play();
    
    document.getElementById('video-title').innerText = `Cinema: Vibe ${id}`;
    document.getElementById('video-player').classList.remove('translate-y-full');
    vPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

// 4. Auto-Play Next (Audio & Video)
audio.onended = () => nextTrack();
video.onended = () => nextVideo();

function nextTrack() {
    currentIdx = (currentIdx >= totalTracks) ? 1 : currentIdx + 1;
    playSong(currentIdx);
}

function prevTrack() {
    currentIdx = (currentIdx <= 1) ? totalTracks : currentIdx - 1;
    playSong(currentIdx);
}

function nextVideo() {
    currentIdx = (currentIdx >= totalTracks) ? 1 : currentIdx + 1;
    playVideo(currentIdx);
}

function prevVideo() {
    currentIdx = (currentIdx <= 1) ? totalTracks : currentIdx - 1;
    playVideo(currentIdx);
}

// 5. Vault & UI Logic
function toggleVault(id) {
    const index = vault.indexOf(id);
    if (index > -1) vault.splice(index, 1);
    else vault.push(id);
    localStorage.setItem('rhk_vault', JSON.stringify(vault));
    renderHome();
    renderVault();
    updateBigHeart(id);
}

function updateBigHeart(id) {
    const bigHeart = document.getElementById('player-heart-btn');
    bigHeart.className = `text-3xl transition-all ${vault.includes(id) ? 'text-violet-500' : 'text-white/20'}`;
    bigHeart.onclick = () => toggleVault(id);
}

function renderVault() {
    const list = document.getElementById('library-list');
    if (vault.length === 0) { list.innerHTML = `<p class="text-center text-white/10 mt-20">Your vault is empty.</p>`; return; }
    list.innerHTML = vault.map(id => `
        <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
            <div class="flex items-center gap-4 flex-1" onclick="playSong(${id})">
                <img src="${id}.jpg" class="w-12 h-12 rounded-lg object-cover">
                <h5 class="text-sm font-bold">Vibe ${id}</h5>
            </div>
            <button onclick="toggleVault(${id})" class="text-red-500/50 p-2"><i class="fa-solid fa-trash-can"></i></button>
        </div>
    `).join('');
}

// UI Controls
function closePlayer() { document.getElementById('full-player').classList.add('translate-y-full'); }
function closeVideo() { video.pause(); document.getElementById('video-player').classList.add('translate-y-full'); }

function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('btn-home').classList.toggle('active', v === 'home');
    document.getElementById('btn-lib').classList.toggle('active', v === 'library');
}

// Play/Pause Toggles
playBtn.onclick = () => {
    if (audio.paused) { audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; }
    else { audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; }
};

vPlayBtn.onclick = () => {
    if (video.paused) { video.play(); vPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; }
    else { video.pause(); vPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; }
};

// Progress Trackers
audio.ontimeupdate = () => {
    document.getElementById('progress-line').style.width = (audio.currentTime / audio.duration) * 100 + '%';
};

video.ontimeupdate = () => {
    document.getElementById('video-progress-line').style.width = (video.currentTime / video.duration) * 100 + '%';
};

window.onload = () => { renderHome(); renderVault(); };
