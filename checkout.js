// checkout.js: handles checkout page behaviour
document.addEventListener('DOMContentLoaded', () => {
  // Display cart summary from localStorage
  let cartData = {};
  try {
    const stored = localStorage.getItem('cart');
    if (stored) {
      cartData = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not parse stored cart', e);
  }
  const cartSummary = document.getElementById('cart-summary');
  const entries = Object.entries(cartData);
  if (entries.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Корзина пуста';
    cartSummary.appendChild(li);
  } else {
    entries.forEach(([title, qty]) => {
      const li = document.createElement('li');
      li.textContent = `${title} ×${qty}`;
      cartSummary.appendChild(li);
    });
  }
  // Initialise map centered on Bishkek
  const bishkekLat = 42.8746;
  const bishkekLng = 74.6122;
  const map = L.map('map').setView([bishkekLat, bishkekLng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  let marker = L.marker([bishkekLat, bishkekLng]).addTo(map);
  const latInput = document.getElementById('latitude');
  const lonInput = document.getElementById('longitude');
  latInput.value = bishkekLat;
  lonInput.value = bishkekLng;
  map.on('click', (e) => {
    marker.setLatLng(e.latlng);
    latInput.value = e.latlng.lat.toFixed(6);
    lonInput.value = e.latlng.lng.toFixed(6);
  });
  // Toggle time input based on delivery choice
  const deliverySelect = document.getElementById('delivery-choice');
  const timeLabel = document.getElementById('delivery-time-label');
  deliverySelect.addEventListener('change', () => {
    if (deliverySelect.value === 'schedule') {
      timeLabel.style.display = 'block';
    } else {
      timeLabel.style.display = 'none';
    }
  });
  // Handle form submission
  const form = document.getElementById('checkout-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Built-in validation
    if (!form.reportValidity()) {
      return;
    }
    // Validate age: must be >= 16 years
    const ageStr = document.getElementById('order-age').value.trim();
    const parts = ageStr.split('.');
    let validAge = false;
    if (parts.length === 3) {
      const d = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const y = parseInt(parts[2], 10);
      const birth = new Date(y, m, d);
      if (!isNaN(birth)) {
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const mm = today.getMonth() - birth.getMonth();
        if (mm < 0 || (mm === 0 && today.getDate() < birth.getDate())) {
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
    // If delivery is scheduled, validate time field pattern (already validated by pattern attr)
    // Show success message and clear cart
    const messageDiv = document.getElementById('checkout-message');
    messageDiv.innerHTML = '<p>Спасибо за заказ! Мы свяжемся с вами по указанному телефону.</p>';
    messageDiv.style.display = 'block';
    try {
      localStorage.removeItem('cart');
    } catch (e) {
      console.warn('Could not clear stored cart', e);
    }
    // Optionally redirect back to home page after short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 3000);
  });
});