function sendEmail(event) {
 event.preventDefault();

const form = document.querySelector('.php-email-form');
const loadingDiv = document.querySelector('.loading');
const errorMessage = document.querySelector('.error-message');
const sentMessage = document.querySelector('.sent-message');

 loadingDiv.style.display = 'block';
 errorMessage.style.display = 'none';
 sentMessage.style.display = 'none';

 const name = document.querySelector('input[name="name"]').value;
 const email = document.querySelector('input[name="email"]').value;
 const subject = document.querySelector('input[name="subject"]').value;
 const message = document.querySelector('textarea[name="message"]').value;

 emailjs.sendForm('service_mw4jgdd', 'template_cl7aeoa', form, 'zC3-rTdaAcvL9Jt8F', {
  from_name: name,
  from_email: email,
  subject: subject,
  message_html: message,
})
   .then(() => {
     loadingDiv.style.display = 'none';
     sentMessage.style.display = 'block';
     form.reset();
   })
   .catch((error) => {
     loadingDiv.style.display = 'none';
     errorMessage.innerHTML = 'An error occurred while sending the email. Please try again later.';
     errorMessage.style.display = 'block';
     console.error('Error sending email:', error);
   });
}