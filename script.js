const totalTracks = 1000;
let vault = JSON.parse(localStorage.getItem('rhk_vault')) || [];
let currentId = null;
let isLoop = false;
let isShuffle = false;

const audio = document.getElementById('main-audio');
const masterPlay = document.getElementById('master-play');
const miniPlay = document.getElementById('mini-play-btn');

// 1. SPLASH SCREEN & INITIALIZATION
window.onload = () => {
    setTimeout(() => {
        document.getElementById('splash').style.opacity = '0';
        document.getElementById('app-content').style.opacity = '1';
        setTimeout(() => document.getElementById('splash').remove(), 1000);
    }, 2500);

    filterLibrary('all'); // Initial Load
    renderVault();
};

// 2. CATEGORY FILTERING LOGIC
function filterLibrary(category) {
    // Update UI Tabs
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    event?.target?.classList?.add('active');

    const grid = document.getElementById('track-grid');
    document.getElementById('section-title').innerText = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Feature: Change Hero Based on Category
    const heroTitle = document.getElementById('hero-title');
    const heroTag = document.getElementById('hero-tag');
    
    let tracks = [];
    if(category === 'trending') {
        tracks = [5, 12, 45, 88, 120, 300, 550, 999];
        heroTitle.innerHTML = "Top Hits<br>Today";
        heroTag.innerText = "Trending Now";
    } else if (category === 'relax') {
        tracks = [2, 9, 22, 67, 101, 404, 808];
        heroTitle.innerHTML = "Peaceful<br>Studio";
        heroTag.innerText = "Chill Vibes";
    } else {
        // Show random selection for 'All'
        tracks = Array.from({length: 40}, (_, i) => i + 1);
        heroTitle.innerHTML = "Your Studio<br>Session";
        heroTag.innerText = "Discover More";
    }

    document.getElementById('track-count').innerText = `${tracks.length} Tracks`;

    grid.innerHTML = tracks.map(id => `
        <div class="track-card animate-fade-in" onclick="playTrack(${id}, '${category}')">
            <div class="relative aspect-square rounded-2xl overflow-hidden mb-3">
                <img src="${id}.jpg" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/300/111?text=RHK+${id}'">
                <div class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                    <i class="fa-solid fa-play text-2xl"></i>
                </div>
            </div>
            <div class="flex items-center justify-between px-1">
                <div class="w-2/3">
                    <h5 class="text-[11px] font-bold truncate">Track ID ${id}</h5>
                    <p class="text-[8px] opacity-40 font-bold uppercase">${category}</p>
                </div>
                <button onclick="event.stopPropagation(); toggleVault(${id})" class="${vault.includes(id) ? 'text-violet-500' : 'opacity-20'}">
                    <i class="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// 3. CORE PLAYER ENGINE
function playTrack(id, cat = "RHK Music") {
    currentId = id;
    audio.src = `${id}.mp3`;
    audio.play();

    // Update Player UI
    document.getElementById('mini-title').innerText = `Track #${id}`;
    document.getElementById('big-title').innerText = `Elite Track ${id}`;
    document.getElementById('mini-thumb').src = `${id}.jpg`;
    document.getElementById('big-thumb').src = `${id}.jpg`;
    document.getElementById('category-tag').innerText = cat;
    document.getElementById('player-bg').style.backgroundImage = `url(${id}.jpg)`;
    
    document.getElementById('mini-player').classList.remove('translate-y-40');
    updatePlayIcons(true);
}

function updatePlayIcons(playing) {
    const icon = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    masterPlay.innerHTML = icon;
    miniPlay.innerHTML = icon;
    document.getElementById('art-container').style.transform = playing ? 'scale(1)' : 'scale(0.9)';
}

masterPlay.onclick = () => {
    if(audio.paused) { audio.play(); updatePlayIcons(true); }
    else { audio.pause(); updatePlayIcons(false); }
};

miniPlay.onclick = (e) => { e.stopPropagation(); masterPlay.click(); };

// 4. VAULT SYSTEM
function toggleVault(id) {
    const idx = vault.indexOf(id);
    if(idx > -1) vault.splice(idx, 1);
    else vault.push(id);
    
    localStorage.setItem('rhk_vault', JSON.stringify(vault));
    renderVault();
}

function renderVault() {
    const list = document.getElementById('vault-list');
    if(vault.length === 0) {
        list.innerHTML = `<div class="py-20 text-center opacity-20 font-bold">VAULT IS EMPTY</div>`;
        return;
    }
    list.innerHTML = vault.map(id => `
        <div class="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 active:scale-95 transition">
            <img src="${id}.jpg" class="w-14 h-14 rounded-2xl object-cover" onclick="playTrack(${id})">
            <div class="flex-1" onclick="playTrack(${id})">
                <h5 class="text-sm font-bold">Track #${id}</h5>
                <p class="text-[9px] text-violet-500 font-bold uppercase">Saved to Vault</p>
            </div>
            <button onclick="toggleVault(${id})" class="text-red-500/30 px-2"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

// 5. ADDITIONAL FEATURES
function toggleLoop() {
    isLoop = !isLoop;
    audio.loop = isLoop;
    document.getElementById('loop-btn').classList.toggle('text-violet-500', isLoop);
    document.getElementById('loop-btn').classList.toggle('text-white/30', !isLoop);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('text-violet-500', isShuffle);
}

function toggleSleepTimer() {
    alert("Sleep timer set for 30 minutes.");
    setTimeout(() => audio.pause(), 1800000);
}

// 6. UTILS & NAVIGATION
function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('nav-home').classList.toggle('active', v === 'home');
    document.getElementById('nav-lib').classList.toggle('active', v === 'library');
}

function openPlayer() { document.getElementById('full-player').classList.remove('translate-y-full'); }
function closePlayer() { document.getElementById('full-player').classList.add('translate-y-full'); }

audio.ontimeupdate = () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('seek-fill').style.width = pct + '%';
    document.getElementById('time-now').innerText = formatTime(audio.currentTime);
    document.getElementById('time-total').innerText = formatTime(audio.duration || 0);
};

function formatTime(s) {
    if(isNaN(s)) return "0:00";
    return Math.floor(s/60) + ":" + Math.floor(s%60).toString().padStart(2, '0');
}

function nextTrack() {
    let next = isShuffle ? Math.floor(Math.random() * totalTracks) : currentId + 1;
    playTrack(next > totalTracks ? 1 : next);
}

function prevTrack() {
    playTrack(currentId > 1 ? currentId - 1 : totalTracks);
}

// Seeker Logic
document.getElementById('seek-bar').onclick = function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * audio.duration;
};
