const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

function searchYouTube(query) {
    let empty = document.getElementById("empty");
    let container = document.getElementById("results");

    if (query.length < 2) {
        container.innerHTML = "";
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

        container.innerHTML = "";

        data.items.forEach(video => {
            let vid = video.id.videoId;
            let title = video.snippet.title;
            let img = video.snippet.thumbnails.medium.url;

            container.innerHTML += `
            <div class="card">
                <img src="${img}" onclick="openPlayer('${vid}','${title}','${img}')">
                <p>${title}</p>
                <button onclick="addFav('${vid}','${title}','${img}')">❤️</button>
            </div>`;
        });
    });
}

function openPlayer(id, title, img) {
    localStorage.setItem("videoId", id);
    localStorage.setItem("title", title);
    localStorage.setItem("img", img);
    window.location.href = "player.html";
}

function addFav(id, title, img) {
    let fav = JSON.parse(localStorage.getItem("fav")) || [];
    fav.push({id, title, img});
    localStorage.setItem("fav", JSON.stringify(fav));
    alert("Added ❤️");
}

function openFav() {
    window.location.href = "fav.html";
}

function goHome() {
    window.location.href = "index.html";
}

function focusSearch() {
    document.getElementById("searchInput").focus();
}
