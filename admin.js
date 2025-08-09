// admin.js: simple admin panel to edit contact info, combo names and view orders
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('admin-phone');
  const whatsappInput = document.getElementById('admin-whatsapp');
  const combo1Input = document.getElementById('admin-combo1');
  const combo2Input = document.getElementById('admin-combo2');
  const combo3Input = document.getElementById('admin-combo3');
  const apiKeyInput = document.getElementById('admin-api-key');
  // Load existing settings
  try {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || {};
    if (settings.phone) phoneInput.value = settings.phone;
    if (settings.whatsapp) whatsappInput.value = settings.whatsapp;
    if (Array.isArray(settings.comboNames)) {
      combo1Input.value = settings.comboNames[0] || '';
      combo2Input.value = settings.comboNames[1] || '';
      combo3Input.value = settings.comboNames[2] || '';
    }
    if (settings.apiKey) apiKeyInput.value = settings.apiKey;
  } catch (err) {
    console.warn('Could not parse admin settings', err);
  }
  // Save settings when form submitted
  document.getElementById('admin-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const settings = {
      phone: phoneInput.value.trim(),
      whatsapp: whatsappInput.value.trim(),
      comboNames: [combo1Input.value.trim(), combo2Input.value.trim(), combo3Input.value.trim()],
      apiKey: apiKeyInput.value.trim()
    };
    try {
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      alert('Настройки сохранены. Обновите главную страницу, чтобы увидеть изменения.');
    } catch (err) {
      console.warn('Could not save admin settings', err);
    }
  });
  // Display order history
  const ordersList = document.getElementById('orders-list');
  try {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (orders.length === 0) {
      ordersList.innerHTML = '<li>Заказы отсутствуют.</li>';
    } else {
      orders.forEach(order => {
        const li = document.createElement('li');
        const items = Object.entries(order.items || {}).map(([title, qty]) => `${title}×${qty}`).join(', ');
        const date = order.createdAt ? new Date(order.createdAt).toLocaleString('ru-RU') : '';
        li.textContent = `${date}: ${items}`;
        ordersList.appendChild(li);
      });
    }
  } catch (err) {
    ordersList.innerHTML = '<li>Не удалось загрузить историю заказов.</li>';
    console.warn('Could not parse orders', err);
  }
});