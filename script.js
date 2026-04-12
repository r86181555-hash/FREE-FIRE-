// REPLACE WITH YOUR FIREBASE KEYS
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const audio = document.getElementById('audio-engine');
let favorites = JSON.parse(localStorage.getItem('rhk_favs')) || [];

// --- AUTH FUNCTIONS ---
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(e => alert(e.message));
}

function loginWithEmail() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
}

function loginWithPhone() {
    const num = prompt("Enter phone with country code (+91...):");
    if(!num) return;
    const recaptcha = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    auth.signInWithPhoneNumber(num, recaptcha).then(res => {
        const code = prompt("Enter OTP:");
        res.confirm(code);
    }).catch(e => alert(e.message));
}

function logout() { auth.signOut(); }

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('auth-overlay').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-info').innerText = user.email || user.phoneNumber;
        renderGrid('all');
    } else {
        document.getElementById('auth-overlay').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }
});

// --- NAVIGATION ---
function showTab(tab) {
    document.querySelectorAll('.app-view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`view-${tab}`).classList.remove('hidden');
    document.getElementById(`nb-${tab}`).classList.add('active');
    if(tab === 'favs') renderFavs();
}

function changeFilter(type) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${type}`).classList.add('active');
    renderGrid(type);
}

// --- CORE LOGIC ---
function renderGrid(type) {
    const grid = document.getElementById('main-grid');
    grid.innerHTML = '';
    // Manual 100 songs logic
    for(let i=1; i<=100; i++) {
        if(type === 'trending' && i > 20) continue;
        if(type === 'recent' && i < 80) continue;
        grid.innerHTML += createSongCard(i);
    }
}

function createSongCard(id) {
    const isFav = favorites.includes(id) ? 'active' : '';
    return `
    <div class="song-card p-3 rounded-[2rem] flex flex-col" onclick="playMusic(${id})">
        <div class="fav-icon ${isFav}" onclick="toggleFav(event, ${id})"><i class="fa-solid fa-heart"></i></div>
        <img src="${id}.jpg" class="w-full aspect-square object-cover rounded-[1.5rem] mb-3">
        <p class="text-[10px] font-black truncate px-2 uppercase tracking-tighter">Track #${id}</p>
        <p class="text-[8px] opacity-30 px-2 uppercase font-bold italic">RHK Cloud</p>
    </div>`;
}

function playMusic(id) {
    audio.src = `${id}.mp3`;
    audio.play();
    document.getElementById('p-img').src = `${id}.jpg`;
    document.getElementById('p-title').innerText = `Playing Track #${id}`;
    document.getElementById('master-play').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>';
}

function toggleFav(e, id) {
    e.stopPropagation();
    if(favorites.includes(id)) favorites = favorites.filter(x => x !== id);
    else favorites.push(id);
    localStorage.setItem('rhk_favs', JSON.stringify(favorites));
    renderGrid('all');
    renderFavs();
}

function renderFavs() {
    const grid = document.getElementById('fav-grid');
    grid.innerHTML = favorites.length ? favorites.map(id => createSongCard(id)).join('') : '<p class="col-span-2 text-center py-20 opacity-20 text-[10px] font-black uppercase tracking-widest">No Favorites</p>';
}

function searchTracks() {
    const q = document.getElementById('search-input').value.toLowerCase();
    const grid = document.getElementById('search-grid');
    grid.innerHTML = '';
    for(let i=1; i<=100; i++) {
        if(`track #${i}`.includes(q)) grid.innerHTML += createSongCard(i);
    }
}

// Player Events
audio.ontimeupdate = () => {
    const prog = (audio.currentTime / audio.duration) * 100;
    document.getElementById('seek-bar').value = prog || 0;
    document.getElementById('p-time').innerText = `${fmt(audio.currentTime)} / ${fmt(audio.duration || 0)}`;
};

const fmt = s => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;

document.getElementById('master-play').onclick = () => {
    if(audio.paused) { audio.play(); document.getElementById('master-play').innerHTML = '<i class="fa-solid fa-pause text-xs"></i>'; }
    else { audio.pause(); document.getElementById('master-play').innerHTML = '<i class="fa-solid fa-play text-xs ml-1"></i>'; }
};
