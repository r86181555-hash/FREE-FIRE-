const bannerDefault = "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/file_00000000593c7208ab7159e15bbbb7bb.png";
const bannerDhurandhar = "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-17-38-47-14_f9ee0578fe1cc94de7482bd41accb329.jpg";

let songs = [
    { name: "Mann Atkeya", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat%20Sachdev%20-%20Destiny%20-%20Mann%20Atkeya.mp3" },
    { name: "Jaan Se Guzarte Hain", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat%20Sachdev%20-%20Jaan%20Se%20Guzarte%20Hain.mp3" },
    { name: "Jaiye Sajana", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat%20Sachdev%20-%20Jaiye%20Sajana.mp3" },
    { name: "Kanhaiyya", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat%20Sachdev%20-%20Kanhaiyya.mp3" },
    { name: "Aari Aari", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Dhurandhar_The_Revenge_Aari_Aari_From_Dhu.mp3" },
    { name: "Didi Sher E Baloch", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Didi_Sher_E_Baloch_From_Dhurandhar_The_Re.mp3" },
    { name: "Main Aur Tu", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Main_Aur_Tu_From_Dhurandhar_The_Revenge_.mp3" },
    { name: "Rang De Lal", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Rang_De_Lal_Oye_Oye_From_Dhurandhar_The_R.mp3" },
    { name: "Tere Ishq Ne", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Tere_Ishq_Ne_From_Dhurandhar_The_Revenge_.mp3" },
    { name: "Vaari Jaavan", category: "Dhurandhar", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Shashwat_Sachdev_Vaari_Jaavan_From_Dhurandhar_The_Revenge_.mp3" },
    { name: "Nee Singam Dhan", category: "Others", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/A.R.%20Rahman%20-%20Nee%20Singam%20Dhan.mp3" },
    { name: "Bones", category: "Others", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Imagine%20Dragons%20-%20Bones.mp3" }
];

let curCategory = 'All';
let favorites = JSON.parse(localStorage.getItem('rhk_liked_v3')) || [];
const audio = document.getElementById('main-audio');

// 1. Navigation Logic
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active-screen'));
    document.getElementById(`screen-${screenId}`).classList.add('active-screen');
    
    // Update nav icons
    const navs = ['home', 'search', 'liked'];
    navs.forEach(n => {
        document.getElementById(`nav-${n}`).style.opacity = (n === screenId) ? '1' : '0.4';
    });
    render(screenId);
}

function togglePlayerView(open) {
    const player = document.getElementById('player-screen');
    open ? player.classList.add('up') : player.classList.remove('up');
}

// 2. Rendering Engines
function render(screenId) {
    const container = document.getElementById(`song-list-${screenId}`);
    if (!container) return;

    let filtered = songs;
    if (screenId === 'home' && curCategory !== 'All') filtered = songs.filter(s => s.category === curCategory);
    if (screenId === 'liked') filtered = songs.filter(s => favorites.includes(s.name));
    
    container.innerHTML = filtered.map(s => `
        <div class="flex items-center gap-4 py-3 active:bg-white/5 px-2 rounded-lg" onclick="playTrack('${s.name}')">
            <img src="${bannerDefault}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm truncate">${s.name}</h4>
                <p class="text-[10px] opacity-40 uppercase font-black tracking-widest">${s.category}</p>
            </div>
            <i class="fa-solid fa-ellipsis-vertical opacity-30 p-2"></i>
        </div>
    `).join('');
}

function changeCategory(cat) {
    curCategory = cat;
    document.getElementById('header-text').innerText = cat === 'All' ? 'Browse All' : cat;
    document.getElementById('header-img').src = (cat === 'Dhurandhar') ? bannerDhurandhar : bannerDefault;
    
    document.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.toggle('pill-active', btn.innerText === cat);
    });
    render('home');
}

function handleSearch() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filtered = songs.filter(s => s.name.toLowerCase().includes(query) || s.category.toLowerCase().includes(query));
    
    document.getElementById('song-list-search').innerHTML = filtered.map(s => `
        <div class="flex items-center gap-4 py-3" onclick="playTrack('${s.name}')">
            <img src="${bannerDefault}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm truncate">${s.name}</h4>
                <p class="text-[10px] opacity-40 uppercase font-bold">${s.category}</p>
            </div>
        </div>
    `).join('');
}

// 3. Audio & Player Engine
function playTrack(name) {
    const s = songs.find(x => x.name === name);
    if (audio.src !== s.url) {
        audio.src = s.url;
        audio.play();
    }
    
    document.getElementById('mini-player').classList.remove('hidden');
    syncUI(s);
}

function syncUI(s) {
    document.getElementById('mini-name').innerText = s.name;
    document.getElementById('full-name').innerText = s.name;
    document.getElementById('mini-cat').innerText = s.category;
    document.getElementById('full-cat-name').innerText = s.category;
    document.getElementById('mini-img').src = bannerDefault;
    document.getElementById('full-img').src = bannerDefault;
    
    document.getElementById('mini-play-btn').className = 'fa-solid fa-pause';
    document.getElementById('full-play-btn').className = 'fa-solid fa-pause';
    
    document.getElementById('like-icon').className = favorites.includes(s.name) ? 'fa-solid fa-heart text-green-500' : 'fa-regular fa-heart';
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
        updatePlayIcons('pause');
    } else {
        audio.pause();
        updatePlayIcons('play');
    }
}

function updatePlayIcons(state) {
    document.getElementById('mini-play-btn').className = `fa-solid fa-${state}`;
    document.getElementById('full-play-btn').className = `fa-solid fa-${state}`;
}

audio.ontimeupdate = () => {
    const bar = document.getElementById('seek-bar');
    bar.max = audio.duration || 0;
    bar.value = audio.currentTime;
    document.getElementById('time-now').innerText = format(audio.currentTime);
    document.getElementById('time-end').innerText = format(audio.duration);
};

document.getElementById('seek-bar').oninput = function() { audio.currentTime = this.value; };

function format(t) {
    if (isNaN(t)) return "0:00";
    let m = Math.floor(t/60), s = Math.floor(t%60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function handleLike() {
    const curName = document.getElementById('full-name').innerText;
    if (favorites.includes(curName)) {
        favorites = favorites.filter(n => n !== curName);
    } else {
        favorites.push(curName);
    }
    localStorage.setItem('rhk_liked_v3', JSON.stringify(favorites));
    syncUI({name: curName, category: document.getElementById('full-cat-name').innerText});
}

function nextSong() {
    let i = songs.findIndex(s => s.url === audio.src);
    playTrack(songs[(i + 1) % songs.length].name);
}

function prevSong() {
    let i = songs.findIndex(s => s.url === audio.src);
    let prev = i - 1 < 0 ? songs.length - 1 : i - 1;
    playTrack(songs[prev].name);
}

// Init
setTimeout(() => document.getElementById('splash').style.display = 'none', 2200);
window.onload = () => render('home');
