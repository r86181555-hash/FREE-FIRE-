const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

/* TRENDING */
function loadTrending() {
    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=trending songs india&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

        let charts = document.getElementById("charts");
        charts.innerHTML = "";

        data.items.forEach(v => {
            let id = v.id.videoId;
            let title = v.snippet.title;
            let img = v.snippet.thumbnails.medium.url;

            charts.innerHTML += `
            <div class="card" onclick="play('${id}','${title}','${img}')">
                <img src="${img}">
                <p>${title}</p>
            </div>`;
        });
    });
}

/* SEARCH */
function searchYT(query) {
    if (query.length < 2) return;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=10&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

        let results = document.getElementById("results");
        results.innerHTML = "";

        data.items.forEach(v => {
            let id = v.id.videoId;
            let title = v.snippet.title;
            let img = v.snippet.thumbnails.medium.url;

            results.innerHTML += `
            <div class="card" onclick="play('${id}','${title}','${img}')">
                <img src="${img}">
                <p>${title}</p>
            </div>`;
        });
    });
}

/* PLAY */
function play(id,title,img){
    localStorage.setItem("vid", id);
    localStorage.setItem("title", title);
    localStorage.setItem("img", img);

    document.getElementById("miniImg").src = img;
    document.getElementById("miniTitle").innerText = title;

    window.location = "player.html";
}

/* NAV */
function goHome(){
    location.reload();
}

function focusSearch(){
    document.getElementById("search").focus();
}

function openFav(){
    window.location = "fav.html";
}

function openPlayerPage(){
    window.location = "player.html";
}

/* LOAD */
window.onload = loadTrending;
