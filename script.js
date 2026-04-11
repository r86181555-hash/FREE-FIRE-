// CONFIG: Mix of Music and Podcasts
const contentData = [
    { title: "Vibe Mix 1", artist: "Music", type: "music" },
    { title: "The RHK Podcast", artist: "Podcast EP.1", type: "podcast" },
    { title: "Late Night Chill", artist: "Music", type: "music" },
    { title: "Success Talk", artist: "Podcast EP.2", type: "podcast" }
];

// Generate 100 slots (even = music, odd = podcast for variety)
const allContent = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: contentData[i]?.title || (i % 2 === 0 ? `Music Track ${i+1}` : `Podcast Ep ${Math.ceil(i/2)}`),
    artist: contentData[i]?.artist || (i % 2 === 0 ? "Artist Name" : "Show Name"),
    type: contentData[i]?.type || (i % 2 === 0 ? "music" : "podcast"),
    file: `${i + 1}.mp3`,
    thumb: `${i + 1}.jpg`
}));

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');
let currentFilteredList = [...allContent];
let currentTrackIndex = -1;
let currentView = 'home';
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];

// 1. RENDERER
function renderContent(list = currentFilteredList) {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = list.map((s) => {
        const isLiked = library.some(l => l.id === s.id);
        return `
        <div class="song-card">
            <div class="relative mb-3 group" onclick="playFromList('${s.id}', 'home')">
                <img src="${s.thumb}" class="w-full aspect-square object-cover rounded-[1.5rem]" onerror="this.src='https://via.placeholder.com/150/111/444?text=${s.type.toUpperCase()}'">
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-[1.5rem] transition-all">
                    <i class="fa-solid fa-play text-[#1DB954] text-xl"></i>
                </div>
            </div>
            <div class="flex justify-between items-start px-1">
                <div class="overflow-hidden" onclick="playFromList('${s.id}', 'home')">
                    <p class="text-[12px] font-bold truncate">${s.title}</p>
                    <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">${s.artist}</p>
                </div>
                <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart text-[10px] mt-1 ${isLiked ? 'text-[#1DB954]' : 'opacity-20'}" onclick="toggleLibrary(${s.id-1})"></i>
            </div>
        </div>`;
    }).join('');
}

// 2. SEARCH & FILTER
function searchContent() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allContent.filter(s => s.title.toLowerCase().includes(query) || s.artist.toLowerCase().includes(query));
    renderContent(filtered);
}

function filterType(type) {
    document.getElementById('tab-music').classList.toggle('active', type === 'music');
    document.getElementById('tab-podcast').classList.toggle('active', type === 'podcast');
    document.getElementById('view-title').innerText = type === 'music' ? "Music Tracks" : "Podcasts";
    currentFilteredList = allContent.filter(s => s.type === type);
    renderContent();
}

// 3. PLAYBACK (Handles "One by One" from any list)
function playFromList(id, source) {
    const listToUse = (source === 'library') ? library : currentFilteredList;
    const idx = listToUse.findIndex(s => s.id == id);
    if (idx === -1) return;
    
    currentTrackIndex = idx;
    playTrack(listToUse[idx], source);
}

function playTrack(track, source) {
    audio.src = track.file;
    audio.play();
    document.getElementById('player-title').innerText = track.title;
    document.getElementById('player-artist').innerText = track.artist;
    document.getElementById('player-thumb').src = track.thumb;
    document.getElementById('mini-player').style.transform = "translateY(0)";
    playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xs"></i>';
    
    // Logic for "One by One" Auto-play
    audio.onended = () => {
        const listToUse = (source === 'library') ? library : currentFilteredList;
        currentTrackIndex = (currentTrackIndex + 1) % listToUse.length;
        playTrack(listToUse[currentTrackIndex], source);
    };
}

function nextTrack() {
    const listToUse = (document.getElementById('library-view').classList.contains('hidden')) ? currentFilteredList : library;
    currentTrackIndex = (currentTrackIndex + 1) % listToUse.length;
    playTrack(listToUse[currentTrackIndex]);
}

function prevTrack() {
    const listToUse = (document.getElementById('library-view').classList.contains('hidden')) ? currentFilteredList : library;
    currentTrackIndex = (currentTrackIndex - 1 + listToUse.length) % listToUse.length;
    playTrack(listToUse[currentTrackIndex]);
}

// 4. LIBRARY UI
function toggleLibrary(idx) {
    const track = allContent[idx];
    const foundIdx = library.findIndex(s => s.id === track.id);
    if (foundIdx > -1) library.splice(foundIdx, 1);
    else library.push(track);
    
    localStorage.setItem('rhk_library', JSON.stringify(library));
    renderContent();
    if(!document.getElementById('library-view').classList.contains('hidden')) updateLibraryUI();
}

function updateLibraryUI() {
    const list = document.getElementById('library-list');
    list.innerHTML = library.length ? library.map(s => `
        <div class="flex items-center gap-4 p-4 bg-[#1A1A1A] rounded-3xl" onclick="playFromList('${s.id}', 'library')">
            <img src="${s.thumb}" class="w-12 h-12 rounded-xl object-cover">
            <div class="flex-1">
                <p class="text-xs font-bold">${s.title}</p>
                <p class="text-[9px] text-gray-500 font-bold">${s.artist}</p>
            </div>
            <i class="fa-solid fa-play text-[#1DB954] text-xs"></i>
        </div>`).join('') : '<p class="text-center opacity-20 py-20">Your library is empty</p>';
}

// 5. BOILERPLATE
playBtn.onclick = () => {
    if (audio.paused) { audio.play(); playBtn.innerHTML = '<i class="fa-solid fa-pause text-black text-xs"></i>'; }
    else { audio.pause(); playBtn.innerHTML = '<i class="fa-solid fa-play text-black text-xs"></i>'; }
};

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
    filterType('music');
};
