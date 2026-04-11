const musicData = [
    { title: "Loneliness", artist: "Putri Ariani", mood: "#1DB954" },
    { title: "Quantum", artist: "RHK Studio", mood: "#8a2be2" },
    { title: "Afterlife", artist: "Unknown", mood: "#ff0055" }
];

const allSongs = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    title: musicData[i]?.title || `System Vibe ${i+1}`,
    artist: musicData[i]?.artist || "Nebula Producer",
    color: musicData[i]?.mood || (i % 3 === 0 ? "#1DB954" : "#8a2be2"),
    file: `${i + 1}.mp3`,
    thumb: `${i + 1}.jpg`
}));

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');
let currentIdx = -1;

function renderHome(list = allSongs) {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = list.map((s, idx) => `
        <div class="song-card group cursor-pointer" onclick="playTrack(${s.id - 1})">
            <div class="relative rounded-[2.5rem] overflow-hidden mb-5">
                <img src="${s.thumb}" class="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-700" onerror="this.src='https://via.placeholder.com/400/111/333?text=RHK'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black">
                        <i class="fa-solid fa-play ml-1"></i>
                    </div>
                </div>
            </div>
            <h4 class="text-sm font-bold truncate tracking-tight">${s.title}</h4>
            <p class="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">${s.artist}</p>
        </div>
    `).join('');
}

function playTrack(idx) {
    currentIdx = idx;
    const s = allSongs[idx];
    audio.src = s.file;
    audio.play();
    
    // Dynamic Background Change
    document.querySelector('.blob-1').style.background = s.color;
    document.querySelector('.blob-1').style.transform = `scale(${1.2}) translate(${Math.random()*100}px)`;

    document.getElementById('player-title').innerText = s.title;
    document.getElementById('player-artist').innerText = s.artist;
    document.getElementById('player-thumb').src = s.thumb;
    document.getElementById('mini-player').style.transform = "translateY(0) translateX(-50%)";
    document.body.classList.add('playing');
    playBtn.innerHTML = '<i class="fa-solid fa-pause text-black"></i>';
}

function nextTrack() {
    currentIdx = (currentIdx + 1) % allSongs.length;
    playTrack(currentIdx);
}

function prevTrack() {
    currentIdx = (currentIdx - 1 + allSongs.length) % allSongs.length;
    playTrack(currentIdx);
}

playBtn.onclick = () => {
    if (audio.paused) { audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; }
    else { audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>'; }
};

audio.ontimeupdate = () => {
    const val = (audio.currentTime / audio.duration) * 100 || 0;
    document.getElementById('progress-line').style.width = val + '%';
    document.getElementById('current-time').innerText = fmt(audio.currentTime);
};

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

function searchMusic() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allSongs.filter(s => s.title.toLowerCase().includes(q));
    renderHome(filtered);
}

function saveUser() {
    const n = document.getElementById('userNameInput').value;
    if(n) { localStorage.setItem('rhk_user_name', n); location.reload(); }
}

window.onload = () => {
    const n = localStorage.getItem('rhk_user_name');
    if (!n) document.getElementById('name-modal').classList.remove('hidden');
    else document.getElementById('user-display').innerText = `Greetings, ${n}`;
    renderHome();
};
