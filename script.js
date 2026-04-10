const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

const searchInput = document.getElementById("search");

let timeout;

// 🔥 SMOOTH FAST SEARCH
searchInput.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const query = searchInput.value.trim();

    if (query.length < 2) return;

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${API_KEY}&maxResults=10&type=video`)
      .then(res => res.json())
      .then(data => {

        if (!data.items) {
          document.getElementById("results").innerHTML = "No results";
          return;
        }

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
      })
      .catch(() => {
        document.getElementById("results").innerHTML = "Error loading songs";
      });

  }, 400);
});

function playVideo(id) {
  window.location.href = "player.html?video=" + id;
}
