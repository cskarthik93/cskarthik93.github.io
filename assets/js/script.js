function sendEmail(event) {
  event.preventDefault();

  const form = document.querySelector('.php-email-form');
  const loadingDiv = document.querySelector('.loading');
  const errorMessage = document.querySelector('.error-message');
  const sentMessage = document.querySelector('.sent-message');

  // Check if any input fields are empty
  const name = document.querySelector('input[name="name"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const subject = document.querySelector('input[name="subject"]').value.trim();
  const message = document.querySelector('textarea[name="message"]').value.trim();

  if (name === '' || email === '' || subject === '' || message === '') {
    errorMessage.textContent = 'Please fill in all required fields.';
    errorMessage.classList.add('error');
    return;
  }

  loadingDiv.style.display = 'block';
  errorMessage.style.display = 'none';
  sentMessage.style.display = 'none';

  emailjs.sendForm('service_mw4jgdd', 'template_cl7aeoa', form, 'zC3-rTdaAcvL9Jt8F', {
    from_name: name,
    from_email: email,
    subject: subject,
    message_html: message,
  })
  .then(() => {
    // Check if the email was sent successfully before displaying the success message
    loadingDiv.style.display = 'none';
    sentMessage.style.display = 'block';
    form.reset();
  })
  .catch((error) => {
    loadingDiv.style.display = 'none';

    if (error.code === 'ENETWORK_ERROR') {
      errorMessage.textContent = 'A network error occurred. Please try again later.';
    } else {
      errorMessage.textContent = 'An error occurred while sending the email. Please try again later.';
    }

    errorMessage.style.display = 'block';
    console.error('Error sending email:', error);
  });
}
