const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

async function searchYouTube(query) {
    if (query.length < 2) return;

    let res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`
    );

    let data = await res.json();

    let container = document.getElementById("results");
    container.innerHTML = "";

    data.items.forEach(video => {
        let vid = video.id.videoId;
        let title = video.snippet.title;
        let img = video.snippet.thumbnails.medium.url;

        container.innerHTML += `
        <div class="card" onclick="openPlayer('${vid}','${title}','${img}')">
            <img src="${img}">
            <p>${title}</p>
        </div>`;
    });
}

function openPlayer(id, title, img) {
    localStorage.setItem("videoId", id);
    localStorage.setItem("title", title);
    localStorage.setItem("img", img);

    window.location.href = "player.html";
}
