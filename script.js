// 🔥 YOUR YOUTUBE API KEY
const API_KEY = "AIzaSyDdklLjpuYqiQU1akYheP7K3aOLxgQTEtM";

// 🔍 SEARCH
async function searchSongs() {
  let query = document.getElementById("search").value;

  if (!query) {
    alert("Enter song name");
    return;
  }

  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`;

  let res = await fetch(url);
  let data = await res.json();

  displaySongs(data.items);
}

// 🎵 DISPLAY
function displaySongs(videos) {
  let container = document.getElementById("results");
  container.innerHTML = "";

  videos.forEach(video => {
    let vidId = video.id.videoId;
    let title = video.snippet.title;
    let thumb = video.snippet.thumbnails.medium.url;

    let div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${thumb}">
      <p>${title}</p>
    `;

    div.onclick = () => {
      window.location.href = "player.html?id=" + vidId;
    };

    container.appendChild(div);
  });
}
