import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
    authDomain: "rhk-music-24bbc.firebaseapp.com",
    projectId: "rhk-music-24bbc",
    storageBucket: "rhk-music-24bbc.firebasestorage.app",
    messagingSenderId: "571438674805",
    appId: "1:571438674805:web:b4a4261e3cc9e60008193c"
};
const YT_API_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4'; 

// --- INITIALIZE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let ytPlayer;

// --- LOGIN LOGIC ---
const overlay = document.getElementById('login-overlay');
document.getElementById('google-login-btn').addEventListener('click', () => {
    signInWithPopup(auth, provider).catch(err => alert("Login Error"));
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
        document.getElementById('user-profile').style.backgroundImage = `url('${user.photoURL}')`;
        searchMusic('KGF Songs'); // Auto-load songs on login
    } else {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }
});

// --- MUSIC LOGIC ---
window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('player', {
        events: { 'onReady': (e) => { e.target.unMute(); e.target.setVolume(100); } }
    });
};

async function searchMusic(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    renderSongs(data.items);
}

function renderSongs(songs) {
    const container = document.getElementById('songs-container');
    container.innerHTML = songs.map(s => `
        <div onclick="playSong('${s.id.videoId}', '${s.snippet.title.replace(/'/g,"")}', '${s.snippet.thumbnails.medium.url}')" class="bg-[#1a1a1a] p-3 rounded-[2rem]">
            <img src="${s.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-2">
            <p class="text-[10px] font-bold truncate">${s.snippet.title}</p>
        </div>
    `).join('');
}

window.playSong = (id, title, thumb) => {
    ytPlayer.loadVideoById(id);
    ytPlayer.unMute();
    ytPlayer.setVolume(100);
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
};

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') searchMusic(e.target.value);
});
