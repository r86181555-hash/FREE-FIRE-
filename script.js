const songs = [
    { name: "Tum Prem Ho", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Mohit%20Lalwani%20-%20Tum%20Prem%20Ho%20(Reprise).mp3", img: "Https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/IMG_20260414_135648.jpg" },
    { name: "DARKSIDE", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Neoni%20-%20DARKSIDE.mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-14-07-29-09_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Peaky Blinder", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Otnicka%20-%20Peaky%20Blinder.mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-14-17-28-78_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Aarambh", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Piyush%20Mishra%20-%20Aarambh.mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-15-10-37-40_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Suzume", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Radwimps%20-%20Suzume%20(feat.%20Toaka).mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-15-11-29-28_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Ram Siya Ram", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Sachet%20Tandon%20-%20Ram%20Siya%20Ram%20(From%20%20Adipurush%20).mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-15-11-52-59_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Me and the Devil", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Soap&Skin%20-%20Me%20and%20the%20Devil.mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-15-12-22-40_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" },
    { name: "Rise Up", url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/TheFatRat%20-%20Rise%20Up.mp3", img: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Screenshot_2026-04-14-15-13-10-26_bd0118cc98c1cf128a2a8d2060cbf2b7.jpg" }
];

let currentTab = 'home';
let favorites = JSON.parse(localStorage.getItem('rhk_favs')) || [];
const audio = document.getElementById('main-audio');

function render(filter = "") {
    const list = document.getElementById('song-list');
    let displayList = currentTab === 'home' ? songs : songs.filter(s => favorites.includes(s.name));
    
    if (filter) {
        displayList = displayList.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()));
    }

    list.innerHTML = displayList.map(s => {
        const isFav = favorites.includes(s.name);
        return `
        <div class="glass p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all">
            <img src="${s.img}" class="w-16 h-16 rounded-2xl object-cover" onclick="playTrack('${s.name}')">
            <div class="flex-1 overflow-hidden" onclick="playTrack('${s.name}')">
                <h3 class="font-bold text-sm truncate">${s.name}</h3>
                <p class="text-[10px] opacity-30 font-bold tracking-widest uppercase">Studio</p>
            </div>
            <button onclick="toggleFav('${s.name}')" class="w-10 h-10">
                <i class="fa-${isFav ? 'solid text-violet-500' : 'regular opacity-20'} fa-heart"></i>
            </button>
        </div>`;
    }).join('');
}

function playTrack(name) {
    const s = songs.find(song => song.name === name);
    audio.src = s.url;
    audio.play();
    
    document.getElementById('mini-title').innerText = s.name;
    document.getElementById('mini-thumb').src = s.img;
    document.getElementById('mini-player').classList.remove('translate-y-40');
    document.getElementById('mini-play-icon').className = 'fa-solid fa-pause';
}

function togglePlay() {
    if (audio.paused) { audio.play(); document.getElementById('mini-play-icon').className = 'fa-solid fa-pause'; }
    else { audio.pause(); document.getElementById('mini-play-icon').className = 'fa-solid fa-play'; }
}

// Auto-play next song
audio.onended = () => {
    let index = songs.findIndex(s => s.url === audio.src);
    let next = (index + 1) % songs.length;
    playTrack(songs[next].name);
};

function toggleFav(name) {
    if (favorites.includes(name)) favorites = favorites.filter(n => n !== name);
    else favorites.push(name);
    localStorage.setItem('rhk_favs', JSON.stringify(favorites));
    render();
}

function searchSongs() {
    const term = document.getElementById('search-input').value;
    render(term);
}

function changeTab(tab) {
    currentTab = tab;
    document.getElementById('nav-home').classList.toggle('nav-active', tab === 'home');
    document.getElementById('nav-home').classList.toggle('opacity-30', tab !== 'home');
    document.getElementById('nav-fav').classList.toggle('nav-active', tab === 'fav');
    document.getElementById('nav-fav').classList.toggle('opacity-30', tab !== 'fav');
    document.getElementById('section-title').innerHTML = tab === 'home' ? 'Trending <span class="opacity-30">Studio</span>' : 'Your <span class="text-violet-500">Favorites</span>';
    render();
}

window.onload = () => render();
