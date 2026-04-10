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

// 🔥 AUTO LOGIN (NO REPEAT LOGIN)
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("home.html");
  }
});

// LOGIN BUTTON
document.getElementById("googleLogin").onclick = () => {
  signInWithRedirect(auth, provider);
};
