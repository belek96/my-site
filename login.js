// login.js: simple login with email/phone and verification code
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const verifySection = document.getElementById('login-verify-section');
  const messageDiv = document.getElementById('login-message');
  let verificationCode = '';
  let ident = '';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ident = document.getElementById('login-ident').value.trim();
    if (!ident) return;
    // Check if user exists
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('users')) || [];
    } catch (err) {
      console.warn('Could not parse users', err);
    }
    const user = users.find(u => u.email === ident || u.phone === ident);
    if (!user) {
      messageDiv.style.color = '#d2002d';
      messageDiv.textContent = 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.';
      return;
    }
    // Generate and display code
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    messageDiv.style.color = '#333333';
    messageDiv.textContent = 'Код подтверждения: ' + verificationCode + ' (это демонстрационный код)';
    verifySection.style.display = 'block';
  });
  document.getElementById('login-verify-btn').addEventListener('click', () => {
    const entered = document.getElementById('login-code-input').value.trim();
    if (entered === verificationCode) {
      // Save current user to localStorage
      try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === ident || u.phone === ident);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      } catch (err) {
        console.warn('Could not save login', err);
      }
      messageDiv.style.color = '#28a745';
      messageDiv.textContent = 'Вход выполнен! Перенаправление...';
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      messageDiv.style.color = '#d2002d';
      messageDiv.textContent = 'Неверный код. Попробуйте ещё раз.';
    }
  });
});