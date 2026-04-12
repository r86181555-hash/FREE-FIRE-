// CONFIG
const metadata = [
    { title: "Loneliness", artist: "Putri Ariani" },
    { title: "Eclipse", artist: "RHK Studio" },
    { title: "Neon Nights", artist: "Synthwave" }
];

const allSongs = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: metadata[i]?.title || `Track ID ${i + 1}`,
    artist: metadata[i]?.artist || "Digital Studio",
    file: `${i + 1}.mp3`,
    thumb: `${i + 1}.jpg`
}));

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];
let currentTrackIdx = -1;

function renderHome(list = allSongs) {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = list.map((s, idx) => `
        <div class="song-card" onclick="playSong(${s.id - 1})">
            <div class="relative aspect-square mb-4 overflow-hidden rounded-[1.8rem]">
                <img src="${s.thumb}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-110" onerror="this.src='https://via.placeholder.com/300/000/fff?text=RHK'">
                <div class="absolute bottom-3 right-3 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <i class="fa-solid fa-play text-[10px]"></i>
                </div>
            </div>
            <div class="px-2 pb-2">
                <h4 class="text-xs font-bold truncate">${s.title}</h4>
                <p class="text-[8px] text-white/30 font-bold uppercase tracking-tighter mt-1">${s.artist}</p>
            </div>
        </div>
    `).join('');
}

function playSong(idx) {
    currentTrackIdx = idx;
    const s = allSongs[idx];
    audio.src = s.file;
    audio.play();
    
    document.getElementById('player-title').innerText = s.title;
    document.getElementById('player-artist').innerText = s.artist;
    document.getElementById('player-thumb').src = s.thumb;
    document.getElementById('mini-player').style.transform = "translateY(0)";
    document.getElementById('visualizer-bar').style.opacity = "1";
    playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xl"></i>';
}

playBtn.onclick = () => {
    if (audio.paused) { audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xl"></i>'; }
    else { audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play text-black text-xl"></i>'; }
};

audio.ontimeupdate = () => {
    const val = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-line').style.width = val + '%';
    document.getElementById('current-time').innerText = fmt(audio.currentTime);
    document.getElementById('duration-time').innerText = fmt(audio.duration || 0);
};

// Seek logic
document.getElementById('progress-container').onclick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    audio.currentTime = (x / rect.width) * audio.duration;
};

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

function searchMusic() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allSongs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    renderHome(filtered);
}

function showView(v) {
    document.getElementById('home-view').classList.toggle('hidden', v !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', v !== 'library');
    document.getElementById('btn-home').classList.toggle('active', v === 'home');
    document.getElementById('btn-lib').classList.toggle('active', v === 'library');
}

function saveUser() {
    const n = document.getElementById('userNameInput').value;
    if(n) { localStorage.setItem('rhk_user_name', n); location.reload(); }
}

window.onload = () => {
    const n = localStorage.getItem('rhk_user_name');
    if (!n) document.getElementById('name-modal').classList.remove('hidden');
    else document.getElementById('user-display').innerText = `Certified: ${n}`;
    renderHome();
};
