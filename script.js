import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
let player, currentQueue = [], currentIndex = 0, currentUser = null;

// --- AUTH & ACCOUNT INITIALIZATION ---
const loginOverlay = document.getElementById('login-overlay');
const mainApp = document.getElementById('main-app');

document.getElementById('google-login-btn').onclick = () => signInWithPopup(auth, provider);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        loginOverlay.style.opacity = '0';
        setTimeout(() => { loginOverlay.style.display = 'none'; mainApp.style.opacity = '1'; }, 700);
        
        document.getElementById('user-display-name').innerText = user.displayName.split(' ')[0];
        document.getElementById('user-profile-img').style.backgroundImage = `url('${user.photoURL}')`;
        
        // Sync user's saved playlist from Firestore
        syncUserLibrary();
        searchMusic('KGF 2 Hits'); // Default Load
    }
});

// --- MUSIC ENGINE (AUTO-NEXT) ---
window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('yt-player-hidden', {
        events: {
            'onStateChange': (e) => { if (e.data === YT.PlayerState.ENDED) playNext(); }
        }
    });
};

async function searchMusic(q) {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(q)}&type=video&key=${YT_KEY}`);
    const data = await res.json();
    renderMixes(data.items);
}

function renderMixes(songs) {
    const container = document.getElementById('daily-mix-container');
    container.innerHTML = songs.map((s, idx) => `
        <div class="min-w-[160px] bg-[#121214] p-4 rounded-[2rem] border border-white/5 relative group">
            <img src="${s.snippet.thumbnails.medium.url}" class="w-full aspect-square object-cover rounded-[1.5rem] mb-3">
            <p class="text-[10px] font-bold truncate">${s.snippet.title}</p>
            <div class="flex gap-2 mt-2">
                <button onclick="playFromList(${idx}, 'mix')" class="text-[9px] text-purple-500 font-bold uppercase">Play</button>
                <button onclick="saveToLibrary('${s.id.videoId}', '${s.snippet.title.replace(/'/g,"")}', '${s.snippet.thumbnails.medium.url}')" class="text-[9px] text-gray-500 font-bold uppercase">Save</button>
            </div>
        </div>
    `).join('');
    window.lastResults = songs;
}

// --- ACCOUNT-BASED LIBRARY (FIRESTORE) ---
async function saveToLibrary(id, title, thumb) {
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, {
        savedSongs: arrayUnion({ id, title, thumb })
    }, { merge: true });
    syncUserLibrary();
}

async function syncUserLibrary() {
    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
    if (docSnap.exists()) {
        const songs = docSnap.data().savedSongs || [];
        const container = document.getElementById('personal-playlist');
        container.innerHTML = songs.map((s, idx) => `
            <div onclick="playFromList(${idx}, 'library')" class="flex items-center justify-between bg-[#121214] p-3 rounded-2xl active:bg-purple-900/20 transition-all">
                <div class="flex items-center gap-4">
                    <img src="${s.thumb}" class="w-12 h-12 rounded-xl object-cover">
                    <div>
                        <p class="text-xs font-bold truncate w-40">${s.title}</p>
                        <p class="text-[9px] text-gray-500">Saved Track</p>
                    </div>
                </div>
                <button onclick="removeFromLibrary(event, '${s.id}')" class="text-gray-600 px-4"><i class="fa-solid fa-trash-can text-xs"></i></button>
            </div>
        `).join('');
        window.userLibrary = songs;
    }
}

window.playFromList = (idx, type) => {
    currentQueue = type === 'mix' ? window.lastResults : window.userLibrary;
    currentIndex = idx;
    loadActiveSong();
};

function loadActiveSong() {
    const song = currentQueue[currentIndex];
    const id = song.id.videoId || song.id;
    player.loadVideoById(id);
    document.getElementById('now-playing-title').innerText = song.snippet?.title || song.title;
    document.getElementById('now-playing-thumb').src = song.snippet?.thumbnails.medium.url || song.thumb;
    document.getElementById('player-bar').style.transform = "translate(-50%, 0)";
}

function playNext() { if (currentIndex < currentQueue.length - 1) playFromList(currentIndex + 1, 'active'); }

document.getElementById('search-input').onkeypress = (e) => { if(e.key === 'Enter') searchMusic(e.target.value); };
