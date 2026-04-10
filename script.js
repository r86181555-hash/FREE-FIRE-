const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

let timer;

/* DEBOUNCE SEARCH (SMOOTH) */
function debounceSearch() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        let query = document.getElementById("searchInput").value;
        searchYouTube(query);
    }, 500);
}

/* SEARCH YOUTUBE */
async function searchYouTube(query) {
    if (!query || query.length < 2) return;

    let res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${query}&key=${API_KEY}`
    );

    let data = await res.json();
    displayResults(data.items);
}

/* DISPLAY RESULTS */
function displayResults(videos) {
    let container = document.getElementById("results");
    container.innerHTML = "";

    videos.forEach(video => {
        let vid = video.id.videoId;
        let title = video.snippet.title;
        let img = video.snippet.thumbnails.high.url;

        container.innerHTML += `
        <div class="card" onclick="playVideo('${vid}','${title}','${img}')">
            <img src="${img}">
            <p>${title}</p>
        </div>`;
    });
}

/* PLAY VIDEO */
function playVideo(id, title, img) {
    localStorage.setItem("videoId", id);
    localStorage.setItem("title", title);
    localStorage.setItem("img", img);

    window.location.href = "player.html";
}

/* LOAD PLAYER */
if (document.getElementById("ytPlayer")) {
    let id = localStorage.getItem("videoId");
    let title = localStorage.getItem("title");

    document.getElementById("ytPlayer").src =
        `https://www.youtube.com/embed/${id}?autoplay=1`;

    document.getElementById("title").innerText = title;
}

/* FAVORITES */
function addFavorite() {
    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    let song = {
        id: localStorage.getItem("videoId"),
        title: localStorage.getItem("title"),
        img: localStorage.getItem("img")
    };

    favs.push(song);
    localStorage.setItem("favs", JSON.stringify(favs));

    alert("Added to Favorites ❤️");
}

/* MINI PLAYER */
window.onload = function () {
    let img = localStorage.getItem("img");
    let title = localStorage.getItem("title");

    if (img) {
        document.getElementById("miniImg").src = img;
        document.getElementById("miniTitle").innerText = title;
    }
};

function openPlayer() {
    window.location.href = "player.html";
}
