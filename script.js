// Update the footer year automatically
document.getElementById('year').textContent = new Date().getFullYear();

// Применяем настройки администратора, если они сохранены в localStorage.
// Это позволяет владельцу сайта менять телефон, WhatsApp и названия комбо без изменения кода.
try {
  const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
  // Обновляем телефон и ссылки WhatsApp в шапке и в секции контактов
  if (settings.phone) {
    document.querySelectorAll('.contact-info .phone a').forEach(el => {
      el.href = 'tel:' + settings.phone;
      el.textContent = settings.phone;
    });
    document.querySelectorAll('#contact a[href^="tel:"]').forEach(el => {
      el.href = 'tel:' + settings.phone;
      el.textContent = settings.phone;
    });
  }
  if (settings.whatsapp) {
    const whatsappNum = settings.whatsapp.replace(/\D/g, '');
    document.querySelectorAll('.contact-info .whatsapp-link').forEach(el => {
      el.href = 'https://wa.me/' + whatsappNum;
    });
    document.querySelectorAll('#contact a[href^="https://wa.me"]').forEach(el => {
      el.href = 'https://wa.me/' + whatsappNum;
    });
  }
  // Обновляем названия комбо, если администратор их изменил
  if (Array.isArray(settings.comboNames)) {
    const comboTitles = document.querySelectorAll('#combos .product-card h3');
    settings.comboNames.forEach((name, idx) => {
      if (name && comboTitles[idx]) {
        comboTitles[idx].textContent = name;
      }
    });
  }
} catch (e) {
  console.warn('Could not apply admin settings', e);
}

// Рендеринг товаров из localStorage (позволяет динамически менять имена, цены, описания и картинки)
function renderProductsFromStorage() {
  try {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    document.querySelectorAll('.product-card').forEach(card => {
      const id = card.getAttribute('data-id');
      if (!id) return;
      const prod = products.find(p => p.id === id);
      if (!prod) return;
      // update name
      const title = card.querySelector('h3');
      if (title) title.textContent = prod.name;
      // update description
      const paragraphs = card.querySelectorAll('p');
      if (paragraphs.length > 0) {
        paragraphs[0].textContent = prod.desc || '';
      }
      // update price
      const priceElem = card.querySelector('.price');
      if (priceElem) {
        if (prod.discount !== null && prod.discount < prod.price) {
          priceElem.innerHTML = `<span class="old-price">${prod.price.toFixed(2)} сом</span> <span class="discount-price">${prod.discount.toFixed(2)} сом</span>`;
        } else if (prod.price != null) {
          priceElem.textContent = `${prod.price.toFixed(2)} сом`;
        } else {
          priceElem.textContent = '';
        }
      }
      // update image
      const img = card.querySelector('img');
      if (img && prod.image) img.src = prod.image;
    });
  } catch (e) {
    console.warn('Could not render products from storage', e);
  }
}

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
        // Combine product name and quantity into a single span for consistent layout
        const nameQtySpan = document.createElement('span');
        nameQtySpan.textContent = `${title} ×${qty}`;
        nameQtySpan.className = 'cart-item-nameqty';
        // remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item';
        removeBtn.textContent = 'Удалить';
        removeBtn.addEventListener('click', () => {
          delete cart[title];
          renderCart();
        });
        li.appendChild(nameQtySpan);
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
  // Build a detailed form for guest or authenticated orders
  orderModalContent.innerHTML = `
    <button class="close-modal">×</button>
    <h3>Данные для доставки</h3>
    <form id="order-form">
      <label>Возраст (дд.мм.гггг):<br>
        <input type="text" id="order-age" required placeholder="дд.мм.гггг" pattern="\\d{2}\\.\\d{2}\\.\\d{4}" title="Введите дату в формате дд.мм.гггг">
      </label><br>
      <label>Улица:<br>
        <input type="text" id="order-street" required>
      </label><br>
      <label>Дом:<br>
        <input type="text" id="order-house" required>
      </label><br>
      <label>Квартира:<br>
        <input type="text" id="order-flat">
      </label><br>
      <label>Домофон:<br>
        <input type="text" id="order-intercom">
      </label><br>
      <label>Ссылка на точную локацию (Google Maps):<br>
        <input type="url" id="order-maplink" placeholder="https://maps.google.com/...">
      </label><br>
      <label>Количество персон:<br>
        <input type="number" id="order-people" min="1" max="20" value="1" required>
      </label><br>
      <label>Комментарий к заказу:<br>
        <textarea id="order-comment" rows="2" maxlength="200" placeholder="Комментарий (до 200 символов)"></textarea>
      </label><br>
      <label>Телефон:<br>
        <input type="tel" id="order-phone" required pattern="[\+\d\s\-()]{8,}" title="Введите корректный номер телефона">
      </label><br>
      <label>Способ оплаты:<br>
        <select id="order-payment" required>
          <option value="cash">Наличными</option>
          <option value="card">Картой</option>
        </select>
      </label><br>
      <label>Доставка:<br>
        <select id="delivery-choice" required>
          <option value="asap">Как можно скорее</option>
          <option value="schedule">Ко времени</option>
        </select>
      </label><br>
      <label id="delivery-time-label" style="display:none;">Время доставки:<br>
        <!-- Text input with 24‑hour format pattern (hh:mm) to avoid AM/PM -->
        <input type="text" id="delivery-time" pattern="([01]\\d|2[0-3]):[0-5]\\d" placeholder="чч:мм" title="Введите время в 24‑часовом формате чч:мм">
      </label><br>
      <button type="submit" class="modal-btn">Подтвердить заказ</button>
    </form>
  `;
  // Close modal when clicking on the X
  orderModalContent.querySelector('.close-modal').addEventListener('click', closeModal);
  // Show or hide the time input based on delivery choice
  const choiceSelect = document.getElementById('delivery-choice');
  const timeLabel = document.getElementById('delivery-time-label');
  choiceSelect.addEventListener('change', () => {
    if (choiceSelect.value === 'schedule') {
      timeLabel.style.display = 'block';
    } else {
      timeLabel.style.display = 'none';
    }
  });
  // Handle form submission
  const form = document.getElementById('order-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Built-in validation
    if (!form.reportValidity()) {
      return;
    }
    // Validate age: ensure date is valid and user is at least 16 years old
    const ageStr = document.getElementById('order-age').value.trim();
    const ageParts = ageStr.split('.');
    let validAge = false;
    if (ageParts.length === 3) {
      const day = parseInt(ageParts[0], 10);
      const month = parseInt(ageParts[1], 10) - 1; // JavaScript months 0-11
      const year = parseInt(ageParts[2], 10);
      const birthDate = new Date(year, month, day);
      if (!isNaN(birthDate)) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age >= 16) {
          validAge = true;
        }
      }
    }
    if (!validAge) {
      alert('Пожалуйста, укажите корректную дату рождения. Вам должно быть не менее 16 лет.');
      return;
    }
    // Additional validation could go here (e.g., custom checks)
    orderModalContent.innerHTML = '<h3>Спасибо за заказ!</h3><p>Мы свяжемся с вами по указанному телефону.</p>';
    // Clear the cart after ordering
    cart = {};
    renderCart();
    // Auto-close modal after a short delay
    setTimeout(closeModal, 3000);
  });

  // Добавляем автоматическую подстановку точек в поле возраста
  const ageInput = document.getElementById('order-age');
  if (ageInput) {
    ageInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9.]/g, '');
      if ((val.length === 2 || val.length === 5) && !val.endsWith('.')) {
        val += '.';
      }
      e.target.value = val;
    });
  }

  // Добавляем автоматическую подстановку двоеточия в поле времени доставки
  const timeInput = document.getElementById('delivery-time');
  if (timeInput) {
    timeInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/[^0-9:]/g, '');
      if (v.length > 2 && v.indexOf(':') === -1) {
        v = v.slice(0, 2) + ':' + v.slice(2);
      } else if (v.length === 2 && !v.includes(':')) {
        v += ':';
      }
      if (v.length > 5) {
        v = v.slice(0, 5);
      }
      e.target.value = v;
    });
  }
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
// Instead of opening a modal, redirect to a dedicated checkout page.
orderButton.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) return;
  // Persist cart in localStorage so the checkout page can read it
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not persist cart in localStorage', e);
  }
  // Redirect to checkout page
  window.location.href = 'checkout.html';
});

// Initial render
renderCart();

// Apply dynamic product information (names, prices, images, descriptions) from admin settings
renderProductsFromStorage();
