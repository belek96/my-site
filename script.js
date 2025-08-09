// Update the footer year automatically
document.getElementById('year').textContent = new Date().getFullYear();

// Cart functionality
// A simple object to keep track of items and their quantities
let cart = {};

// Elements for displaying cart items and empty message
const cartList = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');

// Create order button and append to cart section
const cartContainer = document.querySelector('.cart');
const orderButton = document.createElement('button');
orderButton.id = 'order-btn';
orderButton.className = 'order-btn';
orderButton.textContent = 'Оформить заказ';
orderButton.disabled = true;
cartContainer.appendChild(orderButton);

// Flag representing whether user is authenticated
let isAuthenticated = false;

// Function to update the cart UI
function renderCart() {
  // Clear the current list
  cartList.innerHTML = '';
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    // Show empty message when no items
    emptyCartMessage.style.display = 'block';
    orderButton.disabled = true;
    return;
  }
  emptyCartMessage.style.display = 'none';
  orderButton.disabled = false;
  // Create a list item for each product in the cart
  entries.forEach(([title, qty]) => {
    const li = document.createElement('li');
    // product name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = title;
    // quantity
    const qtySpan = document.createElement('span');
    qtySpan.textContent = qty + '×';
    // remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-item';
    removeBtn.textContent = 'Удалить';
    removeBtn.addEventListener('click', () => {
      delete cart[title];
      renderCart();
    });
    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    li.appendChild(removeBtn);
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

// Modal elements
const orderModal = document.getElementById('order-modal');
const orderModalContent = document.getElementById('order-modal-content');

function closeModal() {
  orderModal.style.display = 'none';
}

function showAuthOptions() {
  orderModalContent.innerHTML = `
    <button class="close-modal">×</button>
    <h3>Оформление заказа</h3>
    <button id="guest-order" class="modal-btn">Заказать без регистрации</button>
    <button id="login-order" class="modal-btn">Войти и заказать</button>
  `;
  // close button
  orderModalContent.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('guest-order').addEventListener('click', () => {
    // Guest order - proceed to address form
    showAddressForm();
  });
  document.getElementById('login-order').addEventListener('click', () => {
    // Simulate authorization; in a real site this would redirect to login
    isAuthenticated = true;
    showAddressForm();
  });
}

function showAddressForm() {
  orderModalContent.innerHTML = `
    <button class="close-modal">×</button>
    <h3>Данные для доставки</h3>
    <form id="order-form">
      <label>Адрес:<br><input type="text" id="order-address" required></label><br>
      <label>Способ оплаты:<br>
        <select id="order-payment">
          <option value="cash">Наличными</option>
          <option value="card">Картой</option>
        </select>
      </label><br>
      <label>Телефон:<br><input type="tel" id="order-phone" required></label><br>
      <button type="submit" class="modal-btn">Подтвердить заказ</button>
    </form>
  `;
  orderModalContent.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('order-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would send order details to server
    orderModalContent.innerHTML = '<h3>Спасибо за заказ!</h3><p>Мы свяжемся с вами по указанному телефону.</p>';
    // Clear cart
    cart = {};
    renderCart();
    // Auto close after a delay
    setTimeout(closeModal, 3000);
  });
}

function openOrderModal() {
  if (Object.keys(cart).length === 0) return;
  if (isAuthenticated) {
    showAddressForm();
  } else {
    showAuthOptions();
  }
  orderModal.style.display = 'flex';
}

// Attach click handler to order button
orderButton.addEventListener('click', openOrderModal);

// Initial render
renderCart();
