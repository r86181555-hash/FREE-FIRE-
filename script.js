const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

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

function play(id,title,img){
    localStorage.setItem("vid", id);
    localStorage.setItem("title", title);
    localStorage.setItem("img", img);
    window.location = "player.html";
}

function goHome(){
    location.reload();
}

function focusSearch(){
    document.getElementById("search").focus();
}

function openFav(){
    window.location = "fav.html";
}
