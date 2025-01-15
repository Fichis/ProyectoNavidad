// Obtener el carrito desde localStorage
function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  
  // Guardar el carrito en localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  
  // Agregar un producto al carrito
  function addToCart(productName, productPrice) {
    const cart = getCart();
    const existingProduct = cart.find((item) => item.name === productName);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
  
    saveCart(cart);
    alert(`${productName} agregado al carrito!`);
  }
  
  // Mostrar el carrito
  function displayCart() {
    const cart = getCart();
    const cartItemsElement = document.getElementById("cart-items");
    if (!cartItemsElement) return;
  
    cartItemsElement.innerHTML = "";
  
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Eliminar";
      removeButton.onclick = () => removeFromCart(item.name);
      li.appendChild(removeButton);
      cartItemsElement.appendChild(li);
    });
  }
  
  // Eliminar un producto del carrito
  function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter((item) => item.name !== productName);
    saveCart(cart);
    displayCart();
  }
  
  // Vaciar el carrito
  function clearCart() {
    localStorage.removeItem("cart");
    displayCart();
  }
  
  // Inicializar la visualización del carrito
  document.addEventListener("DOMContentLoaded", displayCart);
  
  // Exponer funciones al objeto global
  window.addToCart = addToCart;
  window.clearCart = clearCart;
  window.removeFromCart = removeFromCart;