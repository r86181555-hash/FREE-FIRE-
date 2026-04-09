let songs = [
    {
        name: "Kannada Song",
        src: "assets/songs/song1.mp3",
        img: "assets/images/img1.jpg"
    },
    {
        name: "Hindi Song",
        src: "assets/songs/song2.mp3",
        img: "assets/images/img2.jpg"
    },
    {
        name: "English Song",
        src: "assets/songs/song3.mp3",
        img: "assets/images/img3.jpg"
    }
];

let audio = document.getElementById("audio");
let index = localStorage.getItem("songIndex") || 0;

function openPlayer(i) {
    localStorage.setItem("songIndex", i);
    window.location.href = "player.html";
}

function loadSong(i) {
    if (!audio) return;

    audio.src = songs[i].src;
    document.getElementById("title").innerText = songs[i].name;
    document.getElementById("cover").src = songs[i].img;
}

if (audio) loadSong(index);

function playPause() {
    if (audio.paused) audio.play();
    else audio.pause();
}

function next() {
    index = (parseInt(index) + 1) % songs.length;
    loadSong(index);
    audio.play();
}

function prev() {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
    audio.play();
}
