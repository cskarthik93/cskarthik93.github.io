<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $subject = $_POST['subject'];
    $message = $_POST['message'];

    // Validate and sanitize the form data here
    $name = strip_tags(trim($name));
    $email = filter_var(trim($email), FILTER_SANITIZE_EMAIL);
    $subject = strip_tags(trim($subject));
    $message = trim($message);

    // Check if the form fields are not empty
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo 'Please fill in all required fields.';
        exit;
    }

    // Check if the email address is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 'Please enter a valid email address.';
        exit;
    }

    // Send the email
    $to = 'cskarthik93@gmail.com';
    $headers = "From: $email\r\n";
    $body = "Name: $name\nEmail: $email\nSubject: $subject\nMessage: $message";

    if (mail($to, $subject, $body, $headers)) {
        echo 'success';
    } else {
        echo 'An error occurred while sending the email.';
    }
} else {
    echo 'Invalid request method.';
}
?>