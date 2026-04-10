const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

let queue = [];
let currentIndex = 0;
let player = document.createElement("iframe");
player.style.display = "none";
document.body.appendChild(player);

/* INTERNET CHECK */
function checkInternet() {
    if (!navigator.onLine) {
        document.getElementById("offline").style.display = "block";
    } else {
        document.getElementById("offline").style.display = "none";
    }
}
setInterval(checkInternet, 2000);

/* SEARCH */
function searchYouTube(query) {
    if (!navigator.onLine) return;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

        let container = document.getElementById("results");
        container.innerHTML = "";

        queue = [];

        data.items.forEach(video => {
            let vid = video.id.videoId;
            let title = video.snippet.title;
            let img = video.snippet.thumbnails.medium.url;

            queue.push({vid, title});

            container.innerHTML += `
            <div class="card" onclick="playSong(${queue.length-1})">
                <img src="${img}">
                <p>${title}</p>
            </div>`;
        });
    });
}

/* PLAY */
function playSong(index) {
    currentIndex = index;
    let song = queue[index];

    document.getElementById("miniTitle").innerText = song.title;

    player.src = `https://www.youtube.com/embed/${song.vid}?autoplay=1`;
}

/* CONTROLS */
function next() {
    currentIndex = (currentIndex + 1) % queue.length;
    playSong(currentIndex);
}

function prev() {
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    playSong(currentIndex);
}

function playPause() {
    // YouTube iframe cannot pause easily → reload logic
    playSong(currentIndex);
}

/* NAV */
function goHome() {
    location.reload();
}

function focusSearch() {
    document.getElementById("searchInput").focus();
}

function openFav() {
    alert("Favorites coming next update ❤️");
}
