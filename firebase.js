import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
  authDomain: "rhk-music-24bbc.firebaseapp.com",
  projectId: "rhk-music-24bbc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const btn = document.getElementById("googleLogin");

// 🔥 CHECK LOCAL LOGIN FIRST
if (localStorage.getItem("loggedIn") === "true") {
  window.location.href = "home.html";
}

// FIREBASE CHECK
onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("loggedIn", "true"); // save login
    window.location.href = "home.html";
  }
});

// LOGIN BUTTON
btn.onclick = () => {
  signInWithRedirect(auth, provider);
};
