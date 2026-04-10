const API_KEY = "YOUR_YOUTUBE_API_KEY";

document.getElementById("search").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    searchVideos(this.value);
  }
});

function searchVideos(query) {
  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=10`)
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.items.forEach(item => {
        if (!item.id.videoId) return;

        html += `
          <div class="video-card" onclick="playVideo('${item.id.videoId}')">
            <img src="${item.snippet.thumbnails.medium.url}">
            <p>${item.snippet.title}</p>
          </div>
        `;
      });
      document.getElementById("results").innerHTML = html;
    });
}

function playVideo(id) {
  window.location.href = "player.html?video=" + id;
}
