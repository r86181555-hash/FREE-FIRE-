function searchYouTube(query) {
    if (query.length < 2) return;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

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
    });
}
