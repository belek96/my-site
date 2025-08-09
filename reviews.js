// reviews.js: handles submission of the review form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('review-form');
  const messageBox = document.getElementById('review-message-box');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Use built-in validation
    if (!form.reportValidity()) {
      return;
    }
    // Normally here we would send the review to a server or store it
    // For this demo, simply display a thank you message
    messageBox.innerHTML = '<p>Спасибо за ваш отзыв! Мы ценим ваше мнение.</p>';
    messageBox.style.display = 'block';
    // Reset the form fields
    form.reset();
  });
});