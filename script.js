import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
    authDomain: "rhk-music-24bbc.firebaseapp.com",
    projectId: "rhk-music-24bbc",
    storageBucket: "rhk-music-24bbc.firebasestorage.app",
    messagingSenderId: "571438674805",
    appId: "1:571438674805:web:b4a4261e3cc9e60008193c"
};

const YT_KEY = 'AIzaSyD--m34QRRj9t9Ktec7YDXQK4Syg2hf_O4';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
let ytPlayer;

// --- AUTHENTICATION FLOW ---
const overlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');

document.getElementById('google-login-btn').onclick = () => {
    signInWithPopup(auth, provider).catch(e => alert("Please authorize this domain in Firebase!"));
};

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Hide Login & Show App
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
            mainApp.classList.remove('opacity-0');
        }, 700);

        // Set User Details
        document.getElementById('user-name').innerText = user.displayName;
        document.getElementById('user-profile').style.backgroundImage = `url('${user.photoURL}')`;
        
        // Initial Songs
        searchMusic('KGF Songs');
    } else {
        overlay.style.display = 'flex';
    }
});

// --- MUSIC SYSTEM ---
window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('player', {
        events: { 'onReady': (e) => { e.target.unMute(); e.target.setVolume(100); } }
    });
};

async function searchMusic(query) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${YT_KEY}`);
    const data = await res.json();
    const container = document.getElementById('songs-container');
    container.innerHTML = data.items.map(s => `
        <div onclick="playSong('${s.id.videoId}', '${s.snippet.title.replace(/'/g,"")}', '${s.snippet.thumbnails.medium.url}')" class="bg-[#0f0f0f] p-4 rounded-[2.5rem] active:scale-95 transition-all border border-white/5">
            <img src="${s.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-[1.8rem] mb-4 shadow-lg">
            <p class="text-[11px] font-black truncate px-1">${s.snippet.title}</p>
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

document.getElementById('search-input').onkeypress = (e) => {
    if(e.key === 'Enter') searchMusic(e.target.value);
};
