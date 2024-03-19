const form = document.querySelector('.php-email-form');
const loadingDiv = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');
const sentMessage = document.querySelector('.sent-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Show loading message
  loadingDiv.style.display = 'block';
  errorMessage.style.display = 'none';
  sentMessage.style.display = 'none';

  const formData = new FormData(form);

  fetch(netlify, {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    loadingDiv.style.display = 'none';
    console.log(data);
    if (data === 'success') {
      sentMessage.style.display = 'block';
    } else {
      errorMessage.innerHTML = data;
      errorMessage.style.display = 'block';
    }
  })
  .catch(error => {
    loadingDiv.style.display = 'none';
    errorMessage.innerHTML = 'An error occurred. Please try again later.';
    errorMessage.style.display = 'block';
  });
});