let player;

// Show username
document.getElementById("username").innerText =
"User: " + localStorage.getItem("user");

function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
height: '200',
width: '300',
videoId: 'dQw4w9WgXcQ'
});
}

function searchVideo() {
const query = document.getElementById("search").value;

fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=YOUR_YOUTUBE_API_KEY&type=video")
.then(res => res.json())
.then(data => {
const videoId = data.items[0].id.videoId;
player.loadVideoById(videoId);
});
}
