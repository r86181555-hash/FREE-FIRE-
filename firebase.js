import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult 
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBND3n2ag9qGZG5SJPOKNVYr2dHNLwoD7Y",
  authDomain: "rhk-music-24bbc.firebaseapp.com",
  projectId: "rhk-music-24bbc"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").onclick = () => {
  signInWithRedirect(auth, provider);
};

getRedirectResult(auth)
  .then((result) => {
    if (result) {
      window.location.href = "home.html";
    }
  })
  .catch((error) => {
    console.log(error);
  });
