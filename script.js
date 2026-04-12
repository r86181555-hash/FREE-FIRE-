// --- FIREBASE SETUP ---
// REPLACE THIS WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// --- GLOBAL VARIABLES ---
const totalSongs = 100;
let favorites = JSON.parse(localStorage.getItem('rhk_favorites')) || [];
let currentTrack = 1;
const audio = document.getElementById('audio-engine');

// --- AUTH HANDLERS ---
function handleGoogleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

function handleEmailLogin() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        document.getElementById('auth-overlay').style.display = 'none';
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('display-email').innerText = user.email || user.phoneNumber;
        if(user.photoURL) document.getElementById('user-avatar').innerHTML = `<img src="${user.photoURL}">`;
        buildGrid('all');
    } else {
        document.getElementById('auth-overlay').style.display = 'flex';
        document.getElementById('main-app').classList.add('hidden');
    }
});

// --- CORE NAVIGATION ---
function openTab(tab) {
    document.querySelectorAll('.view-sec').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-icon').forEach(i => i.classList.remove('active'));
    
    document.getElementById(`sec-${tab}`).classList.remove('hidden');
    document.getElementById(`ni-${tab}`).classList.add('active');
    
    if(tab === 'fav') buildFavs();
}

function changeCategory(cat) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${cat}`).classList.add('active');
    buildGrid(cat);
}

// --- MUSIC ENGINE ---
function buildGrid(type) {
    const container = document.getElementById('music-grid');
    container.innerHTML = '';
    
    // Simulate Trending/Recent by splitting the 100 songs
    let start = 1, end = totalSongs;
    if(type === 'trending') end = 30;
    if(type === 'recent') start = 70;

    for(let i=start; i<=end; i++) {
        container.innerHTML += createCard(i);
    }
}

function createCard(id) {
    const loved = favorites.includes(id) ? 'is-loved' : '';
    return `
    <div class="song-item p-3 rounded-[2.2rem] flex flex-col" onclick="playMusic(${id})">
        <div class="fav-heart ${loved}" onclick="toggleFav(event, ${id})"><i class="fa-solid fa-heart"></i></div>
        <img src="${id}.jpg" class="w-full aspect-square object-cover rounded-[1.8rem] mb-3 shadow-lg">
        <p class="text-[10px] font-black truncate px-2 uppercase tracking-tighter">Track #${id}</p>
        <p class="text-[8px] opacity-30 px-2 uppercase font-bold">RHK Original</p>
    </div>`;
}

function playMusic(id) {
    currentTrack = id;
    audio.src = `${id}.mp3`;
    audio.play();
    document.getElementById('p-img').src = `${id}.jpg`;
    document.getElementById('p-title').innerText = `Playing Track #${id}`;
    document.getElementById('play-trigger').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>';
}

document.getElementById('play-trigger').onclick = () => {
    if(audio.paused) { audio.play(); document.getElementById('play-trigger').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>'; }
    else { audio.pause(); document.getElementById('play-trigger').innerHTML = '<i class="fa-solid fa-play text-xs ml-1"></i>'; }
};

// Next/Prev
function nextTrack() { if(currentTrack < totalSongs) playMusic(currentTrack + 1); }
function prevTrack() { if(currentTrack > 1) playMusic(currentTrack - 1); }

// Time Update
audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.getElementById('seek-slider').value = progress || 0;
    document.getElementById('p-time').innerText = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`;
};

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

// Favorites Logic
function toggleFav(e, id) {
    e.stopPropagation();
    if(favorites.includes(id)) favorites = favorites.filter(x => x !== id);
    else favorites.push(id);
    localStorage.setItem('rhk_favorites', JSON.stringify(favorites));
    buildGrid('all');
    if(!document.getElementById('sec-fav').classList.contains('hidden')) buildFavs();
}

function buildFavs() {
    const container = document.getElementById('fav-grid');
    container.innerHTML = favorites.length ? favorites.map(id => createCard(id)).join('') : '<p class="col-span-2 text-center opacity-20 py-20 uppercase font-black text-[10px]">No Liked Songs</p>';
}

function runSearch() {
    const q = document.getElementById('search-bar').value.toLowerCase();
    const container = document.getElementById('search-grid');
    container.innerHTML = '';
    for(let i=1; i<=totalSongs; i++) {
        if(`track #${i}`.toLowerCase().includes(q)) container.innerHTML += createCard(i);
    }
}
