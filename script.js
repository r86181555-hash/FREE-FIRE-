const YT_KEY = 'AIzaSyAZ9_GEyt945IbkZMb7NKIO-8og5hUebhY'; 
const GEMINI_KEY = 'AIzaSyD07yH_6W-x1eNNaJEG0-cHGrGuvkaDsLs'; 

let player, currentTrackIndex = -1, currentPlaylist = [];
let library = JSON.parse(localStorage.getItem('rhk_library')) || [];

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0', width: '0',
        events: { 
            'onStateChange': onPlayerStateChange, 
            'onReady': () => {
                startClock();
                console.log("YouTube Player Ready");
            } 
        }
    });
}

// 1. WELCOME SYSTEM
function saveUser() {
    const name = document.getElementById('userNameInput').value;
    if(!name) return;
    localStorage.setItem('rhk_user_name', name);
    document.getElementById('name-modal').classList.add('hidden');
    generateAIWelcome(name);
}

async function generateAIWelcome(name) {
    const welcomeArea = document.getElementById('ai-welcome');
    const textEl = document.getElementById('welcome-text');
    welcomeArea.classList.remove('hidden');
    textEl.innerText = "Connecting to RHK AI...";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const prompt = { contents: [{ parts: [{ text: `Greet ${name} to RHK Music. Briefly tell them they can search any song, save to library, and use Mood AI. Under 45 words, cool vibes.` }] }] };

    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(prompt) });
        const data = await res.json();
        const msg = data.candidates[0].content.parts[0].text;
        typeWriter(msg, textEl);
    } catch (e) { 
        textEl.innerText = `Welcome back, ${name}. Your studio is ready.`; 
    }
}

function typeWriter(text, el) {
    el.innerText = "";
    let i = 0;
    const interval = setInterval(() => {
        el.innerText += text.charAt(i); i++;
        if (i >= text.length) clearInterval(interval);
    }, 25);
}

// 2. MOOD AI SYSTEM
async function analyzeMoodAI() {
    const input = document.getElementById('moodInput').value;
    const icon = document.getElementById('ai-icon');
    if (!input) return;

    icon.className = "fa-solid fa-spinner animate-spin text-purple-400";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const prompt = { contents: [{ parts: [{ text: `User says: "${input}". Suggest ONE YouTube search query for a song mood. Return ONLY the query.` }] }] };

    try {
        const res = await fetch(url, { method: 'POST', body: JSON.stringify(prompt) });
        const data = await res.json();
        const query = data.candidates[0].content.parts[0].text.trim();
        searchMusic(query, 'search-results');
        icon.className = "fa-solid fa-brain";
    } catch (e) { 
        icon.className = "fa-solid fa-circle-exclamation"; 
    }
}

// 3. CORE MUSIC ENGINE
function showView(view) {
    document.getElementById('home-view').classList.toggle('hidden', view !== 'home');
    document.getElementById('library-view').classList.toggle('hidden', view !== 'library');
    document.getElementById('btn-home').classList.toggle('active', view === 'home');
    document.getElementById('btn-lib').classList.toggle('active', view === 'library');
    if(view === 'library') updateLibraryUI();
}

function toggleSearch() {
    document.getElementById('search-overlay').classList.toggle('translate-y-full');
}

async function fetchCategory(q) {
    document.querySelectorAll('.cat-chip').forEach(c => {
        const isMatch = c.innerText.toLowerCase() === q.toLowerCase() || (q === 'New Hits' && c.innerText === 'Discovery');
        c.classList.toggle('active', isMatch);
    });
    document.getElementById('view-title').innerText = q;
    searchMusic(q, 'home-grid');
}

async function searchMusic(q, target) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(q)}&type=video&videoCategoryId=10&key=${YT_KEY}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        renderSongs(data.items, target === 'home-grid' ? 'home' : 'search');
    } catch(e) { 
        console.error("YT API Error"); 
    }
}

function renderSongs(songs, ctx) {
    const container = ctx === 'home' ? document.getElementById('home-grid') : document.getElementById('search-results');
    if (!songs) {
        container.innerHTML = `<p class="col-span-2 text-center py-10 opacity-50">No results found</p>`;
        return;
    }
    container.innerHTML = songs.map(s => {
        const t = s.snippet.title.replace(/'/g,"").replace(/"/g,"");
        return `
        <div class="song-card-ui p-3 rounded-3xl flex flex-col animate-fade-in">
            <img src="${s.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-2xl mb-3">
            <p class="text-[9px] font-bold truncate px-1">${t}</p>
            <div class="flex gap-2 mt-3">
                <button onclick="playDirect('${s.id.videoId}', '${t}', '${s.snippet.thumbnails.medium.url}')" class="flex-1 bg-white text-black py-2 rounded-xl text-[8px] font-black uppercase">Play</button>
                <button onclick="addToLibrary('${s.id.videoId}', '${t}', '${s.snippet.thumbnails.medium.url}')" class="w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-purple-600 transition-all"><i class="fa-solid fa-plus text-[9px]"></i></button>
            </div>
        </div>`;
    }).join('');
}

function addToLibrary(id, title, thumb) {
    if(!library.find(s => s.id === id)) {
        library.push({ id, title, thumb });
        localStorage.setItem('rhk_library', JSON.stringify(library));
        updateLibraryUI();
    }
}

function removeFromLibrary(id, e) {
    e.stopPropagation();
    library = library.filter(s => s.id !== id);
    localStorage.setItem('rhk_library', JSON.stringify(library));
    updateLibraryUI();
}

function updateLibraryUI() {
    const list = document.getElementById('library-list');
    document.getElementById('lib-count').innerText = library.length;
    if(library.length === 0) {
        list.innerHTML = `<div class="text-center opacity-20 py-16 text-[10px] uppercase font-bold tracking-widest">No tracks in library</div>`;
        return;
    }
    list.innerHTML = library.map((s, i) => `
        <div onclick="playLibraryTrack(${i})" class="flex items-center gap-4 p-3 rounded-3xl bg-white/[0.03] ${i === currentTrackIndex && currentPlaylist === library ? 'border border-purple-500/40 bg-purple-500/5' : ''}">
            <img src="${s.thumb}" class="w-10 h-10 rounded-xl object-cover">
            <div class="flex-1 overflow-hidden">
                <p class="text-[11px] font-bold truncate">${s.title}</p>
            </div>
            <i class="fa-solid fa-trash-can text-white/10 hover:text-red-500 p-2" onclick="removeFromLibrary('${s.id}', event)"></i>
        </div>`).join('');
}

function playDirect(id, title, thumb) {
    currentPlaylist = [{id, title, thumb}]; 
    currentTrackIndex = 0; 
    executePlay(currentPlaylist[0]);
}

function playLibraryTrack(i) {
    currentPlaylist = library; 
    currentTrackIndex = i; 
    executePlay(currentPlaylist[i]);
}

function executePlay(track) {
    if (player && player.loadVideoById) {
        player.loadVideoById(track.id);
        document.getElementById('player-title').innerText = track.title;
        document.getElementById('player-thumb').src = track.thumb;
        document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
        updateLibraryUI();
    }
}

function onPlayerStateChange(e) {
    if (e.data === 0 && currentTrackIndex + 1 < currentPlaylist.length) {
        playLibraryTrack(currentTrackIndex + 1);
    }
    const playBtn = document.getElementById('masterPlay');
    playBtn.innerHTML = (e.data === 1) ? '<i class="fa-solid fa-pause text-xs"></i>' : '<i class="fa-solid fa-play text-xs"></i>';
}

function startClock() {
    setInterval(() => {
        if(player && player.getCurrentTime && player.getPlayerState() === 1) {
            const cur = player.getCurrentTime(), dur = player.getDuration();
            document.getElementById('progress-bar').value = (cur/dur)*100 || 0;
            document.getElementById('current-time').innerText = `${fmt(cur)} / ${fmt(dur)}`;
        }
    }, 1000);
}

document.getElementById('progress-bar').oninput = function() { 
    if (player && player.getDuration) {
        player.seekTo((this.value/100) * player.getDuration(), true); 
    }
};

document.getElementById('masterPlay').onclick = () => {
    const state = player.getPlayerState();
    state === 1 ? player.pauseVideo() : player.playVideo();
};

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

window.onload = () => {
    const name = localStorage.getItem('rhk_user_name');
    if (!name) {
        document.getElementById('name-modal').classList.remove('hidden');
    } else {
        generateAIWelcome(name);
    }
    fetchCategory('New Hits');
};
        
