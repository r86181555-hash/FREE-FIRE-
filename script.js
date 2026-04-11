const music = [
    { title: "NEURAL_LINK", artist: "RHK_01", thumb: "32786.jpg" },
    { title: "GHOST_SHELL", artist: "CYBER_02", thumb: "32787.jpg" },
    { title: "VOID_WALKER", artist: "TITAN_03", thumb: "32812.jpg" }
];

const allSongs = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: music[i % 3].title,
    artist: music[i % 3].artist,
    thumb: music[i % 3].thumb,
    file: `${i + 1}.mp3`
}));

const audio = document.getElementById('main-audio');
const playBtn = document.getElementById('masterPlay');
let currentIdx = -1;

function renderHelix() {
    const container = document.getElementById('helix-container');
    const total = 15; // Show 15 orbiting nodes
    
    for (let i = 0; i < total; i++) {
        const angle = (i / total) * Math.PI * 2;
        const radius = 600;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const card = document.createElement('div');
        card.className = 'helix-card flex flex-col justify-end';
        card.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${-angle}rad)`;
        card.innerHTML = `
            <img src="${allSongs[i].thumb}" class="absolute inset-0 w-full h-full object-cover opacity-20 rounded-lg">
            <h4 class="text-xs font-black tracking-widest">${allSongs[i].title}</h4>
            <p class="text-[6px] text-[#1DB954] font-bold mt-1 uppercase">${allSongs[i].artist}</p>
        `;
        card.onclick = () => playNode(i);
        container.appendChild(card);
    }
}

function playNode(idx) {
    currentIdx = idx;
    const s = allSongs[idx];
    audio.src = s.file;
    audio.play();
    
    document.getElementById('center-well').style.opacity = "1";
    document.getElementById('center-well').style.transform = "scale(1)";
    document.getElementById('player-title').innerText = s.title;
    document.getElementById('player-artist').innerText = s.artist;
    document.getElementById('player-thumb').src = s.thumb;
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

audio.ontimeupdate = () => {
    const dash = 1000;
    const progress = (audio.currentTime / audio.duration) * dash;
    document.getElementById('progress-circle').style.strokeDashoffset = dash - progress;
};

// Simple Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for(let i=0; i<100; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        v: Math.random() * 0.5 + 0.1
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(29, 185, 84, 0.2)";
    particles.forEach(p => {
        p.y -= p.v;
        if(p.y < 0) p.y = canvas.height;
        ctx.fillRect(p.x, p.y, 1, 1);
    });
    requestAnimationFrame(draw);
}
draw();

window.onload = () => {
    const n = localStorage.getItem('rhk_user_name');
    if (!n) {
        document.getElementById('name-modal').classList.remove('hidden');
        document.getElementById('userNameInput').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                localStorage.setItem('rhk_user_name', e.target.value);
                location.reload();
            }
        });
    } else {
        document.getElementById('user-display').innerText = `NODE_${n}_LINKED`;
        renderHelix();
    }
};
