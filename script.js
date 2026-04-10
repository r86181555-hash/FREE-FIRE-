import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// 🔥 YOUR CONFIG (already correct)
const firebaseConfig = {
apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
authDomain: "rhk-music-24bbc.firebaseapp.com",
projectId: "rhk-music-24bbc",
storageBucket: "rhk-music-24bbc.firebasestorage.app",
messagingSenderId: "571438674805",
appId: "1:571438674805:web:305cdbf3866febf208193c",
measurementId: "G-52RLVJKBJ9"
};

// Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Button click
document.getElementById("loginBtn").addEventListener("click", () => {
signInWithPopup(auth, provider)
.then((result) => {
const user = result.user;

  // Save user
  localStorage.setItem("user", user.displayName);

  // Redirect
  window.location.href = "player.html";
})
.catch((error) => {
  alert(error.message);
});

});
