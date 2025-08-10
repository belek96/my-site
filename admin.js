// admin.js: расширенная админ‑панель с защитой паролем,
// блокировкой, капчей, управлением товарами и настройками.

document.addEventListener('DOMContentLoaded', () => {
  const ADMIN_PASSWORD = 'Weareelectric123123a';
  const loginSection = document.getElementById('admin-login-section');
  const loginMessage = document.getElementById('admin-login-message');
  const loginForm = document.getElementById('admin-login-form');
  const passwordInput = document.getElementById('admin-password');
  const captchaDiv = document.getElementById('admin-captcha');
  const captchaQuestion = document.getElementById('captcha-question');
  const captchaForm = document.getElementById('captcha-form');
  const captchaAnswerInput = document.getElementById('captcha-answer');
  const adminContent = document.getElementById('admin-content');
  const productList = document.getElementById('product-list');
  const addProductForm = document.getElementById('add-product-form');
  const newSectionSelect = document.getElementById('new-product-section');
  const newNameInput = document.getElementById('new-product-name');
  const newDescInput = document.getElementById('new-product-desc');
  const newPriceInput = document.getElementById('new-product-price');
  const newImageInput = document.getElementById('new-product-image');
  // File input for uploading images
  const newImageFileInput = document.getElementById('new-product-image-file');
  // SMS key input for messaging service
  const smsKeyInput = document.getElementById('admin-sms-key');

  // Helper: load admin state from localStorage
  function getAdminState() {
    const state = JSON.parse(localStorage.getItem('adminState') || '{}');
    return state;
  }
  function setAdminState(newState) {
    const state = Object.assign({}, getAdminState(), newState);
    localStorage.setItem('adminState', JSON.stringify(state));
  }

  // Helper: load or initialize product data
  function loadProducts() {
    let products;
    try {
      products = JSON.parse(localStorage.getItem('products'));
    } catch (e) {
      products = null;
    }
    if (!Array.isArray(products) || products.length === 0) {
      // initialise with default menu items
      products = [
        // Комбо
        { id: 'combo1', section: 'combos', name: 'Комбо хит сезона', desc: 'Описание комбо хит сезона.', price: 0, discount: null, image: 'combo-placeholder.png' },
        { id: 'combo2', section: 'combos', name: 'Комбо классика', desc: 'Описание комбо классика.', price: 0, discount: null, image: 'combo-placeholder.png' },
        { id: 'combo3', section: 'combos', name: 'Комбо премиум', desc: 'Описание комбо премиум.', price: 0, discount: null, image: 'combo-placeholder.png' },
        // Пиццы
        { id: 'pizza1', section: 'pizzas', name: 'Пепперони', desc: 'Описание пиццы Пепперони.', price: 0, discount: null, image: 'pizza-placeholder.png' },
        { id: 'pizza2', section: 'pizzas', name: 'Маргарита', desc: 'Описание пиццы Маргарита.', price: 0, discount: null, image: 'pizza-placeholder.png' },
        { id: 'pizza3', section: 'pizzas', name: 'Нежный цыпленок', desc: 'Описание пиццы Нежный цыпленок.', price: 0, discount: null, image: 'pizza-placeholder.png' },
        // Роллы
        { id: 'roll1', section: 'rolls', name: 'Темпура со сливочным сыром', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll2', section: 'rolls', name: 'Филадельфия с огурцом', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll3', section: 'rolls', name: 'Калифорния с крабом', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll4', section: 'rolls', name: 'С курицей терияки', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll5', section: 'rolls', name: 'Спайси краб', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll6', section: 'rolls', name: 'Темпура с лососем и сыром', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll7', section: 'rolls', name: 'Темпура Спайси лосось', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll8', section: 'rolls', name: 'Филадельфия «Мидори»', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll9', section: 'rolls', name: 'Лосось Абури', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll10', section: 'rolls', name: 'С угрём и лососем', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        { id: 'roll11', section: 'rolls', name: 'Темпура угорь', desc: 'Описание позиции.', price: 0, discount: null, image: 'roll-placeholder.png' },
        // Баскеты
        { id: 'basket1', section: 'baskets', name: 'Баскет L', desc: 'Описание баскета L.', price: 0, discount: null, image: 'basket-placeholder.png' },
        { id: 'basket2', section: 'baskets', name: 'Баскет M', desc: 'Описание баскета M.', price: 0, discount: null, image: 'basket-placeholder.png' },
        { id: 'basket3', section: 'baskets', name: 'Баскет XL', desc: 'Описание баскета XL.', price: 0, discount: null, image: 'basket-placeholder.png' },
        // Напитки
        { id: 'drink1', section: 'drinks', name: 'Кока Кола', desc: '', price: 0, discount: null, image: 'drink-placeholder.png' },
        { id: 'drink2', section: 'drinks', name: 'Фанта', desc: '', price: 0, discount: null, image: 'drink-placeholder.png' },
        { id: 'drink3', section: 'drinks', name: 'Спрайт', desc: '', price: 0, discount: null, image: 'drink-placeholder.png' }
      ];
      localStorage.setItem('products', JSON.stringify(products));
    }
    return products;
  }

  // Save products list back to localStorage
  function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }

  // Render editable product list in admin panel
  function updateProductList() {
    const products = loadProducts();
    // Clear current list
    productList.innerHTML = '';
    products.forEach((prod, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'admin-product-item';
      wrapper.style.border = '1px solid #eee';
      wrapper.style.padding = '8px';
      wrapper.style.marginBottom = '12px';
      wrapper.innerHTML = `
        <strong>${prod.section.toUpperCase()} / ${prod.id}</strong><br>
        <label>Название: <input type="text" value="${escapeHtml(prod.name)}" data-index="${index}" data-field="name" style="width:60%;"></label><br>
        <label>Описание: <textarea rows="2" data-index="${index}" data-field="desc" style="width:60%;">${escapeHtml(prod.desc)}</textarea></label><br>
        <label>Цена: <input type="number" step="0.01" min="0" value="${prod.price}" data-index="${index}" data-field="price" style="width:120px;"></label><br>
        <label>Скидка: <input type="number" step="0.01" min="0" value="${prod.discount !== null ? prod.discount : ''}" data-index="${index}" data-field="discount" placeholder="0" style="width:120px;"></label><br>
        <label>Раздел: <select data-index="${index}" data-field="section">
          ${['combos','pizzas','rolls','baskets','drinks'].map(s => `<option value="${s}" ${s===prod.section?'selected':''}>${s}</option>`).join('')}
        </select></label><br>
        <label>Изображение: <input type="text" value="${escapeHtml(prod.image)}" data-index="${index}" data-field="image" style="width:60%;"></label><br>
        <button class="admin-save-item" data-index="${index}" style="margin-top:6px;">Сохранить</button>
        <button class="admin-delete-item" data-index="${index}" style="margin-top:6px;margin-left:6px;">Удалить</button>
      `;
      productList.appendChild(wrapper);
    });
    // Attach save and delete listeners
    productList.querySelectorAll('.admin-save-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const prods = loadProducts();
        const fields = productList.querySelectorAll(`[data-index="${idx}"]`);
        fields.forEach(field => {
          const f = field.getAttribute('data-field');
          let val = field.value;
          if (f === 'price' || f === 'discount') {
            val = val === '' ? null : parseFloat(val);
          }
            prods[idx][f] = val;
        });
        saveProducts(prods);
        alert('Позиция обновлена');
        updateProductList();
      });
    });
    productList.querySelectorAll('.admin-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const prods = loadProducts();
        if (confirm('Удалить позицию "' + prods[idx].name + '"?')) {
          prods.splice(idx, 1);
          saveProducts(prods);
          updateProductList();
        }
      });
    });
  }

  // Escape HTML special characters to prevent injection in admin panel
  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, (c) => {
      const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\'': '&#39;', '"': '&quot;' };
      return map[c];
    });
  }

  // Handle adding a new product
  addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const section = newSectionSelect.value;
    const name = newNameInput.value.trim();
    const desc = newDescInput.value.trim();
    const price = parseFloat(newPriceInput.value);
    const imageFile = newImageFileInput && newImageFileInput.files && newImageFileInput.files[0];
    const imageText = newImageInput.value.trim();
    if (!name || isNaN(price) || (!imageText && !imageFile)) {
      alert('Пожалуйста, заполните все поля для новой позиции.');
      return;
    }
    // helper to finish adding after reading file or using text
    function finishAdd(imageData) {
      const products = loadProducts();
      const id = `${section}-${Date.now()}`;
      products.push({ id, section, name, desc, price, discount: null, image: imageData });
      saveProducts(products);
      newNameInput.value = '';
      newDescInput.value = '';
      newPriceInput.value = '';
      newImageInput.value = '';
      if (newImageFileInput) newImageFileInput.value = '';
      alert('Новая позиция добавлена');
      updateProductList();
    }
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        finishAdd(ev.target.result);
      };
      reader.readAsDataURL(imageFile);
      return;
    }
    // no file selected, use text field
    finishAdd(imageText);
  });

  // Populate the settings form with current values
  function loadSettings() {
    const phoneInput = document.getElementById('admin-phone');
    const whatsappInput = document.getElementById('admin-whatsapp');
    const combo1Input = document.getElementById('admin-combo1');
    const combo2Input = document.getElementById('admin-combo2');
    const combo3Input = document.getElementById('admin-combo3');
    const apiKeyInput = document.getElementById('admin-api-key');
    const smsKeyInputLocal = document.getElementById('admin-sms-key');
    const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    if (settings.phone) phoneInput.value = settings.phone;
    if (settings.whatsapp) whatsappInput.value = settings.whatsapp;
    if (Array.isArray(settings.comboNames)) {
      combo1Input.value = settings.comboNames[0] || '';
      combo2Input.value = settings.comboNames[1] || '';
      combo3Input.value = settings.comboNames[2] || '';
    }
    if (settings.apiKey) apiKeyInput.value = settings.apiKey;
    if (settings.smsKey && smsKeyInputLocal) smsKeyInputLocal.value = settings.smsKey;
  }

  function initAdminPanel() {
    // hide login, show content
    loginSection.style.display = 'none';
    adminContent.style.display = 'block';
    loadSettings();
    updateProductList();
    // handle saving settings
    document.getElementById('admin-settings-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneVal = document.getElementById('admin-phone').value.trim();
      const whatsappVal = document.getElementById('admin-whatsapp').value.trim();
      const comboVals = [document.getElementById('admin-combo1').value.trim(), document.getElementById('admin-combo2').value.trim(), document.getElementById('admin-combo3').value.trim()];
      const apiKeyVal = document.getElementById('admin-api-key').value.trim();
      const smsKeyVal = smsKeyInput ? smsKeyInput.value.trim() : '';
      const settings = {
        phone: phoneVal,
        whatsapp: whatsappVal,
        comboNames: comboVals,
        apiKey: apiKeyVal,
        smsKey: smsKeyVal
      };
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      alert('Настройки сохранены');
    });
    // display order history
    displayOrders();
  }

  function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';
    try {
      const orders = JSON.parse(localStorage.getItem('orders')) || [];
      if (!Array.isArray(orders) || orders.length === 0) {
        ordersList.innerHTML = '<li>Заказы отсутствуют.</li>';
        return;
      }
      orders.forEach(order => {
        const li = document.createElement('li');
        const items = Object.entries(order.items || {}).map(([title, qty]) => `${title}×${qty}`).join(', ');
        const date = order.createdAt ? new Date(order.createdAt).toLocaleString('ru-RU') : '';
        li.textContent = `${date}: ${items} [${order.paymentStatus || ''}]`;
        ordersList.appendChild(li);
      });
    } catch (e) {
      ordersList.innerHTML = '<li>Не удалось загрузить историю заказов.</li>';
    }
  }

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setAdminState({ captchaAnswer: a + b });
    captchaQuestion.textContent = `Введите сумму ${a} + ${b}`;
  }

  function showCaptcha() {
    loginForm.style.display = 'none';
    captchaDiv.style.display = 'block';
    generateCaptcha();
  }

  function hideCaptcha() {
    captchaDiv.style.display = 'none';
    loginForm.style.display = 'block';
  }

  // Handle captcha submission
  captchaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const expected = getAdminState().captchaAnswer;
    const userAnswer = parseInt(captchaAnswerInput.value, 10);
    if (userAnswer === expected) {
      // reset attempts and lock, allow login again
      setAdminState({ attempts: 0, lockedUntil: 0, captchaAnswer: null });
      hideCaptcha();
      loginMessage.textContent = 'Введите пароль администратора.';
      passwordInput.value = '';
    } else {
      loginMessage.textContent = 'Неверный ответ на капчу. Попробуйте ещё раз.';
      captchaAnswerInput.value = '';
      generateCaptcha();
    }
  });

  // Handle login form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const state = getAdminState();
    const now = Date.now();
    if (state.lockedUntil && now < state.lockedUntil) {
      const remaining = Math.ceil((state.lockedUntil - now) / 60000);
      loginMessage.textContent = `Вы заблокированы. Попробуйте через ${remaining} мин.`;
      return;
    }
    const pwd = passwordInput.value;
    if (pwd === ADMIN_PASSWORD) {
      // successful login
      setAdminState({ loggedIn: true, attempts: 0, lockedUntil: 0 });
      initAdminPanel();
    } else {
      // increment attempts
      const attempts = (state.attempts || 0) + 1;
      if (attempts >= 3) {
        // lock for 5 minutes
        const lockUntil = now + 5 * 60 * 1000;
        setAdminState({ attempts, lockedUntil: lockUntil });
        loginMessage.textContent = 'Неверный пароль. Слишком много попыток, вы заблокированы на 5 минут.';
        // After lock expires show captcha
        setTimeout(() => {
          showCaptcha();
        }, 5 * 60 * 1000);
      } else {
        setAdminState({ attempts });
        loginMessage.textContent = `Неверный пароль. Осталось попыток: ${3 - attempts}`;
      }
      passwordInput.value = '';
    }
  });

  // Check if admin already logged in
  const state = getAdminState();
  if (state.loggedIn) {
    initAdminPanel();
  } else {
    // If locked but time has passed, require captcha
    const now = Date.now();
    if (state.lockedUntil && now < state.lockedUntil) {
      const remaining = Math.ceil((state.lockedUntil - now) / 60000);
      loginMessage.textContent = `Вы заблокированы. Попробуйте через ${remaining} мин.`;
      loginForm.style.display = 'none';
    } else if (state.lockedUntil && now >= state.lockedUntil) {
      showCaptcha();
    }
  }
});