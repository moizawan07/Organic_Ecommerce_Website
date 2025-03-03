// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// import { getAuth } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js'
// import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs , addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";


  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBEAVy0uO1kr019Dsz9WIERTiCkNx0GELo",
    authDomain: "organic-ecommerce-website.firebaseapp.com",
    projectId: "organic-ecommerce-website",
    storageBucket: "organic-ecommerce-website.firebasestorage.app",
    messagingSenderId: "7301236695",
    appId: "1:7301236695:web:fd3050812fa21dce156d92"
  };

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

//  Initailize Services
// const auth = getAuth(app)
const db = getFirestore(app)

// Export For The Other Files
export { db , collection ,getDocs, addDoc}