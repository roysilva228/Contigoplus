import { db, collection, addDoc, getDocs } from "./firebase-config.js";

const form = document.getElementById("productForm");
const carousel = document.getElementById("productCarousel");
const productsRef = collection(db, "products");

async function loadProducts() {
  carousel.innerHTML = "";
  const snapshot = await getDocs(productsRef);
  snapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${data.name}</h3>
      <p>${data.description}</p>
      <p><strong>S/.${data.precio}</strong></p>
    `;
    carousel.appendChild(card);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const precio = parseFloat(document.getElementById("precio").value);

  if (!name || !description || isNaN(precio)) {
    alert("Por favor llena todos los campos correctamente.");
    return;
  }

  await addDoc(productsRef, { name, description, precio });
  form.reset();
  loadProducts();
});

window.addEventListener("DOMContentLoaded", loadProducts);
