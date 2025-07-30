import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");
const productsCol = collection(db, "products");

// Agregar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  await addDoc(productsCol, {
    name,
    precio: price,
    description
  });

  form.reset();
});

// Mostrar productos en tiempo real
onSnapshot(productsCol, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `<strong>${data.name}</strong> - S/.${data.precio} <br><em>${data.description}</em>`;
    list.appendChild(div);
  });
});
