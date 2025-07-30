// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpgoaw-lnE70CzGZBl2P2TZdeXK1RGjs8",
  authDomain: "minimarket-app-c551b.firebaseapp.com",
  projectId: "minimarket-app-c551b",
  storageBucket: "minimarket-app-c551b.appspot.com",
  messagingSenderId: "1022324994134",
  appId: "1:1022324994134:web:66b58be5ec8a5e166a4bf7",
  measurementId: "G-FZR0HL0ZRZ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
