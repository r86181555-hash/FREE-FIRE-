import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
    authDomain: "rhk-music-24bbc.firebaseapp.com",
    projectId: "rhk-music-24bbc",
    storageBucket: "rhk-music-24bbc.firebasestorage.app",
    messagingSenderId: "571438674805",
    appId: "1:571438674805:web:b4a4261e3cc9e60008193c"
};
const YT_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let player;

// AUTH SYSTEM
const overlay = document.getElementById('login-overlay');
const profile = document.getElementById('user-profile');

document.getElementById('google-login-btn').onclick = () => {
    signInWithPopup(auth, provider).catch(e => console.error("Login Error", e));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 500);
        profile.style.backgroundImage = `url('${user.photoURL}')`;
        searchMusic('KGF 2 Songs'); 
    } else {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }
});

// YOUTUBE PLAYER INIT
window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
        events: { 'onReady': (e) => { e.target.unMute(); e.target.setVolume(100); } }
    });
};

// SEARCH & RENDER
async function searchMusic(q) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(q)}&type=video&key=${YT_KEY}`);
    const data = await res.json();
    const container = document.getElementById('songs-container');
    container.innerHTML = data.items.map(s => `
        <div onclick="playSong('${s.id.videoId}', '${s.snippet.title.replace(/'/g,"")}', '${s.snippet.thumbnails.medium.url}')" class="bg-[#111] p-3 rounded-[2rem] active:scale-95 transition-transform border border-white/5">
            <img src="${s.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-3">
            <p class="text-[10px] font-bold truncate px-1">${s.snippet.title}</p>
        </div>
    `).join('');
}

window.playSong = (id, title, thumb) => {
    player.loadVideoById(id);
    player.unMute();
    player.setVolume(100);
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-thumb').src = thumb;
    document.getElementById('mini-player').style.transform = "translate(-50%, 0)";
};

document.getElementById('search-input').onkeypress = (e) => {
    if(e.key === 'Enter') searchMusic(e.target.value);
};
