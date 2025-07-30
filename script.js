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

// Agregar o actualizar producto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  if (editId) {
    // Actualizar producto existente
    const ref = doc(db, "products", editId);
    await updateDoc(ref, {
      name,
      precio: price,
      description
    });
    editId = null;
  } else {
    // Agregar nuevo producto
    await addDoc(productsCol, {
      name,
      precio: price,
      description
    });
  }

  form.reset();
});

// Mostrar productos en tiempo real
onSnapshot(productsCol, (snapshot) => {
  list.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <strong>${data.name}</strong> - S/.${data.precio} <br>
      <em>${data.description}</em><br>
      <button onclick="editProduct('${id}', \`${data.name}\`, \`${data.precio}\`, \`${data.description}\`)">Editar</button>
    `;
    list.appendChild(div);
  });
});

// Hacer accesible la función de edición desde el DOM
window.editProduct = (id, name, precio, description) => {
  document.getElementById("name").value = name;
  document.getElementById("price").value = precio;
  document.getElementById("description").value = description;
  editId = id;
};
