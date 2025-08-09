// Update the footer year automatically
document.getElementById('year').textContent = new Date().getFullYear();

// Cart functionality
// A simple object to keep track of items and their quantities
const cart = {};

// Elements for displaying cart items and empty message
const cartList = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');

// Function to update the cart UI
function renderCart() {
  // Clear the current list
  cartList.innerHTML = '';
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    // Show empty message when no items
    emptyCartMessage.style.display = 'block';
    return;
  }
  emptyCartMessage.style.display = 'none';
  // Create a list item for each product in the cart
  entries.forEach(([title, qty]) => {
    const li = document.createElement('li');
    // product name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = title;
    // quantity
    const qtySpan = document.createElement('span');
    qtySpan.textContent = qty + '×';
    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    cartList.appendChild(li);
  });
}

// Attach add to cart buttons to each product card
document.querySelectorAll('.product-card').forEach(card => {
  const titleElement = card.querySelector('h3');
  if (!titleElement) return;
  // Create button
  const button = document.createElement('button');
  button.className = 'add-to-cart';
  button.textContent = 'В корзину';
  // Click event to add item to cart
  button.addEventListener('click', () => {
    const title = titleElement.textContent.trim();
    cart[title] = (cart[title] || 0) + 1;
    renderCart();
  });
  card.appendChild(button);
});
