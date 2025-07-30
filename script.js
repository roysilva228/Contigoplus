import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");
const productsCol = collection(db, "products");

let editId = null;

// Guardar o actualizar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  if (editId) {
    const ref = doc(db, "products", editId);
    await updateDoc(ref, {
      name,
      precio: price,
      description
    });
    editId = null;
  } else {
    await addDoc(productsCol, {
      name,
      precio: price,
      description
    });
  }

  form.reset();
});

// Mostrar productos
onSnapshot(productsCol, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const safeName = encodeURIComponent(data.name);
    const safePrice = encodeURIComponent(data.precio);
    const safeDesc = encodeURIComponent(data.description);

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <strong>${data.name}</strong> - S/.${data.precio}<br>
      <em>${data.description}</em><br>
      <button onclick="editProduct('${id}', '${safeName}', '${safePrice}', '${safeDesc}')">Editar</button>
    `;
    list.appendChild(div);
  });
});

// Editar producto
window.editProduct = (id, name, price, description) => {
  document.getElementById("name").value = decodeURIComponent(name);
  document.getElementById("price").value = decodeURIComponent(price);
  document.getElementById("description").value = decodeURIComponent(description);
  editId = id;
};
