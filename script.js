// --- ADMIN PANEL: EDIT YOUR SONGS HERE ---
const allSongs = [
    {
        titel: "Tum Prem Ho",
        artist: "Mohit Lalwani",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Mohit%20Lalwani%20-%20Tum%20Prem%20Ho%20(Reprise).mp3",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500" // Default Music Image
    },
    {
        titel: "DARKSIDE",
        artist: "Neoni",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Neoni%20-%20DARKSIDE.mp3",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500"
    },
    {
        titel: "Peaky Blinder",
        artist: "Otnicka",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Otnicka%20-%20Peaky%20Blinder.mp3",
        image: "https://images.unsplash.com/photo-1514525253361-bee8a487409e?w=500"
    },
    {
        titel: "Aarambh",
        artist: "Piyush Mishra",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Piyush%20Mishra%20-%20Aarambh.mp3",
        image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=500"
    },
    {
        titel: "Suzume",
        artist: "Radwimps",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Radwimps%20-%20Suzume%20(feat.%20Toaka).mp3",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500"
    },
    {
        titel: "Ram Siya Ram",
        artist: "Sachet Tandon",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Sachet%20Tandon%20-%20Ram%20Siya%20Ram%20(From%20%20Adipurush%20).mp3",
        image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500"
    },
    {
        titel: "Me and the Devil",
        artist: "Soap&Skin",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Soap&Skin%20-%20Me%20and%20the%20Devil.mp3",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500"
    },
    {
        titel: "Rise Up",
        artist: "TheFatRat",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/TheFatRat%20-%20Rise%20Up.mp3",
        image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500"
    },
    {
        titel: "Kavithe Kavithe",
        artist: "Vijay Prakash",
        url: "https://mofgpijvfbzrvikwvzxl.supabase.co/storage/v1/object/public/RHK%20MUSIC/Vijay%20Prakash%20-%20Kavithe%20Kavithe.mp3",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500"
    }
];

let currentIndex = 0;
const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('play-pause-btn');

function render() {
    const grid = document.getElementById('song-grid');
    grid.innerHTML = allSongs.map((s, i) => `
        <div class="glass p-4 rounded-3xl flex items-center gap-4 active:scale-95 transition-all" onclick="playSong(${i})">
            <img src="${s.image}" class="w-16 h-16 rounded-2xl object-cover">
            <div class="flex-1">
                <h3 class="font-bold text-sm">${s.titel}</h3>
                <p class="text-[10px] opacity-40 font-bold uppercase">${s.artist}</p>
            </div>
            <div class="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <i class="fa-solid fa-play text-[10px]"></i>
            </div>
        </div>
    `).join('');
}

function playSong(i) {
    currentIndex = i;
    const s = allSongs[i];
    audio.src = s.url;
    audio.play();
    
    // Update Mini Player
    document.getElementById('mini-title').innerText = s.titel;
    document.getElementById('mini-artist').innerText = s.artist;
    document.getElementById('mini-thumb').src = s.image;
    document.getElementById('mini-player').classList.remove('translate-y-40');
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

playBtn.onclick = (e) => {
    e.stopPropagation();
    if(audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
};

audio.onended = () => {
    currentIndex = (currentIndex + 1) % allSongs.length;
    playSong(currentIndex);
};

window.onload = render;
